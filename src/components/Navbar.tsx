import { useEffect, useState } from 'react';
import { Rocket, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, profile, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = (e: React.MouseEvent, hash: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (hash.startsWith('/')) {
      window.location.hash = hash;
    } else {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <a href="#/" onClick={(e) => nav(e, '/')} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Rocket className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Boost<span className="gradient-text">X</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" onClick={(e) => nav(e, 'services')} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Services</a>
          <a href="#pricing" onClick={(e) => nav(e, 'pricing')} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Pricing</a>
          <a href="#features" onClick={(e) => nav(e, 'features')} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">Features</a>
          <a href="#api" onClick={(e) => nav(e, 'api')} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">API</a>
          <a href="#faq" onClick={(e) => nav(e, 'faq')} className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              <a href="#/dashboard" onClick={(e) => nav(e, '/dashboard')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold text-white transition-colors">
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </a>
              {profile?.role === 'admin' && (
                <a href="#/admin" onClick={(e) => nav(e, '/admin')} className="px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-colors">
                  Admin
                </a>
              )}
              <button onClick={signOut} className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors" title="Sign out">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <a href="#/signin" onClick={(e) => nav(e, '/signin')} className="px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </a>
              <a href="#/signup" onClick={(e) => nav(e, '/signup')} className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 text-sm font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                Get Started
              </a>
            </>
          )}
        </div>

        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 mt-3 py-4 px-4 space-y-3">
          <a href="#services" onClick={(e) => nav(e, 'services')} className="block text-slate-300 font-medium py-2">Services</a>
          <a href="#pricing" onClick={(e) => nav(e, 'pricing')} className="block text-slate-300 font-medium py-2">Pricing</a>
          <a href="#features" onClick={(e) => nav(e, 'features')} className="block text-slate-300 font-medium py-2">Features</a>
          <a href="#api" onClick={(e) => nav(e, 'api')} className="block text-slate-300 font-medium py-2">API</a>
          <a href="#faq" onClick={(e) => nav(e, 'faq')} className="block text-slate-300 font-medium py-2">FAQ</a>
          {session ? (
            <>
              <a href="#/dashboard" onClick={(e) => nav(e, '/dashboard')} className="block py-2 text-emerald-400 font-semibold">Dashboard</a>
              <button onClick={signOut} className="block py-2 text-slate-400">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <a href="#/signin" onClick={(e) => nav(e, '/signin')} className="flex-1 text-center py-2.5 rounded-lg bg-white/5 text-white font-semibold">Sign In</a>
              <a href="#/signup" onClick={(e) => nav(e, '/signup')} className="flex-1 text-center py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 font-bold">Get Started</a>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
