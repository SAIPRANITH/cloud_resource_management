import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  Users, Server, IndianRupee, TrendingUp, FolderGit2,
  Receipt, CheckCircle, Clock, Loader2, AlertCircle,
  BarChart3, UserCheck, Zap, ChevronDown, ChevronUp, X
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const API = API_URL;

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

/* ─── Admin: Generate Bill for a user ─── */
function GenerateBillModal({ user: targetUser, token, onClose, onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/generate-bill`,
        { userId: targetUser.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onGenerated(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">Generate Invoice</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 py-5">
          <p className="text-gray-300 text-sm">
            Generate an invoice for <span className="font-bold text-white">{targetUser.name}</span>{' '}
            (<span className="text-indigo-400">{targetUser.email}</span>) based on all their resource allocations?
          </p>
          <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-amber-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Costs are calculated from allocation start to end date (or current time if still active).
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
              {loading ? 'Generating...' : 'Generate Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Stat Card ─── */
// eslint-disable-next-line no-unused-vars
function StatCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/20 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-extrabold text-foreground mt-2">{value}</h3>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-muted ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

/* ─── User Row ─── */
function UserRow({ u, token, onBillGenerated }) {
  const [expanded, setExpanded]   = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const isAdmin = u.roles.includes('Admin');

  return (
    <>
      <tr
        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => setExpanded(p => !p)}
      >
        {/* User */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {u.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{u.name}</p>
              <p className="text-muted-foreground text-xs">{u.email}</p>
            </div>
          </div>
        </td>
        {/* Role */}
        <td className="px-5 py-4">
          {u.roles.map(r => (
            <span key={r} className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
              r === 'Admin'
                ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}>{r}</span>
          ))}
        </td>
        {/* Projects */}
        <td className="px-5 py-4 text-center">
          <span className="font-semibold text-foreground">{u.projectCount}</span>
        </td>
        {/* Resources */}
        <td className="px-5 py-4 text-center">
          <div>
            <span className="font-semibold text-foreground">{u.totalAllocations}</span>
            {u.activeAllocations > 0 && (
              <span className="ml-1.5 text-xs text-emerald-400">({u.activeAllocations} active)</span>
            )}
          </div>
        </td>
        {/* Billed */}
        <td className="px-5 py-4 text-right">
          <div>
            <p className="font-bold text-foreground">₹{u.totalBilled.toFixed(2)}</p>
            {u.totalPaid > 0 && <p className="text-xs text-emerald-400">₹{u.totalPaid.toFixed(2)} paid</p>}
            {u.totalPending > 0 && <p className="text-xs text-amber-400">₹{u.totalPending.toFixed(2)} pending</p>}
          </div>
        </td>
        {/* Actions */}
        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-end gap-2">
            {!isAdmin && (
              <button
                onClick={() => setShowBillModal(true)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                Bill
              </button>
            )}
            <button
              onClick={() => setExpanded(p => !p)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-muted/20">
          <td colSpan={6} className="px-5 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">Registered</p>
                <p className="font-semibold text-foreground">{new Date(u.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">Est. Cost (Unibilled)</p>
                <p className="font-semibold text-indigo-400">₹{u.estimatedCost.toFixed(2)}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">Total Invoices</p>
                <p className="font-semibold text-foreground">{u.invoiceCount}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-3">
                <p className="text-xs text-muted-foreground mb-1">Active Resources</p>
                <p className="font-semibold text-emerald-400">{u.activeAllocations}</p>
              </div>
            </div>
          </td>
        </tr>
      )}

      {showBillModal && (
        <GenerateBillModal
          user={u}
          token={token}
          onClose={() => setShowBillModal(false)}
          onGenerated={onBillGenerated}
        />
      )}
    </>
  );
}

/* ─── Main Admin Dashboard ─── */
export default function AdminDashboard() {
  const { user }              = useAuth();
  const [stats, setStats]     = useState(null);
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [billMsg, setBillMsg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${user.token}` } }),
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${user.token}` } })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleBillGenerated = (bill) => {
    setBillMsg(`✅ Invoice generated — ₹${bill.totalAmount.toFixed(2)}`);
    fetchData();
    setTimeout(() => setBillMsg(''), 5000);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" />
      Loading admin data...
    </div>
  );

  const pieData = stats?.resourceBreakdown?.map(r => ({
    name: r.type,
    value: r.count
  })) || [];

  const revenueData = [
    { name: 'Collected', amount: stats?.totalRevenue || 0 },
    { name: 'Pending',   amount: stats?.pendingRevenue || 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <span className="p-2 rounded-xl bg-violet-500/10">
            <BarChart3 className="w-7 h-7 text-violet-400" />
          </span>
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1 ml-1">
          Platform-wide overview — users, resources, and billing at a glance.
        </p>
      </div>

      {/* Bill success message */}
      {billMsg && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          {billMsg}
          <button onClick={() => setBillMsg('')} className="ml-auto opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"        value={stats?.totalUsers}        icon={Users}       color="text-blue-400"    sub={`${stats?.newUsersLast7Days} new in last 7 days`} />
        <StatCard label="Total Projects"     value={stats?.totalProjects}     icon={FolderGit2}  color="text-indigo-400"  sub="Across all users" />
        <StatCard label="Active Allocations" value={stats?.activeAllocations} icon={Zap}         color="text-emerald-400" sub={`of ${stats?.totalResources} total resources`} />
        <StatCard label="Total Invoices"     value={stats?.totalInvoices}     icon={Receipt}     color="text-amber-400"   sub="All time" />
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">Revenue Collected</p>
            <p className="text-4xl font-extrabold">₹{(stats?.totalRevenue || 0).toFixed(2)}</p>
            <p className="text-indigo-300 text-xs mt-1">From paid invoices</p>
          </div>
          <IndianRupee className="absolute -right-4 -bottom-4 w-28 h-28 text-white/10" />
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg shadow-amber-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-amber-100 text-sm font-medium mb-1">Revenue Pending</p>
            <p className="text-4xl font-extrabold">₹{(stats?.pendingRevenue || 0).toFixed(2)}</p>
            <p className="text-amber-200 text-xs mt-1">Awaiting payment</p>
          </div>
          <TrendingUp className="absolute -right-4 -bottom-4 w-28 h-28 text-white/10" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-muted-foreground" />
            Revenue Overview
          </h2>
          <div style={{ width: '100%', height: 192, minHeight: 192 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={48}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.3} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]}>
                  {revenueData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#6366f1' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resource Distribution Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Server className="w-4 h-4 text-muted-foreground" />
            Resource Distribution
          </h2>
          {pieData.length === 0 ? (
            <div style={{ height: 192 }} className="flex items-center justify-center text-muted-foreground text-sm">
              No resources provisioned yet.
            </div>
          ) : (
            <div style={{ width: '100%', height: 192, minHeight: 192 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 px-6 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-muted-foreground" />
            Registered Users ({filteredUsers.length})
          </h2>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full sm:w-64 px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-5 py-3 text-left text-xs text-muted-foreground font-semibold uppercase tracking-wider">User</th>
                <th className="px-5 py-3 text-left text-xs text-muted-foreground font-semibold uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-center text-xs text-muted-foreground font-semibold uppercase tracking-wider">Projects</th>
                <th className="px-5 py-3 text-center text-xs text-muted-foreground font-semibold uppercase tracking-wider">Resources</th>
                <th className="px-5 py-3 text-right text-xs text-muted-foreground font-semibold uppercase tracking-wider">Billing</th>
                <th className="px-5 py-3 text-right text-xs text-muted-foreground font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
              {filteredUsers.map(u => (
                <UserRow
                  key={u.id}
                  u={u}
                  token={user.token}
                  onBillGenerated={handleBillGenerated}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
