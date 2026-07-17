import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { supabaseConfigured } from './lib/supabase';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { Rocket, AlertTriangle } from 'lucide-react';

function parseHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash;
}

function MissingConfig() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-6">
          <Rocket className="w-8 h-8 text-ink-950" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-white mb-3">
          Boost<span className="gradient-text">X</span>
        </h1>
        <div className="glass rounded-2xl p-6 border border-amber-500/20 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-amber-400">Supabase credentials missing</span>
          </div>
          <p className="text-slate-400 text-sm text-left leading-relaxed">
            The environment variables are not configured in your Vercel deployment.
            Add the following variables in your Vercel project settings under
            <strong className="text-white"> Settings → Environment Variables</strong>:
          </p>
          <div className="mt-4 p-4 rounded-xl bg-ink-800 text-left font-mono text-xs space-y-2">
            <div><span className="text-emerald-400">VITE_SUPABASE_URL</span> <span className="text-slate-500">= your supabase project URL</span></div>
            <div><span className="text-emerald-400">VITE_SUPABASE_ANON_KEY</span> <span className="text-slate-500">= your anon/public key</span></div>
          </div>
          <p className="text-slate-500 text-xs mt-4">
            After adding them, trigger a new deployment (redeploy) from the Vercel dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const [path, setPath] = useState(parseHash());
  const { session, profile, loading } = useAuth();

  useEffect(() => {
    const onHash = () => setPath(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (path === '/signin') {
    if (session) {
      window.location.hash = profile?.role === 'admin' ? '/admin' : '/dashboard';
      return null;
    }
    return <SignIn />;
  }
  if (path === '/signup') {
    if (session) {
      window.location.hash = '/dashboard';
      return null;
    }
    return <SignUp />;
  }
  if (path === '/dashboard' || path.startsWith('/dashboard')) {
    if (!session) {
      window.location.hash = '/signin';
      return null;
    }
    return <Dashboard />;
  }
  if (path === '/admin' || path.startsWith('/admin')) {
    if (!session || profile?.role !== 'admin') {
      window.location.hash = '/dashboard';
      return null;
    }
    return <Admin />;
  }

  return <Landing />;
}

export default function App() {
  if (!supabaseConfigured) {
    return <MissingConfig />;
  }

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
