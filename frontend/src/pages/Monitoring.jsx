import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  Activity, Cpu, HardDrive, Wifi, Server, RefreshCw, CheckCircle2, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Monitoring() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Telemetry fetch failed', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTelemetry();
  };

  const nodes = [
    { name: 'us-east-1a (Master)', status: 'Optimal', cpu: 32, ram: 58, uptime: '99.99%', load: '1.24' },
    { name: 'us-east-1b (Worker)', status: 'Optimal', cpu: 45, ram: 62, uptime: '99.98%', load: '1.85' },
    { name: 'eu-west-1a (Worker)', status: 'Optimal', cpu: 28, ram: 41, uptime: '99.95%', load: '0.92' },
    { name: 'ap-south-1a (DB Node)', status: 'Warning', cpu: 78, ram: 84, uptime: '99.90%', load: '3.10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
        <Activity className="w-6 h-6 animate-pulse text-indigo-500" />
        Loading telemetry data...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 min-w-0"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
              <Activity className="w-7 h-7 text-indigo-400" />
            </span>
            Real-Time Cluster Telemetry
          </h1>
          <p className="text-muted-foreground text-sm mt-1 ml-1">
            Live metric streams across compute nodes, network bandwidth, and memory allocation.
          </p>
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 rounded-xl bg-muted/80 backdrop-blur-md border border-border hover:bg-muted font-medium text-sm text-foreground transition-all flex items-center gap-2 shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh Metrics'}
        </motion.button>
      </div>

      {/* Metric Cards */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl hover:shadow-indigo-500/10 transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Avg CPU Load</span>
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">42.8%</p>
          <div className="w-full bg-muted/50 h-2 rounded-full mt-3 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '42.8%' }} transition={{ duration: 1, delay: 0.2 }} className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl hover:shadow-emerald-500/10 transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Memory Allocated</span>
            <HardDrive className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">61.2%</p>
          <div className="w-full bg-muted/50 h-2 rounded-full mt-3 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: '61.2%' }} transition={{ duration: 1, delay: 0.3 }} className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl hover:shadow-blue-500/10 transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Network Throughput</span>
            <Wifi className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">1.24 GB/s</p>
          <p className="text-xs text-emerald-400 mt-2 font-medium">↑ 4.2% from last hour</p>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-5 shadow-xl hover:shadow-emerald-500/10 transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cluster Health</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">99.98%</p>
          <p className="text-xs text-muted-foreground mt-2">Zero unhandled outages</p>
        </motion.div>
      </motion.div>

      {/* Main Performance Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-card/60 backdrop-blur-md border border-border rounded-2xl p-6 min-w-0 shadow-xl"
      >
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" />
          24-Hour Workload Telemetry
        </h2>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.metrics || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="monCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="monRam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
              <Tooltip
                contentStyle={{ backgroundColor: 'rgba(24, 24, 27, 0.9)', backdropFilter: 'blur(8px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#monCpu)" name="CPU Load (%)" />
              <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#monRam)" name="RAM Load (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Cluster Nodes Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-card/60 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-xl"
      >
        <div className="px-6 py-4 border-b border-border/50">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Server className="w-5 h-5 text-muted-foreground" />
            Node Infrastructure Telemetry
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border/50 text-xs text-muted-foreground uppercase font-semibold">
              <tr>
                <th className="px-6 py-3.5 text-left">Node Identifier</th>
                <th className="px-6 py-3.5 text-left">Status</th>
                <th className="px-6 py-3.5 text-center">CPU Load</th>
                <th className="px-6 py-3.5 text-center">RAM Used</th>
                <th className="px-6 py-3.5 text-center">System Load</th>
                <th className="px-6 py-3.5 text-right">Uptime</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node, i) => (
                <motion.tr 
                  key={i}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="border-b border-border/50 last:border-0 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-400" />
                    {node.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 backdrop-blur-sm ${
                      node.status === 'Optimal'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                    }`}>
                      {node.status === 'Optimal' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {node.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-mono">{node.cpu}%</td>
                  <td className="px-6 py-4 text-center font-mono">{node.ram}%</td>
                  <td className="px-6 py-4 text-center font-mono text-muted-foreground">{node.load}</td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-400">{node.uptime}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
