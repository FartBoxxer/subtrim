-- ============================================================
-- SubTrim — Full Supabase Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- ==================== TABLES ====================

-- 1. Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  category_budgets JSONB DEFAULT '{}'::jsonb,
  email_preferences JSONB DEFAULT '{"monthly_digest": false, "promo_alerts": false, "price_change_alerts": false, "trial_reminders": false}'::jsonb,
  onboarding_complete BOOLEAN DEFAULT false,
  currency TEXT DEFAULT 'USD',
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Households
CREATE TABLE public.households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Household Members
CREATE TABLE public.household_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(household_id, user_id)
);

-- 4. Known Services (reference catalog)
CREATE TABLE public.known_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  icon_url TEXT,
  typical_monthly_price NUMERIC(10,2),
  typical_annual_price NUMERIC(10,2),
  has_family_plan BOOLEAN DEFAULT false,
  family_plan_price NUMERIC(10,2),
  family_plan_max_members INT,
  website_url TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}'
);

-- 5. Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.known_services(id) ON DELETE SET NULL,
  custom_name TEXT,
  custom_category TEXT,
  custom_tags TEXT[] DEFAULT '{}',
  monthly_cost NUMERIC(10,2) NOT NULL,
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('weekly', 'monthly', 'annual')),
  renewal_date DATE,
  is_trial BOOLEAN DEFAULT false,
  trial_end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused', 'trial')),
  is_private BOOLEAN DEFAULT false,
  notes TEXT,
  last_audited_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Usage Surveys
CREATE TABLE public.usage_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE NOT NULL,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly', 'rarely', 'never')),
  satisfaction INT CHECK (satisfaction BETWEEN 1 AND 5),
  would_miss BOOLEAN,
  surveyed_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Promos
CREATE TABLE public.promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.known_services(id) ON DELETE CASCADE NOT NULL,
  promo_description TEXT NOT NULL,
  discount_percent INT,
  promo_type TEXT DEFAULT 'everyone' CHECK (promo_type IN ('new_customer', 'existing', 'everyone')),
  promo_url TEXT,
  valid_from DATE,
  valid_until DATE,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'scraped', 'community')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Price Changes
CREATE TABLE public.price_changes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.known_services(id) ON DELETE CASCADE NOT NULL,
  old_price NUMERIC(10,2) NOT NULL,
  new_price NUMERIC(10,2) NOT NULL,
  effective_date DATE NOT NULL,
  announced_date DATE,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Score History
CREATE TABLE public.score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  total_monthly_spend NUMERIC(10,2),
  total_subscriptions INT,
  overlap_count INT DEFAULT 0,
  unused_count INT DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT now()
);

