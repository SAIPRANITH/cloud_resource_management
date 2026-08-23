import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Users, Server, FolderGit2, Banknote, Bell, Cpu, Link, TrendingUp, AlertCircle } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${API_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

  const stats = [
    { name: 'Total Users', value: data?.summary?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { name: 'Active Projects', value: data?.summary?.totalProjects || 0, icon: FolderGit2, color: 'text-indigo-500' },
    { name: 'Running Resources', value: data?.summary?.runningResources || 0, icon: Server, color: 'text-emerald-500' },
    { name: 'Monthly Revenue', value: `₹${data?.summary?.monthlyRevenue || 0}`, icon: Banknote, color: 'text-amber-500' },
    { name: 'Active Alerts', value: data?.summary?.activeAlerts || 0, icon: Bell, color: 'text-rose-500' },
    { name: 'Pending Bills', value: data?.summary?.pendingBills || 0, icon: Link, color: 'text-purple-500' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.name}</p>
                <h3 className="text-3xl font-bold mt-2 text-foreground">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6 min-w-0">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 min-w-0">
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-foreground">Cluster Performance</h2>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.metrics || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}%`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" name="CPU Usage" />
                  <Area type="monotone" dataKey="ram" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRam)" name="RAM Usage" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 min-w-0">
            <div className="flex items-center gap-2 mb-6">
               <TrendingUp className="w-5 h-5 text-emerald-500" />
               <h2 className="text-xl font-bold text-foreground">Future Usage Forecast</h2>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.predictions || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} tickFormatter={value => `${value}%`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.2} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line type="monotone" dataKey="predictedCpu" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Est CPU" />
                  <Line type="monotone" dataKey="predictedRam" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Est RAM" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
               <Bell className="w-5 h-5 text-rose-500" />
               <h2 className="text-xl font-bold text-foreground">Recent Alerts</h2>
             </div>
             {data?.alerts?.length > 0 && (
               <span className="px-2 py-1 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-full">{data.alerts.length}</span>
             )}
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {data?.alerts?.length > 0 ? (
              data.alerts.map((alert, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-background border border-border transition-colors hover:bg-muted/50 cursor-default">
                   <div className="mt-0.5">
                     <AlertCircle className="w-4 h-4 text-amber-500" />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-foreground">{alert.title}</p>
                     <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{alert.message}</p>
                   </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                 <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                 <p className="text-sm font-medium">No active alerts</p>
                 <p className="text-xs opacity-70 mt-1">Your systems are clean.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
