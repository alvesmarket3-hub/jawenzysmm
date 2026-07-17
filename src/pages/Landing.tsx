import { useEffect, useState } from 'react';
import {
  Zap, ShieldCheck, Headphones, Clock, ArrowRight, Check, ChevronDown,
  Instagram, Youtube, Facebook, Twitter, Music2, Send, Globe, Star,
  TrendingUp, Users, DollarSign, Activity, Code2,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase, type Service } from '../lib/supabase';

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-5 h-5" />,
  YouTube: <Youtube className="w-5 h-5" />,
  Facebook: <Facebook className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  TikTok: <Music2 className="w-5 h-5" />,
  Telegram: <Send className="w-5 h-5" />,
  Spotify: <Music2 className="w-5 h-5" />,
  Website: <Globe className="w-5 h-5" />,
};

export default function Landing() {
  const [services, setServices] = useState<Service[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('price_per_1000', { ascending: true })
      .limit(8)
      .then(({ data }) => {
        if (data) setServices(data as Service[]);
      });
  }, []);

  const stats = [
    { icon: Users, label: 'Active Users', value: '125K+' },
    { icon: TrendingUp, label: 'Orders Completed', value: '18M+' },
    { icon: DollarSign, label: 'Payment Volume', value: '$4.2M+' },
    { icon: Activity, label: 'Avg. Start Time', value: '< 2 min' },
  ];

  const features = [
    { icon: Zap, title: 'Instant Delivery', desc: 'Orders start within seconds. Our automated system runs 24/7 to deliver your services instantly.' },
    { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Bank-grade encryption protects your data. Drip-feed and refill guarantees on every service.' },
    { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated support team is available around the clock via tickets and live chat.' },
    { icon: DollarSign, title: 'Wholesale Prices', desc: 'Get the lowest prices in the industry. Resell our services and keep the profit margin.' },
    { icon: Code2, title: 'Developer API', desc: 'Full REST API access to integrate our panel into your own platform or reseller business.' },
    { icon: Clock, title: 'Auto Refill', desc: 'Automatic refills on drop-offs. 30-day to lifetime guarantees on selected services.' },
  ];

  const faqs = [
    { q: 'What is an SMM panel?', a: 'An SMM panel is a web-based platform that sells social media marketing services like followers, likes, views, and comments for platforms such as Instagram, YouTube, TikTok, Facebook, and more — at wholesale prices with automated delivery.' },
    { q: 'How fast are orders processed?', a: 'Most orders start within 0-60 seconds and complete based on the service speed listed. Some services deliver instantly, while larger orders may take hours. Each service shows its estimated average time.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, PayPal, cryptocurrency (BTC, ETH, USDT), and Payoneer. Add funds to your balance and use them to place orders anytime.' },
    { q: 'Do you offer refills and guarantees?', a: 'Yes. Many services include free auto-refill guarantees ranging from 30 days to lifetime. Check the service description for the specific guarantee before ordering.' },
    { q: 'Can I resell your services?', a: 'Absolutely. We offer the lowest wholesale prices and a full API so you can build your own reseller panel. Many of our clients run successful SMM businesses on top of our infrastructure.' },
    { q: 'How do I get started?', a: 'Create a free account, add funds using your preferred payment method, browse our service catalog, and place your first order. It takes less than 2 minutes to get going.' },
  ];

  return (
    <div className="min-h-screen bg-ink-900 text-slate-200">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-grid opacity-40" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            #1 SMM Panel with Instant Delivery
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] animate-fade-in-up">
            Grow Your Social Presence
            <br />
            <span className="gradient-text">at Lightning Speed</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            The world's most trusted SMM panel. Real followers, likes, views, and engagement
            for Instagram, YouTube, TikTok and 20+ platforms — at unbeatable wholesale prices.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <a href="#/signup" className="group px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 font-bold text-base hover:shadow-2xl hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
              Start Growing Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#services" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 transition-all">
              View Services
            </a>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-6 border border-white/5 hover:border-emerald-500/30 transition-colors">
                <s.icon className="w-6 h-6 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs md:text-sm text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORMS */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm text-slate-500 uppercase tracking-wider mb-8 font-semibold">Trusted across 20+ platforms</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {['Instagram', 'YouTube', 'TikTok', 'Facebook', 'Twitter', 'Telegram', 'Spotify', 'Website'].map((p) => (
              <div key={p} className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-default">
                {platformIcons[p]}
                <span className="font-semibold text-lg">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Popular Services</h2>
            <p className="mt-4 text-slate-400 text-lg">Real, high-quality services at the best prices in the market</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.length === 0
              ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-44 rounded-2xl shimmer" />)
              : services.map((s) => (
                  <div key={s.id} className="group glass rounded-2xl p-5 border border-white/5 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400">
                        {platformIcons[s.platform] || <Globe className="w-5 h-5" />}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-medium">{s.platform}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2 min-h-[2.5rem]">{s.name}</h3>
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        <span className="text-2xl font-extrabold gradient-text">${s.price_per_1000.toFixed(2)}</span>
                        <span className="text-xs text-slate-500 ml-1">/1k</span>
                      </div>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {s.average_time}
                      </span>
                    </div>
                  </div>
                ))}
          </div>

          <div className="text-center mt-10">
            <a href="#/signup" className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:gap-3 transition-all">
              View all 20+ services <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Why Choose BoostX?</h2>
            <p className="mt-4 text-slate-400 text-lg">Everything you need to dominate social media growth</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group glass rounded-2xl p-7 border border-white/5 hover:border-emerald-500/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-slate-400 text-lg">No hidden fees. No subscriptions. Pay only for what you use.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '5', desc: 'Perfect for trying out our services', features: ['$5 minimum deposit', 'Access to all services', 'Standard delivery speed', 'Email support', 'API access'], cta: 'Start Free', highlight: false },
              { name: 'Pro', price: '50', desc: 'Best for resellers and agencies', features: ['$50 deposit + 5% bonus', 'Priority delivery queue', 'All platforms unlocked', '24/7 priority support', 'Full API + Webhooks', 'Reseller dashboard'], cta: 'Get Pro', highlight: true },
              { name: 'Enterprise', price: '500', desc: 'For high-volume operations', features: ['$500 deposit + 10% bonus', 'VIP delivery speeds', 'Dedicated account manager', 'Custom pricing tiers', 'White-label API', 'SLA guarantees'], cta: 'Contact Sales', highlight: false },
            ].map((p) => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-8 border transition-all ${
                  p.highlight
                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/40 glow-emerald scale-105'
                    : 'glass border-white/5 hover:border-white/10'
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{p.desc}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">${p.price}</span>
                  <span className="text-slate-400 mb-1 text-sm">min. deposit</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="#/signup"
                  className={`block text-center mt-8 py-3 rounded-xl font-bold transition-all ${
                    p.highlight
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 hover:shadow-lg hover:shadow-emerald-500/30'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {p.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API SECTION */}
      <section id="api" className="py-24 bg-ink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <Code2 className="w-4 h-4" /> Developer API
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Build your own panel with our powerful API
            </h2>
            <p className="mt-5 text-slate-400 text-lg leading-relaxed">
              Full REST API access with every account. Place orders, check status, manage services,
              and build your own reseller business on top of our infrastructure.
            </p>
            <ul className="mt-6 space-y-3">
              {['Simple key-based authentication', 'Place orders programmatically', 'Real-time order status tracking', 'Service catalog endpoint', 'Webhook callbacks on completion'].map((f) => (
                <li key={f} className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400" /> {f}
                </li>
              ))}
            </ul>
            <a href="#/signup" className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
              Get API Access <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/5 overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-slate-500 ml-2">POST /api/v2/orders</span>
            </div>
            <pre className="text-xs sm:text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`curl -X POST https://api.boostx.io/v2/orders \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service_id": 1,
    "link": "https://instagram.com/p/abc123",
    "quantity": 1000
  }'

// Response
{
  "order_id": "ord_8f3a9c2e",
  "status": "pending",
  "charge": 0.85,
  "start_count": 0,
  "currency": "USD"
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Loved by 125,000+ users</h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-slate-400 text-sm">4.9/5 from 8,200+ reviews</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'Influencer', text: 'I have been using BoostX for 8 months. My Instagram grew from 2K to 90K followers. The delivery is instant and the quality is unmatched.' },
              { name: 'Marcus T.', role: 'Agency Owner', text: 'We resell BoostX services to our clients through the API. The margins are incredible and the support team always has our back.' },
              { name: 'Lina P.', role: 'Musician', text: 'Got 50K Spotify plays in 24 hours. My tracks started charting and I got into editorial playlists. BoostX changed my career.' },
            ].map((t, i) => (
              <div key={i} className="glass rounded-2xl p-7 border border-white/5">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-ink-950 font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-ink-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-white">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-400 flex-shrink-0 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5 text-slate-400 leading-relaxed text-sm">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent border border-emerald-500/20 p-12 text-center overflow-hidden">
            <div className="absolute inset-0 hero-grid opacity-20" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">Ready to grow your social presence?</h2>
              <p className="mt-4 text-slate-300 text-lg">Join 125,000+ creators, agencies, and resellers using BoostX every day.</p>
              <a href="#/signup" className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 font-bold text-base hover:shadow-2xl hover:shadow-emerald-500/30 transition-all">
                Create Free Account <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