-- ==================== INDEXES ====================

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_service_id ON public.subscriptions(service_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_usage_surveys_subscription_id ON public.usage_surveys(subscription_id);
CREATE INDEX idx_usage_surveys_user_id ON public.usage_surveys(user_id);
CREATE INDEX idx_promos_valid_until ON public.promos(valid_until);
CREATE INDEX idx_promos_service_id ON public.promos(service_id);
CREATE INDEX idx_household_members_household_id ON public.household_members(household_id);
CREATE INDEX idx_household_members_user_id ON public.household_members(user_id);
CREATE INDEX idx_score_history_user_id ON public.score_history(user_id);
CREATE INDEX idx_score_history_calculated_at ON public.score_history(calculated_at);

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.known_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.score_history ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Known Services: readable by all authenticated users
CREATE POLICY "Authenticated users can read known_services" ON public.known_services FOR SELECT USING (auth.role() = 'authenticated');

-- Promos: readable by all authenticated users
CREATE POLICY "Authenticated users can read promos" ON public.promos FOR SELECT USING (auth.role() = 'authenticated');

-- Price Changes: readable by all authenticated users
CREATE POLICY "Authenticated users can read price_changes" ON public.price_changes FOR SELECT USING (auth.role() = 'authenticated');

-- Subscriptions: users can CRUD their own
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscriptions" ON public.subscriptions FOR DELETE USING (auth.uid() = user_id);

-- Household members can see non-private subs of other members
CREATE POLICY "Household members can view non-private subs" ON public.subscriptions FOR SELECT USING (
  is_private = false AND
  user_id IN (
    SELECT hm2.user_id FROM public.household_members hm1
    JOIN public.household_members hm2 ON hm1.household_id = hm2.household_id
    WHERE hm1.user_id = auth.uid()
  )
);

-- Usage Surveys: users can CRUD their own
CREATE POLICY "Users can view own surveys" ON public.usage_surveys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own surveys" ON public.usage_surveys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own surveys" ON public.usage_surveys FOR UPDATE USING (auth.uid() = user_id);

-- Score History: private to each user
CREATE POLICY "Users can view own score history" ON public.score_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own score history" ON public.score_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Households: members can view their household
CREATE POLICY "Members can view their household" ON public.households FOR SELECT USING (
  id IN (SELECT household_id FROM public.household_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users can create households" ON public.households FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Household Members: members can view their household's members
CREATE POLICY "Members can view household members" ON public.household_members FOR SELECT USING (
  household_id IN (SELECT household_id FROM public.household_members WHERE user_id = auth.uid())
);
CREATE POLICY "Users can join households" ON public.household_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==================== AUTO-CREATE PROFILE ON SIGNUP ====================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== SEED: KNOWN SERVICES ====================

INSERT INTO public.known_services (name, category, typical_monthly_price, typical_annual_price, has_family_plan, family_plan_price, family_plan_max_members, website_url, tags) VALUES
-- Streaming
('Netflix', 'streaming', 15.49, 155.88, false, NULL, NULL, 'https://netflix.com', ARRAY['video_streaming']),
('Hulu', 'streaming', 7.99, 95.88, false, NULL, NULL, 'https://hulu.com', ARRAY['video_streaming', 'live_tv']),
('Disney+', 'streaming', 7.99, 79.99, false, NULL, NULL, 'https://disneyplus.com', ARRAY['video_streaming']),
('HBO Max', 'streaming', 15.99, 149.99, false, NULL, NULL, 'https://max.com', ARRAY['video_streaming']),
('Paramount+', 'streaming', 5.99, 59.99, false, NULL, NULL, 'https://paramountplus.com', ARRAY['video_streaming']),
('Peacock', 'streaming', 5.99, 59.99, false, NULL, NULL, 'https://peacocktv.com', ARRAY['video_streaming']),
('Apple TV+', 'streaming', 9.99, 99.00, true, 14.95, 6, 'https://tv.apple.com', ARRAY['video_streaming']),
('Amazon Prime Video', 'streaming', 8.99, 107.88, false, NULL, NULL, 'https://amazon.com/primevideo', ARRAY['video_streaming']),
('Crunchyroll', 'streaming', 7.99, 79.99, true, 14.99, 6, 'https://crunchyroll.com', ARRAY['video_streaming', 'anime']),
('YouTube Premium', 'streaming', 13.99, 167.88, true, 22.99, 6, 'https://youtube.com/premium', ARRAY['video_streaming', 'music_streaming', 'ad_free']),
('Discovery+', 'streaming', 4.99, 49.99, false, NULL, NULL, 'https://discoveryplus.com', ARRAY['video_streaming']),
('Mubi', 'streaming', 14.99, 107.88, false, NULL, NULL, 'https://mubi.com', ARRAY['video_streaming', 'indie_film']),
-- Music
('Spotify', 'music', 10.99, 131.88, true, 16.99, 6, 'https://spotify.com', ARRAY['music_streaming', 'podcasts']),
('Apple Music', 'music', 10.99, 109.00, true, 16.99, 6, 'https://music.apple.com', ARRAY['music_streaming']),
('Tidal', 'music', 10.99, 131.88, true, 16.99, 6, 'https://tidal.com', ARRAY['music_streaming', 'hifi_audio']),
('Amazon Music', 'music', 9.99, 89.00, false, NULL, NULL, 'https://music.amazon.com', ARRAY['music_streaming']),
('Deezer', 'music', 10.99, 131.88, true, 17.99, 6, 'https://deezer.com', ARRAY['music_streaming']),
('YouTube Music', 'music', 10.99, 131.88, true, 16.99, 6, 'https://music.youtube.com', ARRAY['music_streaming']),
-- Gaming
('Xbox Game Pass', 'gaming', 14.99, 179.88, false, NULL, NULL, 'https://xbox.com/gamepass', ARRAY['gaming', 'cloud_gaming']),
('PlayStation Plus', 'gaming', 9.99, 79.99, false, NULL, NULL, 'https://playstation.com', ARRAY['gaming', 'online_multiplayer']),
('Nintendo Switch Online', 'gaming', 3.99, 19.99, true, 7.99, 8, 'https://nintendo.com', ARRAY['gaming', 'online_multiplayer']),
('EA Play', 'gaming', 5.99, 39.99, false, NULL, NULL, 'https://ea.com/ea-play', ARRAY['gaming']),
('Humble Choice', 'gaming', 11.99, 143.88, false, NULL, NULL, 'https://humblebundle.com', ARRAY['gaming']),
('GeForce NOW', 'gaming', 9.99, 99.99, false, NULL, NULL, 'https://nvidia.com/geforce-now', ARRAY['gaming', 'cloud_gaming']),
-- Productivity
('Microsoft 365', 'productivity', 9.99, 99.99, true, 12.99, 6, 'https://microsoft365.com', ARRAY['productivity', 'cloud_storage', 'office_suite']),
('Google One', 'productivity', 2.99, 29.99, true, 4.99, 6, 'https://one.google.com', ARRAY['cloud_storage', 'backup']),
('Notion', 'productivity', 8.00, 96.00, false, NULL, NULL, 'https://notion.so', ARRAY['productivity', 'notes', 'project_management']),
('Todoist', 'productivity', 4.00, 48.00, false, NULL, NULL, 'https://todoist.com', ARRAY['productivity', 'task_management']),
('Evernote', 'productivity', 14.99, 129.99, false, NULL, NULL, 'https://evernote.com', ARRAY['productivity', 'notes']),
('Dropbox', 'productivity', 11.99, 119.88, true, 19.99, 6, 'https://dropbox.com', ARRAY['cloud_storage', 'file_sync']),
('iCloud+', 'productivity', 2.99, 35.88, true, 9.99, 6, 'https://apple.com/icloud', ARRAY['cloud_storage', 'backup']),
('Slack Pro', 'productivity', 8.75, 105.00, false, NULL, NULL, 'https://slack.com', ARRAY['productivity', 'messaging', 'team_chat']),
-- Fitness
('Peloton', 'fitness', 12.99, 155.88, false, NULL, NULL, 'https://onepeloton.com', ARRAY['fitness', 'workout', 'cycling']),
('Apple Fitness+', 'fitness', 9.99, 79.99, true, 14.99, 6, 'https://apple.com/fitness', ARRAY['fitness', 'workout']),
('Strava Premium', 'fitness', 11.99, 79.99, false, NULL, NULL, 'https://strava.com', ARRAY['fitness', 'running', 'cycling']),
('MyFitnessPal Premium', 'fitness', 19.99, 79.99, false, NULL, NULL, 'https://myfitnesspal.com', ARRAY['fitness', 'nutrition', 'calorie_tracking']),
('Fitbod', 'fitness', 12.99, 79.99, false, NULL, NULL, 'https://fitbod.me', ARRAY['fitness', 'workout', 'strength_training']),
-- News & Reading
('NYT Digital', 'news', 17.00, 204.00, false, NULL, NULL, 'https://nytimes.com', ARRAY['news_general', 'journalism']),
('WSJ Digital', 'news', 38.99, 467.88, false, NULL, NULL, 'https://wsj.com', ARRAY['news_general', 'finance_news']),
('Washington Post', 'news', 10.00, 120.00, false, NULL, NULL, 'https://washingtonpost.com', ARRAY['news_general', 'journalism']),
('Medium', 'news', 5.00, 50.00, false, NULL, NULL, 'https://medium.com', ARRAY['reading', 'articles', 'blogging']),
('Audible', 'news', 14.95, 149.50, false, NULL, NULL, 'https://audible.com', ARRAY['audiobooks', 'reading']),
('Kindle Unlimited', 'news', 11.99, 143.88, false, NULL, NULL, 'https://amazon.com/kindleunlimited', ARRAY['reading', 'ebooks']),
('Scribd', 'news', 11.99, 143.88, false, NULL, NULL, 'https://scribd.com', ARRAY['reading', 'audiobooks', 'ebooks']),
('The Athletic', 'news', 9.99, 71.99, false, NULL, NULL, 'https://theathletic.com', ARRAY['news_sports', 'journalism']),
-- Creative
('Adobe Creative Cloud', 'creative', 54.99, 659.88, false, NULL, NULL, 'https://adobe.com', ARRAY['creative', 'photo_editing', 'video_editing', 'design']),
('Canva Pro', 'creative', 12.99, 119.99, true, 12.99, 5, 'https://canva.com', ARRAY['creative', 'design', 'social_media']),
('Figma', 'creative', 15.00, 144.00, false, NULL, NULL, 'https://figma.com', ARRAY['creative', 'design', 'prototyping']),
('Envato Elements', 'creative', 16.50, 198.00, false, NULL, NULL, 'https://elements.envato.com', ARRAY['creative', 'stock_assets', 'templates']),
-- VPN & Security
('NordVPN', 'security', 12.99, 71.88, false, NULL, NULL, 'https://nordvpn.com', ARRAY['vpn', 'security', 'privacy']),
('ExpressVPN', 'security', 12.95, 99.95, false, NULL, NULL, 'https://expressvpn.com', ARRAY['vpn', 'security', 'privacy']),
('Surfshark', 'security', 12.95, 47.88, false, NULL, NULL, 'https://surfshark.com', ARRAY['vpn', 'security', 'privacy']),
('1Password', 'security', 2.99, 35.88, true, 4.99, 5, 'https://1password.com', ARRAY['password_manager', 'security']),
('Bitwarden Premium', 'security', 0.83, 10.00, true, 3.33, 6, 'https://bitwarden.com', ARRAY['password_manager', 'security']),
-- Food & Delivery
('DoorDash DashPass', 'food', 9.99, 96.00, false, NULL, NULL, 'https://doordash.com', ARRAY['food_delivery', 'delivery']),
('Uber One', 'food', 9.99, 119.88, false, NULL, NULL, 'https://uber.com', ARRAY['food_delivery', 'delivery', 'rideshare']),
('Instacart+', 'food', 9.99, 99.00, false, NULL, NULL, 'https://instacart.com', ARRAY['grocery_delivery', 'delivery']),
('HelloFresh', 'food', 59.94, 719.28, false, NULL, NULL, 'https://hellofresh.com', ARRAY['meal_kit', 'cooking']),
('Blue Apron', 'food', 47.95, 575.40, false, NULL, NULL, 'https://blueapron.com', ARRAY['meal_kit', 'cooking']),
('Grubhub+', 'food', 9.99, 119.88, false, NULL, NULL, 'https://grubhub.com', ARRAY['food_delivery', 'delivery']),
-- AI & Dev Tools
('ChatGPT Plus', 'ai_tools', 20.00, 240.00, false, NULL, NULL, 'https://chat.openai.com', ARRAY['ai', 'chatbot', 'productivity']),
('Claude Pro', 'ai_tools', 20.00, 240.00, false, NULL, NULL, 'https://claude.ai', ARRAY['ai', 'chatbot', 'productivity']),
('GitHub Copilot', 'ai_tools', 10.00, 100.00, false, NULL, NULL, 'https://github.com/features/copilot', ARRAY['ai', 'coding', 'developer_tools']),
('Midjourney', 'ai_tools', 10.00, 96.00, false, NULL, NULL, 'https://midjourney.com', ARRAY['ai', 'image_generation', 'creative']),
('Cursor Pro', 'ai_tools', 20.00, 192.00, false, NULL, NULL, 'https://cursor.com', ARRAY['ai', 'coding', 'developer_tools']),
('Perplexity Pro', 'ai_tools', 20.00, 200.00, false, NULL, NULL, 'https://perplexity.ai', ARRAY['ai', 'search', 'research']),
-- Lifestyle & Other
('Amazon Prime', 'lifestyle', 14.99, 139.00, false, NULL, NULL, 'https://amazon.com/prime', ARRAY['shopping', 'video_streaming', 'delivery', 'music_streaming']),
('Costco Membership', 'lifestyle', 5.00, 60.00, false, NULL, NULL, 'https://costco.com', ARRAY['shopping', 'wholesale']),
('AAA Membership', 'lifestyle', 5.67, 68.00, true, 11.08, 4, 'https://aaa.com', ARRAY['roadside_assistance', 'insurance', 'travel']),
('BarkBox', 'lifestyle', 35.00, 276.00, false, NULL, NULL, 'https://barkbox.com', ARRAY['pets', 'subscription_box']),
('FabFitFun', 'lifestyle', 49.99, 199.99, false, NULL, NULL, 'https://fabfitfun.com', ARRAY['subscription_box', 'lifestyle']),
('Stitch Fix', 'lifestyle', 20.00, 240.00, false, NULL, NULL, 'https://stitchfix.com', ARRAY['fashion', 'subscription_box']),
('Rent the Runway', 'lifestyle', 89.00, 1068.00, false, NULL, NULL, 'https://renttherunway.com', ARRAY['fashion', 'rental']);

-- ==================== SEED: SAMPLE PROMOS ====================

INSERT INTO public.promos (service_id, promo_description, discount_percent, promo_type, promo_url, valid_from, valid_until, source) VALUES
((SELECT id FROM known_services WHERE name = 'Hulu'), '3 months for $2.99/mo', 63, 'new_customer', 'https://hulu.com/welcome', '2026-03-01', '2026-06-30', 'manual'),
((SELECT id FROM known_services WHERE name = 'Paramount+'), '50% off annual plan', 50, 'new_customer', 'https://paramountplus.com/offer', '2026-03-15', '2026-05-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Peacock'), 'First year $29.99 (was $59.99)', 50, 'new_customer', 'https://peacocktv.com/plans', '2026-02-01', '2026-07-01', 'manual'),
((SELECT id FROM known_services WHERE name = 'YouTube Premium'), '3 months free with Pixel purchase', 100, 'new_customer', 'https://youtube.com/premium', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Spotify'), 'Premium free for 3 months', 100, 'new_customer', 'https://spotify.com/premium', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Apple Music'), '1 month free trial', 100, 'new_customer', 'https://music.apple.com', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'NordVPN'), '72% off 2-year plan', 72, 'everyone', 'https://nordvpn.com/offer', '2026-03-01', '2026-06-01', 'manual'),
((SELECT id FROM known_services WHERE name = 'Surfshark'), '83% off + 3 months free', 83, 'new_customer', 'https://surfshark.com/deal', '2026-02-01', '2026-05-15', 'manual'),
((SELECT id FROM known_services WHERE name = 'Audible'), 'First 3 months $6.95/mo', 54, 'new_customer', 'https://audible.com/offer', '2026-03-01', '2026-06-30', 'manual'),
((SELECT id FROM known_services WHERE name = 'HelloFresh'), '16 free meals + free shipping', 60, 'new_customer', 'https://hellofresh.com/free', '2026-03-01', '2026-05-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Canva Pro'), '30-day free trial', 100, 'new_customer', 'https://canva.com/pro', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Disney+'), 'Bundle Disney+, Hulu, ESPN+ $14.99/mo', 40, 'everyone', 'https://disneyplus.com/bundle', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Strava Premium'), '60-day free trial', 100, 'new_customer', 'https://strava.com/subscribe', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Notion'), 'Free for students/educators', 100, 'new_customer', 'https://notion.so/education', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'GitHub Copilot'), 'Free for students', 100, 'new_customer', 'https://github.com/education', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'Adobe Creative Cloud'), '65% off for students', 65, 'new_customer', 'https://adobe.com/creativecloud/plans.html', '2026-01-01', '2026-12-31', 'manual'),
((SELECT id FROM known_services WHERE name = 'NYT Digital'), '$1/week for first year', 75, 'new_customer', 'https://nytimes.com/subscription', '2026-02-01', '2026-06-30', 'manual'),
((SELECT id FROM known_services WHERE name = 'Bitwarden Premium'), 'Free tier available forever', 100, 'everyone', 'https://bitwarden.com/pricing', '2026-01-01', '2027-01-01', 'manual'),
((SELECT id FROM known_services WHERE name = 'Xbox Game Pass'), 'First month $1', 93, 'new_customer', 'https://xbox.com/gamepass', '2026-03-01', '2026-06-30', 'manual'),
((SELECT id FROM known_services WHERE name = 'Kindle Unlimited'), '3 months for $0.99', 97, 'new_customer', 'https://amazon.com/kindleunlimited', '2026-03-15', '2026-05-15', 'manual');

-- ==================== SEED: SAMPLE PRICE CHANGES ====================

INSERT INTO public.price_changes (service_id, old_price, new_price, effective_date, announced_date, source_url) VALUES
((SELECT id FROM known_services WHERE name = 'Netflix'), 13.99, 15.49, '2026-01-15', '2025-11-20', 'https://netflix.com/pricing'),
((SELECT id FROM known_services WHERE name = 'Spotify'), 9.99, 10.99, '2026-06-01', '2026-03-20', 'https://spotify.com/premium'),
((SELECT id FROM known_services WHERE name = 'Apple TV+'), 6.99, 9.99, '2026-02-01', '2025-12-15', 'https://tv.apple.com');
