import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function is designed to be called by pg_cron daily or via manual trigger.
// It checks each user's email preferences and sends relevant notifications.
//
// Setup:
// 1. Deploy this Edge Function
// 2. Set RESEND_API_KEY in Supabase Edge Function secrets
// 3. Create a pg_cron job:
//    SELECT cron.schedule('daily-notifications', '0 9 * * *',
//      $$SELECT net.http_post(
//        url := 'https://YOUR_PROJECT.supabase.co/functions/v1/send-notifications',
//        headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY", "Content-Type": "application/json"}'::jsonb,
//        body := '{"type": "daily"}'::jsonb
//      )$$
//    );

interface NotificationPayload {
  type: "daily" | "trial_reminder" | "price_alert" | "monthly_digest";
}

const VALID_TYPES = new Set(["daily", "trial_reminder", "price_alert", "monthly_digest"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth check: only allow calls with the service role key
    const authHeader = req.headers.get("Authorization");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!authHeader || !authHeader.includes(serviceRoleKey)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    if (!body || !VALID_TYPES.has(body.type)) {
      return new Response(JSON.stringify({ error: "Invalid or missing 'type' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { type } = body as NotificationPayload;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      serviceRoleKey,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all users with their email preferences
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, email_preferences");

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: "No profiles found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // Hoist price changes query outside the user loop (same for all users)
    let globalChanges: any[] = [];
    if (type === "daily" || type === "price_alert") {
      const { data: changes } = await supabase
        .from("price_changes")
        .select("*, known_services(name)")
        .gte("effective_date", today)
        .order("effective_date", { ascending: true })
        .limit(10);
      globalChanges = changes || [];
    }

    let sent = 0;
    let failed = 0;

    for (const profile of profiles) {
      const prefs = profile.email_preferences || {};
      const emails: { subject: string; html: string }[] = [];

      // Trial reminders (2 days before expiry)
      if (prefs.trial_reminders && (type === "daily" || type === "trial_reminder")) {
        const twoDaysOut = new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0];
        const { data: trials } = await supabase
          .from("subscriptions")
          .select("*, known_services(name)")
          .eq("user_id", profile.id)
          .eq("is_trial", true)
          .is("archived_at", null)
          .lte("trial_end_date", twoDaysOut)
          .gte("trial_end_date", today);

        if (trials && trials.length > 0) {
          const names = trials.map((t: any) => t.known_services?.name || t.custom_name || "Unknown").join(", ");
          emails.push({
            subject: `Trial ending soon: ${names}`,
            html: `<div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:24px">
              <h2 style="color:#000">Trial Reminder</h2>
              <p>Your trial${trials.length > 1 ? "s" : ""} for <strong>${names}</strong> ${trials.length > 1 ? "are" : "is"} ending in the next 2 days.</p>
              <p>Log in to SubTrim to decide whether to keep or cancel.</p>
              <a href="https://subtrim.dev" style="display:inline-block;background:#00d48a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:12px">Open SubTrim</a>
            </div>`,
          });
        }
      }

      // Price change alerts
      if (prefs.price_change_alerts && (type === "daily" || type === "price_alert") && globalChanges.length > 0) {
        // Only alert if user has the affected service
        const { data: userSubs } = await supabase
          .from("subscriptions")
          .select("service_id")
          .eq("user_id", profile.id)
          .is("archived_at", null);

        const userServiceIds = new Set((userSubs || []).map((s: any) => s.service_id));
        const relevant = globalChanges.filter((c: any) => userServiceIds.has(c.service_id));

        if (relevant.length > 0) {
          const rows = relevant
            .map((c: any) => `<tr><td>${c.known_services?.name}</td><td style="text-decoration:line-through;color:#888">$${c.old_price}</td><td style="color:#ef4444;font-weight:700">$${c.new_price}</td><td>${c.effective_date}</td></tr>`)
            .join("");
          emails.push({
            subject: `Price changes affecting your subscriptions`,
            html: `<div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:24px">
              <h2 style="color:#000">Price Changes</h2>
              <table style="width:100%;border-collapse:collapse">${rows}</table>
              <a href="https://subtrim.dev" style="display:inline-block;background:#00d48a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px">Review in SubTrim</a>
            </div>`,
          });
        }
      }

      // Monthly digest (only on type=monthly_digest)
      if (prefs.monthly_digest && type === "monthly_digest") {
        const { data: userSubs } = await supabase
          .from("subscriptions")
          .select("monthly_cost")
          .eq("user_id", profile.id)
          .is("archived_at", null);

        const total = (userSubs || []).reduce((a: number, s: any) => a + Number(s.monthly_cost), 0);
        const count = (userSubs || []).length;

        const { data: scoreRow } = await supabase
          .from("score_history")
          .select("score")
          .eq("user_id", profile.id)
          .order("calculated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        emails.push({
          subject: `Your SubTrim Monthly Digest`,
          html: `<div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:24px">
            <h2 style="color:#000">Monthly Digest</h2>
            <p><strong>${count}</strong> active subscriptions totaling <strong>$${total.toFixed(2)}/mo</strong></p>
            ${scoreRow ? `<p>Your SubScore: <strong>${scoreRow.score}</strong>/100</p>` : "<p>Run an audit to get your SubScore!</p>"}
            <a href="https://subtrim.dev" style="display:inline-block;background:#00d48a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:12px">Open SubTrim</a>
          </div>`,
        });
      }

      // Send all emails for this user
      for (const email of emails) {
        if (!profile.email) continue;
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "SubTrim <notifications@subtrim.dev>",
              to: [profile.email],
              subject: email.subject,
              html: email.html,
            }),
          });
          if (res.ok) {
            sent++;
          } else {
            failed++;
          }
        } catch {
          failed++;
        }
      }
    }

    return new Response(JSON.stringify({ sent, failed, message: `Sent ${sent} emails${failed ? `, ${failed} failed` : ""}` }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
