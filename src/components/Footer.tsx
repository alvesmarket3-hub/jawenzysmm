import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-950 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-extrabold text-white">Boost<span className="gradient-text">X</span></span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The world's leading wholesale SMM panel. Instant delivery, unbeatable prices, 24/7 support.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-emerald-400 transition-colors">Services</a></li>
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              <li><a href="#api" className="hover:text-emerald-400 transition-colors">API Docs</a></li>
              <li><a href="#/signup" className="hover:text-emerald-400 transition-colors">Sign Up</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              <li><a href="#/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</a></li>
              <li><a href="#/signin" className="hover:text-emerald-400 transition-colors">Sign In</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#/dashboard/tickets" className="hover:text-emerald-400 transition-colors">Tickets</a></li>
              <li><a href="mailto:support@boostx.io" className="hover:text-emerald-400 transition-colors">support@boostx.io</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">© 2026 BoostX. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
