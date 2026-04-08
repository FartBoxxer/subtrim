// Shared constants extracted from App.jsx for reuse

export const CATS = {
  streaming:{l:"Streaming",c:"#e74c3c",e:"🎬"},music:{l:"Music",c:"#a855f7",e:"🎵"},
  gaming:{l:"Gaming",c:"#2ecc71",e:"🎮"},productivity:{l:"Productivity",c:"#3498db",e:"💼"},
  fitness:{l:"Fitness",c:"#e67e22",e:"💪"},news:{l:"News",c:"#1abc9c",e:"📰"},
  creative:{l:"Creative",c:"#f39c12",e:"🎨"},security:{l:"Security",c:"#607d8b",e:"🔒"},
  food:{l:"Food",c:"#e91e63",e:"🍕"},ai_tools:{l:"AI Tools",c:"#00bcd4",e:"🤖"},
  lifestyle:{l:"Lifestyle",c:"#ec4899",e:"✨"},
};

export const LABELS=[
  {k:"promo",l:"Promo",c:"#e74c3c"},{k:"student",l:"Student",c:"#3498db"},
  {k:"family",l:"Family",c:"#9b59b6"},{k:"annual",l:"Annual Deal",c:"#f39c12"},
  {k:"grandfathered",l:"Grandfathered",c:"#2ecc71"},{k:"bundled",l:"Bundled",c:"#e67e22"},
];

export const AUTO_PROMOS=[
  {svc:"Hulu",cat:"streaming",disc:50,desc:"First 3 months at $3.99/mo for new & returning subscribers",type:"new_customer",until:"2026-06-30",url:"https://www.hulu.com/welcome"},
  {svc:"Paramount+",cat:"streaming",disc:50,desc:"Annual plan 50% off — $29.99/yr (Essential)",type:"everyone",until:"2026-05-15",url:"https://www.paramountplus.com"},
  {svc:"YouTube Premium",cat:"streaming",disc:30,desc:"3-month free trial for new subscribers",type:"new_customer",until:"2026-12-31",url:"https://www.youtube.com/premium"},
  {svc:"NordVPN",cat:"security",disc:72,desc:"2-year plan — $3.09/mo + 3 months free",type:"everyone",until:"2026-07-01",url:"https://nordvpn.com/offer"},
  {svc:"Spotify",cat:"music",disc:100,desc:"3 months free Premium for new users",type:"new_customer",until:"2026-09-30",url:"https://www.spotify.com/premium"},
  {svc:"Apple Music",cat:"music",disc:100,desc:"1 month free trial for new subscribers",type:"new_customer",until:"2026-12-31",url:"https://www.apple.com/apple-music"},
  {svc:"Disney+",cat:"streaming",disc:33,desc:"Bundle with Hulu (No Ads) — save $10/mo vs separate",type:"everyone",until:"2026-12-31",url:"https://www.disneyplus.com"},
  {svc:"Adobe Creative Cloud",cat:"creative",disc:40,desc:"Students & teachers — All Apps at $19.99/mo",type:"new_customer",until:"2026-08-31",url:"https://www.adobe.com/creativecloud/plans.html"},
  {svc:"1Password",cat:"security",disc:25,desc:"Annual plan — save 25% vs monthly billing",type:"everyone",until:"2026-12-31",url:"https://1password.com"},
  {svc:"Xbox Game Pass",cat:"gaming",disc:50,desc:"First month of Ultimate for $7.99",type:"new_customer",until:"2026-06-30",url:"https://www.xbox.com/en-US/xbox-game-pass"},
  {svc:"Dropbox",cat:"productivity",disc:20,desc:"Plus annual plan — $9.99/mo billed yearly",type:"everyone",until:"2026-12-31",url:"https://www.dropbox.com/plans"},
  {svc:"Peacock",cat:"streaming",disc:50,desc:"Premium annual plan — $29.99/yr (save 50%)",type:"everyone",until:"2026-05-31",url:"https://www.peacocktv.com"},
];

export const TH={
  dark:{bg:"#0d0d0d",sb:"#0a0a0a",sf:"#141414",el:"#1f1f1f",bd:"#1a1a1a",bd2:"#222",bd3:"#333",tx:"#fff",tx2:"#ccc",mt:"#666",mt2:"#999",mt3:"#888",dm:"#444",dm2:"#555",acc:"#00d48a",acc2:"#00b8d4",abg:"#0d0d0dee"},
  light:{bg:"#f5f5f7",sb:"#fff",sf:"#fff",el:"#ebebeb",bd:"#e0e0e0",bd2:"#d0d0d0",bd3:"#bbb",tx:"#111",tx2:"#444",mt:"#888",mt2:"#666",mt3:"#777",dm:"#aaa",dm2:"#999",acc:"#00b377",acc2:"#0097a7",abg:"#f5f5f7ee"}
};

export const CURRENCIES=[
  {code:"USD",sym:"$",loc:"en-US"},{code:"EUR",sym:"€",loc:"de-DE"},
  {code:"GBP",sym:"£",loc:"en-GB"},{code:"CAD",sym:"CA$",loc:"en-CA"},
  {code:"AUD",sym:"A$",loc:"en-AU"},{code:"JPY",sym:"¥",loc:"ja-JP"},
  {code:"BRL",sym:"R$",loc:"pt-BR"},{code:"MXN",sym:"MX$",loc:"es-MX"},
  {code:"INR",sym:"₹",loc:"en-IN"},{code:"KRW",sym:"₩",loc:"ko-KR"}
];

// Button base style
export const B={border:"none",borderRadius:10,padding:"10px 18px",cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.15s",fontFamily:"inherit"};

export const SB_W=260;

// Days until a date (positive = future, negative = past)
export const dU=d=>d?Math.ceil((new Date(d)-new Date())/864e5):999;

// Months since a date (min 1)
export const mS=d=>{if(!d)return 1;const n=new Date(),t=new Date(d);if(isNaN(t))return 1;return Math.max(1,(n.getFullYear()-t.getFullYear())*12+n.getMonth()-t.getMonth())};

// Currency formatter (cached)
const _fmtCache={};
export const mkFmt=c=>{if(!_fmtCache[c]){const ci=CURRENCIES.find(x=>x.code===c)||CURRENCIES[0];_fmtCache[c]=new Intl.NumberFormat(ci.loc,{style:'currency',currency:ci.code,minimumFractionDigits:ci.code==='JPY'||ci.code==='KRW'?0:2,maximumFractionDigits:ci.code==='JPY'||ci.code==='KRW'?0:2})}return _fmtCache[c]};

// Generate random avatar palettes
export function genPalettes(){return Array.from({length:10},(_,i)=>{const h1=Math.floor(Math.random()*360),h2=(h1+40+Math.floor(Math.random()*120))%360,s1=60+Math.floor(Math.random()*30),s2=60+Math.floor(Math.random()*30),l1=42+Math.floor(Math.random()*18),l2=42+Math.floor(Math.random()*18),a=Math.floor(Math.random()*360);const tp=i%3;return{id:`g${i}`,bg:tp===0?`hsl(${h1},${s1}%,${l1}%)`:tp===1?`linear-gradient(${a}deg,hsl(${h1},${s1}%,${l1}%),hsl(${h2},${s2}%,${l2}%))`:`radial-gradient(circle at ${30+Math.floor(Math.random()*40)}% ${30+Math.floor(Math.random()*40)}%,hsl(${h1},${s1}%,${l1}%),hsl(${h2},${s2}%,${l2}%))`}})}
