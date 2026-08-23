import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Bell, AlertTriangle, Info, CheckCircle2, ShieldAlert, Check, Trash2, Filter } from 'lucide-react';

export default function Alerts() {
  const { user }                      = useAuth();
  const [alerts, setAlerts]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterSeverity, setFilter]   = useState('all');

  // Initial mock + live alerts feed
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const liveAlerts = res.data?.alerts || [];
        // Combine with system monitoring defaults if empty
        if (liveAlerts.length === 0) {
          setAlerts([
            { id: '1', title: 'High CPU Utilization on ap-south-1a', message: 'Spike detected above 85% threshold for 5 consecutive minutes.', severity: 'high', status: 'unread', createdAt: new Date() },
            { id: '2', title: 'Scheduled Database Backup Completed', message: 'Automated snapshot for postgres-small completed successfully.', severity: 'low', status: 'read', createdAt: new Date(Date.now() - 3600000) },
            { id: '3', title: 'Storage Usage Warning (block-store-1tb)', message: 'Storage capacity reached 78% limit. Consider scaling up.', severity: 'medium', status: 'unread', createdAt: new Date(Date.now() - 7200000) }
          ]);
        } else {
          setAlerts(liveAlerts);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [user.token]);

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, status: 'read' })));
  };

  const markRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'read' } : a));
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const filtered = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'high':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> HIGH SEVERITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
            <Info className="w-3 h-3" /> INFO
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
        <Bell className="w-6 h-6 animate-bounce text-rose-400" />
        Loading system alerts...
      </div>
    );
  }

  const unreadCount = alerts.filter(a => a.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="p-2 rounded-xl bg-rose-500/10">
              <Bell className="w-7 h-7 text-rose-400" />
            </span>
            System Incident &amp; Alerts
          </h1>
          <p className="text-muted-foreground text-sm mt-1 ml-1">
            Monitor real-time security events, performance spikes, and infrastructure alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <Check className="w-4 h-4" /> Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Severity Filter Controls */}
      <div className="flex items-center justify-between bg-card border border-border rounded-2xl px-6 py-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Filter by Severity:</span>
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterSeverity === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-foreground">No alerts matching filter</h3>
            <p className="text-sm text-muted-foreground mt-1">Your infrastructure cluster is running smoothly.</p>
          </div>
        ) : (
          filtered.map(alert => (
            <div
              key={alert.id}
              className={`bg-card border rounded-2xl p-5 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                alert.status === 'unread'
                  ? 'border-rose-500/30 bg-rose-500/5 shadow-sm'
                  : 'border-border opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 mt-0.5 ${
                  alert.severity === 'high'
                    ? 'bg-rose-500/10 text-rose-400'
                    : alert.severity === 'medium'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-blue-500/10 text-blue-400'
                }`}>
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-foreground">{alert.title}</h3>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{alert.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {alert.status === 'unread' && (
                  <button
                    onClick={() => markRead(alert.id)}
                    className="px-3 py-1.5 rounded-lg border border-border bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Dismiss
                  </button>
                )}
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                  title="Remove alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
