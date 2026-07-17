import { useEffect, useState } from 'react';
import {
  Rocket, LayoutDashboard, Package, ListOrdered, Users, LogOut, Menu, X,
  Plus, Trash2, Edit3, Loader2, DollarSign, Activity, ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { supabase, type Service, type Order, type Profile } from '../lib/supabase';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  processing: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  partial: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  canceled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

type View = 'overview' | 'services' | 'orders' | 'users';

export default function Admin() {
  const { signOut } = useAuth();
  const [view, setView] = useState<View>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [svc, ord, usr] = await Promise.all([
      supabase.from('services').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*, service:services(*), profile:profiles!orders_user_id_fkey(username, email)').order('created_at', { ascending: false }).limit(100),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    setServices((svc.data as Service[]) || []);
    setOrders((ord.data as Order[]) || []);
    setUsers((usr.data as Profile[]) || []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const navItems: { id: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'services', label: 'Services', icon: Package },
    { id: 'orders', label: 'Orders', icon: ListOrdered },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-ink-900 flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-950 border-r border-white/5 z-40 flex flex-col transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">Boost<span className="text-amber-400">X</span></div>
              <div className="text-xs text-amber-400 font-medium">Admin Panel</div>
            </div>
          </div>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                view === item.id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
          <a href="#/dashboard" className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors mt-4 border-t border-white/5 pt-4">
            <LayoutDashboard className="w-4 h-4" /> User Dashboard
          </a>
        </nav>

        <div className="p-3 border-t border-white/5">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 glass border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-white">{navItems.find((n) => n.id === view)?.label}</span>
          <div className="w-6" />
        </header>

        <main className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            </div>
          ) : (
            <>
              {view === 'overview' && <AdminOverview services={services} orders={orders} users={users} />}
              {view === 'services' && <AdminServices services={services} onChanged={loadData} />}
              {view === 'orders' && <AdminOrders orders={orders} onChanged={loadData} />}
              {view === 'users' && <AdminUsers users={users} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------- Admin Overview ---------- */
function AdminOverview({ services, orders, users }: { services: Service[]; orders: Order[]; users: Profile[] }) {
  const revenue = orders.filter((o) => o.status !== 'canceled').reduce((s, o) => s + Number(o.charge), 0);
  const pending = orders.filter((o) => o.status === 'pending').length;

  const cards = [
    { label: 'Total Revenue', value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: 'emerald' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'cyan' },
    { label: 'Pending Orders', value: pending, icon: Activity, color: 'amber' },
    { label: 'Active Users', value: users.length, icon: Users, color: 'blue' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Admin Overview</h1>
      <p className="text-slate-400 text-sm mb-6">Platform-wide statistics and management</p>

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
          <h3 className="font-bold text-white mb-4">Recent Orders</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {orders.slice(0, 10).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="min-w-0">
                  <div className="text-sm text-white font-medium truncate">{o.service?.name || 'Service'}</div>
                  <div className="text-xs text-slate-500">{(o as any).profile?.username || 'Unknown'} · {o.quantity.toLocaleString()} pcs</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-white">${Number(o.charge).toFixed(2)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${statusColors[o.status] || statusColors.pending}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 border border-white/5">
          <h3 className="font-bold text-white mb-4">Service Stats</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {services.map((s) => {
              const svcOrders = orders.filter((o) => o.service_id === s.id);
              const svcRevenue = svcOrders.reduce((sum, o) => sum + Number(o.charge), 0);
              return (
                <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{s.name}</div>
                    <div className="text-xs text-slate-500">{svcOrders.length} orders</div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">${svcRevenue.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Admin Services ---------- */
function AdminServices({ services, onChanged }: { services: Service[]; onChanged: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: '', category: 'Followers', platform: 'Instagram', price_per_1000: '', min_order: '10', max_order: '100000', average_time: '0-1 hours', description: '' });

  const startEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name, category: s.category, platform: s.platform,
      price_per_1000: String(s.price_per_1000), min_order: String(s.min_order),
      max_order: String(s.max_order), average_time: s.average_time, description: s.description,
    });
    setShowForm(true);
  };

  const startCreate = () => {
    setEditing(null);
    setForm({ name: '', category: 'Followers', platform: 'Instagram', price_per_1000: '', min_order: '10', max_order: '100000', average_time: '0-1 hours', description: '' });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      platform: form.platform,
      price_per_1000: parseFloat(form.price_per_1000) || 0,
      min_order: parseInt(form.min_order) || 10,
      max_order: parseInt(form.max_order) || 100000,
      average_time: form.average_time,
      description: form.description,
    };
    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(payload);
    }
    setShowForm(false);
    setEditing(null);
    onChanged();
  };

  const toggleActive = async (s: Service) => {
    await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
    onChanged();
  };

  const del = async (id: string) => {
    if (!confirm('Delete this service? This cannot be undone.')) return;
    await supabase.from('services').delete().eq('id', id);
    onChanged();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manage Services</h1>
          <p className="text-slate-400 text-sm">{services.length} services in catalog</p>
        </div>
        <button onClick={startCreate} className="px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 font-semibold text-sm hover:bg-amber-500/20 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="glass rounded-2xl p-6 border border-white/5 mb-6">
          <h3 className="font-bold text-white mb-4">{editing ? 'Edit Service' : 'New Service'}</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Service Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
              <input required value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Price per 1000 ($)</label>
              <input required type="number" step="0.01" value={form.price_per_1000} onChange={(e) => setForm({ ...form, price_per_1000: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Average Time</label>
              <input required value={form.average_time} onChange={(e) => setForm({ ...form, average_time: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Min Order</label>
              <input required type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Max Order</label>
              <input required type="number" value={form.max_order} onChange={(e) => setForm({ ...form, max_order: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
              <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-ink-800 border border-white/5 text-white text-sm focus:border-amber-500/50 focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="px-5 py-2.5 rounded-lg bg-amber-500 text-ink-950 font-bold text-sm hover:bg-amber-400 transition-colors">
              {editing ? 'Update' : 'Create'} Service
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                <th className="text-left p-4 font-medium">Service</th>
                <th className="text-left p-4 font-medium">Platform</th>
                <th className="text-right p-4 font-medium">Price /1k</th>
                <th className="text-center p-4 font-medium hidden sm:table-cell">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="text-white font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.category}</div>
                  </td>
                  <td className="p-4 text-slate-300">{s.platform}</td>
                  <td className="p-4 text-right text-emerald-400 font-bold">${s.price_per_1000.toFixed(2)}</td>
                  <td className="p-4 text-center hidden sm:table-cell">
                    <button onClick={() => toggleActive(s)} className={`text-xs px-2 py-1 rounded-md border ${s.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                      {s.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => startEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => del(s.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

/* ---------- Admin Orders ---------- */
function AdminOrders({ orders, onChanged }: { orders: Order[]; onChanged: () => void }) {
  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    onChanged();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">All Orders</h1>
      <p className="text-slate-400 text-sm mb-6">Manage and update order statuses</p>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                <th className="text-left p-4 font-medium">Order</th>
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium">Service</th>
                <th className="text-right p-4 font-medium hidden sm:table-cell">Qty</th>
                <th className="text-right p-4 font-medium">Charge</th>
                <th className="text-center p-4 font-medium">Status</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="text-xs text-slate-500">#{o.id.slice(0, 8)}</div>
                    <div className="text-xs text-slate-400">{new Date(o.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 text-slate-300 text-xs">{(o as any).profile?.username || '—'}</td>
                  <td className="p-4">
                    <div className="text-white font-medium truncate max-w-[180px]">{o.service?.name || 'Service'}</div>
                  </td>
                  <td className="p-4 text-right text-slate-300 hidden sm:table-cell">{o.quantity.toLocaleString()}</td>
                  <td className="p-4 text-right text-white font-semibold">${Number(o.charge).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-md border ${statusColors[o.status] || statusColors.pending}`}>{o.status}</span>
                  </td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-xs px-2 py-1.5 rounded-lg bg-ink-800 border border-white/5 text-white focus:border-amber-500/50 focus:outline-none"
                    >
                      <option value="pending">pending</option>
                      <option value="processing">processing</option>
                      <option value="completed">completed</option>
                      <option value="partial">partial</option>
                      <option value="canceled">canceled</option>
                    </select>
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

/* ---------- Admin Users ---------- */
function AdminUsers({ users }: { users: Profile[] }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Users</h1>
      <p className="text-slate-400 text-sm mb-6">{users.length} registered users</p>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-xs uppercase">
                <th className="text-left p-4 font-medium">User</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Email</th>
                <th className="text-right p-4 font-medium">Balance</th>
                <th className="text-center p-4 font-medium">Role</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="text-white font-medium">{u.username || '—'}</div>
                    <div className="text-xs text-slate-500">#{u.id.slice(0, 8)}</div>
                  </td>
                  <td className="p-4 text-slate-300 hidden sm:table-cell">{u.email}</td>
                  <td className="p-4 text-right text-white font-semibold">${Number(u.balance).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <span className={`text-xs px-2 py-1 rounded-md border ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs hidden sm:table-cell">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
