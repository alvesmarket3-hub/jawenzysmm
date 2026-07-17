import { useEffect, useState } from 'react';
import {
  Rocket, LayoutDashboard, PlusCircle, ListOrdered, Wallet, LifeBuoy, Code2,
  LogOut, Menu, X, Search, ArrowRight, Clock, Check, Loader2, AlertCircle,
  Instagram, Youtube, Facebook, Twitter, Music2, Send, Globe, ShoppingCart,
  Plus, Trash2, MessageSquare, TrendingUp, User,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase, type Service, type Order, type Transaction, type Ticket, type TicketReply, type ApiKey } from '../lib/supabase';

const platformIcons: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="w-4 h-4" />,
  YouTube: <Youtube className="w-4 h-4" />,
  Facebook: <Facebook className="w-4 h-4" />,
  Twitter: <Twitter className="w-4 h-4" />,
  TikTok: <Music2 className="w-4 h-4" />,
  Telegram: <Send className="w-4 h-4" />,
  Spotify: <Music2 className="w-4 h-4" />,
  Website: <Globe className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  partial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
  refilled: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

type View = 'overview' | 'new-order' | 'orders' | 'services' | 'add-funds' | 'tickets' | 'api';

export default function Dashboard() {
  const { profile, signOut, refreshProfile } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
  if (!profile) {
    setLoading(false);
    return;
  }

  setLoading(true);

  try {
    // SERVICES
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('platform', { ascending: true });

      if (error) throw error;

      setServices((data as Service[]) ?? []);
    } catch (err) {
      console.error('services', err);
      setServices([]);
    }

    // ORDERS
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, service:services(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setOrders((data as Order[]) ?? []);
    } catch (err) {
      console.error('orders', err);
      setOrders([]);
    }

    // TRANSACTIONS
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setTransactions((data as Transaction[]) ?? []);
    } catch (err) {
      console.error('transactions', err);
      setTransactions([]);
    }

    // TICKETS
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTickets((data as Ticket[]) ?? []);
    } catch (err) {
      console.error('tickets', err);
      setTickets([]);
    }

    // API KEYS
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApiKeys((data as ApiKey[]) ?? []);
    } catch (err) {
      console.error('api_keys', err);
      setApiKeys([]);
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  if (!profile?.id) {
    setLoading(false);
    return;
  }

  loadData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [profile?.id]);

  const navItems: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'new-order', label: 'New Order', icon: PlusCircle },
    { id: 'orders', label: 'My Orders', icon: ListOrdered },
    { id: 'services', label: 'Services', icon: ShoppingCart },
    { id: 'add-funds', label: 'Add Funds', icon: Wallet },
    { id: 'tickets', label: 'Support', icon: LifeBuoy },
    { id: 'api', label: 'API Keys', icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-950 border-r border-white/5 z-40 flex flex-col transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-extrabold text-white">Boost<span className="gradient-text">X</span></span>
          </a>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                view === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
          {profile?.role === 'admin' && (
            <a href="#/admin" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-amber-500/10 transition-colors mt-4 border-t border-white/5 pt-4">
              <User className="w-4 h-4" /> Admin Panel
            </a>
          )}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className="px-3 py-3 rounded-lg bg-white/5 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Balance</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-extrabold text-white mt-1">${profile?.balance?.toFixed(2) || '0.00'}</div>
          </div>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">{navItems.find((n) => n.id === view)?.label}</span>
          <div className="text-sm font-bold text-emerald-400">${profile?.balance?.toFixed(2) || '0.00'}</div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <>
              {view === 'overview' && <Overview profile={profile} orders={orders} transactions={transactions} setView={setView} />}
              {view === 'new-order' && <NewOrder services={services} profile={profile} onOrdered={() => { loadData(); refreshProfile(); }} />}
              {view === 'orders' && <OrdersList orders={orders} />}
              {view === 'services' && <ServicesList services={services} setView={setView} />}
              {view === 'add-funds' && <AddFunds profile={profile} onAdded={() => { loadData(); refreshProfile(); }} />}
              {view === 'tickets' && <Tickets tickets={tickets} onChanged={loadData} />}
              {view === 'api' && <ApiKeys apiKeys={apiKeys} onChanged={loadData} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- Overview ---------- */
function Overview({ profile, orders, transactions, setView }: { profile: any; orders: Order[]; transactions: Transaction[]; setView: (v: View) => void }) {
  const completed = orders.filter((o) => o.status === 'completed').length;
  const active = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const totalSpent = orders.reduce((s, o) => s + Number(o.charge), 0);

  const cards = [
    { label: 'Account Balance', value: `$${profile?.balance?.toFixed(2) || '0.00'}`, icon: Wallet, color: 'emerald' },
    { label: 'Total Orders', value: orders.length, icon: ListOrdered, color: 'cyan' },
    { label: 'Completed', value: completed, icon: Check, color: 'emerald' },
    { label: 'Active', value: active, icon: TrendingUp, color: 'amber' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {profile?.username || 'User'}</h1>
      <p className="text-slate-400 text-sm mb-6">Here's your account overview</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c, i) => (
          <div key={i} className="glass rounded-2xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400">{c.label}</span>
              <c.icon className={`w-4 h-4 text-${c.color}-400`} />
            </div>
            <div className="text-2xl font-extrabold text-white">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Orders</h3>
            <button onClick={() => setView('orders')} className="text-xs text-emerald-400 font-semibold hover:text-emerald-300">View all</button>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No orders yet. Place your first order!</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{o.service?.name || 'Service'}</div>
                    <div className="text-xs text-slate-500">{o.quantity.toLocaleString()} pcs</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">${Number(o.charge).toFixed(2)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${statusColors[o.status] || statusColors.pending}`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setView('new-order')} className="w-full mt-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Order
          </button>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Recent Transactions</h3>
            <button onClick={() => setView('add-funds')} className="text-xs text-emerald-400 font-semibold hover:text-emerald-300">Add funds</button>
          </div>
          {transactions.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-sm text-white font-medium capitalize">{t.type}</div>
                    <div className="text-xs text-slate-500">{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-sm font-bold ${Number(t.amount) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {Number(t.amount) >= 0 ? '+' : ''}${Number(t.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-sm text-slate-400">Total spent on orders</span>
            <span className="text-lg font-bold text-white">${totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- New Order ---------- */
function NewOrder({ services, profile, onOrdered }: { services: Service[]; profile: any; onOrdered: () => void }) {
  const [selectedId, setSelectedId] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = services.filter((s) => {
    if (category !== 'All' && s.category !== category) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.platform.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selected = services.find((s) => s.id === selectedId);
  const charge = selected ? (Number(selected.price_per_1000) * quantity) / 1000 : 0;
  const balance = Number(profile?.balance || 0);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!selected) { setError('Please select a service.'); return; }
    if (!link) { setError('Please enter a link.'); return; }
    if (quantity < selected.min_order) { setError(`Minimum order is ${selected.min_order}.`); return; }
    if (quantity > selected.max_order) { setError(`Maximum order is ${selected.max_order}.`); return; }
    if (charge > balance) { setError('Insufficient balance. Please add funds.'); return; }

    setSubmitting(true);
    // Insert order
    const { data: orderData, error: orderErr } = await supabase.from('orders').insert({
      service_id: selected.id,
      link,
      quantity,
      charge: charge,
      status: 'pending',
    }).select().single();

    if (orderErr) {
      setError(orderErr.message);
      setSubmitting(false);
      return;
    }

    // Deduct balance
    const newBalance = balance - charge;
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);

    // Record transaction
    await supabase.from('transactions').insert({
      amount: -charge,
      type: 'order',
      description: `Order #${orderData.id.slice(0, 8)} — ${selected.name}`,
    });

    // Simulate processing: update status to processing
    setTimeout(async () => {
      await supabase.from('orders').update({ status: 'processing', start_count: Math.floor(Math.random() * 500) }).eq('id', orderData.id);
    }, 2000);

    setSuccess(`Order placed successfully! Order #${orderData.id.slice(0, 8)}`);
    setSelectedId('');
    setLink('');
    setQuantity(0);
    setSubmitting(false);
    onOrdered();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">New Order</h1>
      <p className="text-slate-400 text-sm mb-6">Select a service and place your order</p>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Service list */}
        <div className="lg:col-span-3 glass rounded-2xl p-5 border border-white/5">
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-emerald-500/50 focus:outline-none"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedId(s.id); setQuantity(s.min_order); }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  selectedId === s.id
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-emerald-400">{platformIcons[s.platform] || <Globe className="w-4 h-4" />}</span>
                    <span className="text-sm font-medium text-white truncate">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400 flex-shrink-0">${s.price_per_1000.toFixed(2)}/1k</span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-500">
                  <span>Min: {s.min_order.toLocaleString()}</span>
                  <span>Max: {s.max_order.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.average_time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order form */}
        <div className="lg:col-span-2">
          <form onSubmit={submit} className="glass rounded-2xl p-6 border border-white/5 sticky top-6">
            <h3 className="font-bold text-white mb-4">Order Details</h3>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
                <Check className="w-4 h-4 flex-shrink-0" /> {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Service</label>
                <div className="px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-sm text-white min-h-[42px]">
                  {selected ? selected.name : <span className="text-slate-500">Select a service...</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Link / Username</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Quantity {selected && <span className="text-slate-500">(Min: {selected.min_order}, Max: {selected.max_order})</span>}
                </label>
                <input
                  type="number"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  placeholder="1000"
                  className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-ink-800/50 border border-white/5 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Price per 1000</span>
                  <span className="text-white font-medium">${selected ? selected.price_per_1000.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-white font-medium">{quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                  <span className="text-slate-400">Total Charge</span>
                  <span className="text-emerald-400 font-bold text-lg">${charge.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Balance after</span>
                  <span className={`font-medium ${(balance - charge) < 0 ? 'text-red-400' : 'text-white'}`}>${(balance - charge).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !selected}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing order...</> : <>Place Order <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Orders List ---------- */
function OrdersList({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">My Orders</h1>
      <p className="text-slate-400 text-sm mb-6">Track and manage all your orders</p>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['all', 'pending', 'processing', 'completed', 'partial', 'canceled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === f ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {f} {f !== 'all' && `(${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500 py-16 text-center">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                  <th className="text-left p-4 font-medium">Order</th>
                  <th className="text-left p-4 font-medium">Service</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Link</th>
                  <th className="text-right p-4 font-medium">Qty</th>
                  <th className="text-right p-4 font-medium">Charge</th>
                  <th className="text-right p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="text-xs text-slate-500">#{o.id.slice(0, 8)}</div>
                      <div className="text-xs text-slate-400">{new Date(o.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-white font-medium truncate max-w-[200px]">{o.service?.name || 'Service'}</div>
                      <div className="text-xs text-slate-500">{o.service?.platform}</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <a href={o.link} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate max-w-[150px] block text-xs">{o.link}</a>
                    </td>
                    <td className="p-4 text-right text-white">{o.quantity.toLocaleString()}</td>
                    <td className="p-4 text-right text-white font-semibold">${Number(o.charge).toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <span className={`text-xs px-2 py-1 rounded-md border ${statusColors[o.status] || statusColors.pending}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Services List ---------- */
function ServicesList({ services, setView }: { services: Service[]; setView: (v: View) => void }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];
  const filtered = services.filter((s) => {
    if (category !== 'All' && s.category !== category) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.platform.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Services</h1>
      <p className="text-slate-400 text-sm mb-6">Browse our full catalog of {services.length} services</p>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-emerald-500/50 focus:outline-none"
        >
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                <th className="text-left p-4 font-medium">ID</th>
                <th className="text-left p-4 font-medium">Service</th>
                <th className="text-left p-4 font-medium">Platform</th>
                <th className="text-right p-4 font-medium">Price /1k</th>
                <th className="text-right p-4 font-medium hidden sm:table-cell">Min</th>
                <th className="text-right p-4 font-medium hidden sm:table-cell">Max</th>
                <th className="text-right p-4 font-medium">Speed</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4 text-xs text-slate-500">#{s.id.slice(0, 6)}</td>
                  <td className="p-4">
                    <div className="text-white font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[250px]">{s.description}</div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="text-emerald-400">{platformIcons[s.platform] || <Globe className="w-4 h-4" />}</span>
                      {s.platform}
                    </span>
                  </td>
                  <td className="p-4 text-right text-emerald-400 font-bold">${s.price_per_1000.toFixed(2)}</td>
                  <td className="p-4 text-right text-slate-400 hidden sm:table-cell">{s.min_order.toLocaleString()}</td>
                  <td className="p-4 text-right text-slate-400 hidden sm:table-cell">{s.max_order.toLocaleString()}</td>
                  <td className="p-4 text-right text-slate-400 text-xs">{s.average_time}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setView('new-order')} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
                      Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---------- Add Funds ---------- */
function AddFunds({ profile, onAdded }: { profile: any; onAdded: () => void }) {
  const [amount, setAmount] = useState(10);
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const presets = [5, 10, 25, 50, 100, 500];
  const methods = [
    { id: 'card', label: 'Credit Card', desc: 'Visa, Mastercard, Amex' },
    { id: 'paypal', label: 'PayPal', desc: 'Instant transfer' },
    { id: 'crypto', label: 'Cryptocurrency', desc: 'BTC, ETH, USDT' },
    { id: 'payoneer', label: 'Payoneer', desc: 'Wire transfer' },
  ];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    // Simulate payment
    await new Promise((r) => setTimeout(r, 1500));

    const newBalance = Number(profile.balance) + amount;
    await supabase.from('profiles').update({ balance: newBalance }).eq('id', profile.id);
    await supabase.from('transactions').insert({
      amount,
      type: 'deposit',
      description: `Deposit via ${methods.find((m) => m.id === method)?.label}`,
    });

    setSuccess(`$${amount.toFixed(2)} added to your balance!`);
    setLoading(false);
    onAdded();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Add Funds</h1>
      <p className="text-slate-400 text-sm mb-6">Top up your account balance to place orders</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={submit} className="glass rounded-2xl p-6 border border-white/5">
          {success && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
              <Check className="w-4 h-4" /> {success}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-3">Select Amount</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`py-2.5 rounded-lg text-sm font-bold transition-colors ${
                    amount === p ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full pl-7 pr-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-300 mb-3">Payment Method</label>
            <div className="space-y-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
                    method === m.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{m.label}</div>
                    <div className="text-xs text-slate-500">{m.desc}</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${method === m.id ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || amount < 1}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-ink-950 font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <>Add ${amount.toFixed(2)} <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-white mb-4">Balance Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 rounded-xl bg-ink-800/50">
              <span className="text-sm text-slate-400">Current Balance</span>
              <span className="text-2xl font-extrabold text-white">${Number(profile?.balance || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <span className="text-sm text-slate-400">After Deposit</span>
              <span className="text-2xl font-extrabold text-emerald-400">${(Number(profile?.balance || 0) + amount).toFixed(2)}</span>
            </div>
            <div className="text-xs text-slate-500 p-4 rounded-xl bg-ink-800/30">
              <p className="font-medium text-slate-400 mb-2">Pro tip:</p>
              Deposit $50 or more to get a 5% bonus. Deposit $500+ for 10% bonus on top.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tickets ---------- */
function Tickets({ tickets, onChanged }: { tickets: Ticket[]; onChanged: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase.from('tickets').insert({
      subject, priority,
    }).select().single();
    if (data) {
      await supabase.from('ticket_replies').insert({
        ticket_id: data.id, message, is_staff: false,
      });
    }
    setSubject(''); setPriority('medium'); setMessage(''); setShowForm(false); setLoading(false);
    onChanged();
  };

  const openTicket = async (t: Ticket) => {
    setActiveTicket(t);
    const { data } = await supabase.from('ticket_replies').select('*').eq('ticket_id', t.id).order('created_at', { ascending: true });
    setReplies((data as TicketReply[]) || []);
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText) return;
    await supabase.from('ticket_replies').insert({
      ticket_id: activeTicket.id, message: replyText, is_staff: false,
    });
    setReplyText('');
    openTicket(activeTicket);
  };

  if (activeTicket) {
    return (
      <div>
        <button onClick={() => setActiveTicket(null)} className="text-sm text-emerald-400 font-semibold mb-4 flex items-center gap-1">
          ← Back to tickets
        </button>
        <div className="glass rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-5 border-b border-white/5">
            <h2 className="font-bold text-white">{activeTicket.subject}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-0.5 rounded-md border ${statusColors[activeTicket.status] || statusColors.pending}`}>{activeTicket.status}</span>
              <span className="text-xs text-slate-500">Priority: {activeTicket.priority}</span>
            </div>
          </div>
          <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
            {replies.map((r) => (
              <div key={r.id} className={`flex ${r.is_staff ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-3.5 rounded-2xl ${r.is_staff ? 'bg-ink-800 text-slate-200' : 'bg-emerald-500/10 text-white'}`}>
                  <p className="text-sm">{r.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{new Date(r.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendReply} className="p-5 border-t border-white/5 flex gap-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
            />
            <button type="submit" className="px-5 py-2.5 rounded-lg bg-emerald-500 text-ink-950 font-bold text-sm hover:bg-emerald-400 transition-colors">
              Send
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Support Tickets</h1>
          <p className="text-slate-400 text-sm">Get help from our support team</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold text-sm hover:bg-emerald-500/20 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {showForm && (
        <form onSubmit={createTicket} className="glass rounded-2xl p-6 border border-white/5 mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full px-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-emerald-500/50 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide details about your issue..."
              className="w-full px-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none resize-none"
            />
          </div>
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-emerald-500 text-ink-950 font-bold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Ticket'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {tickets.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-white/5 text-center">
            <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No tickets yet. Create one to get started.</p>
          </div>
        ) : (
          tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => openTicket(t)}
              className="w-full text-left glass rounded-xl p-4 border border-white/5 hover:border-emerald-500/20 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-white">{t.subject}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(t.created_at).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 capitalize">{t.priority}</span>
                <span className={`text-xs px-2 py-1 rounded-md border ${statusColors[t.status] || statusColors.pending}`}>{t.status}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------- API Keys ---------- */
function ApiKeys({ apiKeys, onChanged }: { apiKeys: ApiKey[]; onChanged: () => void }) {
  const [label, setLabel] = useState('');
  const [creating, setCreating] = useState(false);
  const [copied, setCopied] = useState('');

  const generateKey = () => 'bx_' + Array.from({ length: 32 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    await supabase.from('api_keys').insert({ key_value: generateKey(), label: label || 'Default' });
    setLabel('');
    setCreating(false);
    onChanged();
  };

  const deleteKey = async (id: string) => {
    await supabase.from('api_keys').delete().eq('id', id);
    onChanged();
  };

  const copy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">API Keys</h1>
      <p className="text-slate-400 text-sm mb-6">Manage your API keys for programmatic access</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-white mb-4">Your API Keys</h3>
          {apiKeys.length === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">No API keys yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-3.5 rounded-xl bg-ink-800 border border-white/5">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white">{k.label}</div>
                    <div className="text-xs text-slate-500 font-mono truncate">{k.key_value.slice(0, 12)}...{k.key_value.slice(-6)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => copy(k.key_value)} className="px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-medium hover:bg-white/10 transition-colors">
                      {copied === k.key_value ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={() => deleteKey(k.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={createKey} className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-white mb-4">Create New Key</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Production API"
                className="w-full px-4 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
            <button type="submit" disabled={creating} className="w-full py-2.5 rounded-lg bg-emerald-500 text-ink-950 font-bold text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Generate Key
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <h4 className="text-sm font-semibold text-white mb-2">API Endpoint</h4>
            <code className="block text-xs text-slate-400 font-mono p-3 rounded-lg bg-ink-800 break-all">
              POST {import.meta.env.VITE_SUPABASE_URL}/functions/v1/smm-api
            </code>
          </div>
        </form>
      </div>
    </div>
  );
}
