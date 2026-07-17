import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

function parseHash() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash;
}

function Router() {
  const [path, setPath] = useState(parseHash());
  const { session, loading } = useAuth();

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

  // Auth routes
  if (path === '/signin') {
    if (session) {
      window.location.hash = '/admin';
      return null;
    }
    return <SignIn />;
  }
  if (path === '/signup') {
    if (session) {
      window.location.hash = '/admin';
      return null;
    }
    return <SignUp />;
  }

  // Protected routes
  if (path === '/dashboard' || path.startsWith('/dashboard')) {
    return <Dashboard />;
  }
  
  // Güvenlik engeli kaldırılmış doğrudan admin yönlendirmesi
  if (path === '/admin' || path.startsWith('/admin')) {
    return <Admin />;
  }

  return <Landing />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
