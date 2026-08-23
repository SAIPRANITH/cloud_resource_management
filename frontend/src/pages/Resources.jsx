import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { Server, Cpu, Database, HardDrive, Plus, X, Loader2, AlertCircle, Trash2 } from 'lucide-react';

function ProvisionModal({ onClose, onProvisioned, token }) {
  const [name, setName]         = useState('');
  const [type, setType]         = useState('VM');
  const [region, setRegion]     = useState('us-east-1');
  const [baseCost, setBaseCost] = useState('25.00');
  const [cpu, setCpu]           = useState('4');
  const [ram, setRam]           = useState('8');
  const [disk, setDisk]         = useState('80');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');

    try {
      await axios.post(`${API_URL}/resources`, {
        name: name.trim(),
        type,
        region,
        baseCost: parseFloat(baseCost),
        cpu: type === 'VM' || type === 'Database' ? parseInt(cpu) : null,
        ram: type === 'VM' || type === 'Database' ? parseInt(ram) : null,
        disk: disk ? parseInt(disk) : null,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onProvisioned();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to provision resource');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Provision New Resource</h2>
            <p className="text-sm text-gray-400 mt-0.5">Add infrastructure to the available cloud pool</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Resource Name <span className="text-rose-400">*</span></label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. app-node-us-east"
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1f2937] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="VM">VM (Compute)</option>
                <option value="Database">Database</option>
                <option value="Storage">Storage</option>
                <option value="LoadBalancer">Load Balancer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Region</label>
              <select
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#1f2937] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="us-east-1">us-east-1 (N. Virginia)</option>
                <option value="us-west-2">us-west-2 (Oregon)</option>
                <option value="eu-west-1">eu-west-1 (Ireland)</option>
                <option value="ap-south-1">ap-south-1 (Mumbai)</option>
                <option value="global">Global CDN</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">vCPU Cores</label>
              <input
                type="number"
                disabled={type === 'Storage' || type === 'LoadBalancer'}
                value={cpu}
                onChange={e => setCpu(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">RAM (GB)</label>
              <input
                type="number"
                disabled={type === 'Storage' || type === 'LoadBalancer'}
                value={ram}
                onChange={e => setRam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Disk (GB)</label>
              <input
                type="number"
                disabled={type === 'LoadBalancer'}
                value={disk}
                onChange={e => setDisk(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-30"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Base Monthly Cost (₹) <span className="text-rose-400">*</span></label>
            <input
              type="number"
              step="0.01"
              required
              value={baseCost}
              onChange={e => setBaseCost(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Provisioning...' : 'Provision Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Resources() {
  const { user }                      = useAuth();
  const [resources, setResources]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showProvision, setShowProvision] = useState(false);
  const isAdmin                       = user?.roles?.includes('Admin');

  const fetchResources = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/resources`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setResources(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchResources(); }, [fetchResources]);

  const handleDeleteResource = async (id) => {
    if (!confirm('Are you sure you want to remove this resource from the cluster pool?')) return;
    try {
      await axios.delete(`${API_URL}/resources/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchResources();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" />
      Loading cluster infrastructure...
    </div>
  );

  const getIcon = (type) => {
    switch(type) {
      case 'VM': return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-500" />;
      case 'Storage': return <HardDrive className="w-5 h-5 text-amber-500" />;
      default: return <Server className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <span className="p-2 rounded-xl bg-indigo-500/10">
            <Server className="w-7 h-7 text-indigo-400" />
          </span>
          Infrastructure Pool
        </h1>
        {isAdmin && (
          <button
            onClick={() => setShowProvision(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Provision Resource
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Resource Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Region</th>
                <th className="px-6 py-4 font-medium">Specs</th>
                <th className="px-6 py-4 font-medium">Base Cost</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {isAdmin && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {resources.map((res) => (
                <tr key={res.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                    {getIcon(res.type)}
                    {res.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded text-xs font-semibold">{res.type}</span>
                  </td>
                  <td className="px-6 py-4">{res.region}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {res.cpu && `${res.cpu} vCPU `} 
                    {res.ram && `• ${res.ram}GB RAM `} 
                    {res.disk && `• ${res.disk}GB SSD`}
                  </td>
                  <td className="px-6 py-4 font-medium">₹{res.baseCost.toFixed(2)}/mo</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${res.status === 'running' ? 'bg-emerald-500' : 'bg-muted-foreground'}`}></div>
                      <span className="capitalize">{res.status}</span>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
                        title="Remove resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-12 text-center text-muted-foreground">
                    No resources provisioned in the cluster.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showProvision && (
        <ProvisionModal
          token={user.token}
          onClose={() => setShowProvision(false)}
          onProvisioned={fetchResources}
        />
      )}
    </div>
  );
}
