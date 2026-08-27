import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  FolderGit2, Plus, Trash2, Cpu, Database, HardDrive,
  Server, X, CheckCircle, Clock, Loader2, Zap, AlertCircle
} from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const API = API_URL;

const resourceIcon = (type) => {
  switch (type) {
    case 'VM':       return <Cpu className="w-4 h-4 text-violet-400" />;
    case 'Database': return <Database className="w-4 h-4 text-emerald-400" />;
    case 'Storage':  return <HardDrive className="w-4 h-4 text-amber-400" />;
    default:         return <Server className="w-4 h-4 text-blue-400" />;
  }
};

const statusBadge = (status) => {
  const classes = {
    active:     'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm',
    inactive:   'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30 backdrop-blur-sm',
    terminated: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 backdrop-blur-sm',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${classes[status] || classes.inactive}`}>
      {status}
    </span>
  );
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

/* ─── Allocate Resource Modal ─── */
function AllocateModal({ project, onClose, onAllocated, token }) {
  const [resources, setResources]   = useState([]);
  const [selected, setSelected]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    axios.get(`${API}/resources`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        const available = r.data.filter(res => res.status === 'available');
        setResources(available);
      })
      .catch(() => setError('Failed to load resources'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAllocate = async () => {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      await axios.post(`${API}/resources/allocate`,
        { resourceId: selected, projectId: project.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onAllocated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Allocation failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden" animate="visible" exit="exit"
    >
      <motion.div 
        className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        variants={modalVariants}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-lg font-bold text-white">Allocate Resource</h2>
            <p className="text-sm text-gray-400 mt-0.5">Project: <span className="text-indigo-400 font-medium">{project.name}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading available resources...</span>
            </div>
          )}
          {!loading && resources.length === 0 && (
            <div className="text-center py-12">
              <Server className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No available resources</p>
              <p className="text-sm text-gray-600 mt-1">All resources are currently allocated. Ask an admin to provision more.</p>
            </div>
          )}
          {!loading && resources.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Available Resources ({resources.length})</p>
              {resources.map((res, i) => (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={res.id}
                  onClick={() => setSelected(res.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                    selected === res.id
                      ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/10 shadow-inner">
                        {resourceIcon(res.type)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{res.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{res.region}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-indigo-400 font-bold text-sm">₹{res.baseCost.toFixed(2)}<span className="text-gray-500 font-normal">/mo</span></p>
                      <span className="inline-block mt-1 bg-zinc-800 text-zinc-300 text-xs px-1.5 py-0.5 rounded border border-white/5">{res.type}</span>
                    </div>
                  </div>
                  {(res.cpu || res.ram || res.disk) && (
                    <div className="flex gap-4 mt-3 text-xs text-gray-400">
                      {res.cpu  && <span>{res.cpu} vCPU</span>}
                      {res.ram  && <span>{res.ram} GB RAM</span>}
                      {res.disk && <span>{res.disk} GB SSD</span>}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors">
            Cancel
          </button>
          <button
            onClick={handleAllocate}
            disabled={!selected || saving}
            className="px-5 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {saving ? 'Allocating...' : 'Allocate Resource'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Create Project Modal ─── */
function CreateProjectModal({ onClose, onCreate }) {
  const [name, setName]             = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await onCreate(name.trim(), description.trim());
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      variants={overlayVariants}
      initial="hidden" animate="visible" exit="exit"
    >
      <motion.div 
        className="bg-[#111827]/80 backdrop-blur-xl border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        variants={modalVariants}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-bold text-white">New Project</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Name <span className="text-rose-400">*</span></label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. E-Commerce Platform"
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief description of this project..."
              className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/10 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving || !name.trim()} className="px-5 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Projects() {
  const { user }                          = useAuth();
  const [projects, setProjects]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showCreate, setShowCreate]       = useState(false);
  const [allocateTarget, setAllocateTarget] = useState(null);
  const [terminating, setTerminating]    = useState(null);
  const [invoiceMsg, setInvoiceMsg]      = useState('');
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/projects`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleCreate = async (name, description) => {
    await axios.post(`${API}/projects`, { name, description }, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project? This will also remove all resource allocations.')) return;
    try {
      await axios.delete(`${API}/projects/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleTerminate = async (allocationId) => {
    if (!confirm('Deallocate this resource? Its usage will be recorded for billing.')) return;
    setTerminating(allocationId);
    try {
      await axios.patch(`${API}/resources/allocations/${allocationId}/terminate`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to terminate allocation');
    } finally {
      setTerminating(null);
    }
  };

  const handleGenerateInvoice = async () => {
    setGeneratingInvoice(true);
    setInvoiceMsg('');
    try {
      const res = await axios.post(`${API}/bills`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setInvoiceMsg(`✅ Invoice #${res.data.id.substring(0, 8).toUpperCase()} generated — ₹${res.data.totalAmount.toFixed(2)}. View it in Billing.`);
    } catch (err) {
      setInvoiceMsg(`❌ ${err.response?.data?.message || 'Invoice generation failed'}`);
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" />
      Loading projects...
    </div>
  );

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm">
              <FolderGit2 className="w-7 h-7 text-indigo-400" />
            </span>
            My Projects
          </h1>
          <p className="text-muted-foreground text-sm mt-1 ml-1">Create projects and allocate cloud resources to them.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerateInvoice}
            disabled={generatingInvoice}
            className="px-4 py-2 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 backdrop-blur-sm font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {generatingInvoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {generatingInvoice ? 'Generating...' : 'Generate Invoice'}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 border border-white/10"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </motion.div>

      {/* Invoice message */}
      <AnimatePresence>
        {invoiceMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-lg ${
              invoiceMsg.startsWith('✅')
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
            }`}
          >
            <span>{invoiceMsg}</span>
            <button onClick={() => setInvoiceMsg('')} className="ml-auto shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {projects.length === 0 && (
        <motion.div variants={itemVariants} className="col-span-full flex flex-col items-center justify-center py-24 bg-card/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
          <FolderGit2 className="w-16 h-16 text-gray-500 mb-4 drop-shadow-md" />
          <h3 className="text-lg font-bold text-foreground">No projects yet</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Create your first cloud project to get started.</p>
          <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 border border-white/10">
            <Plus className="w-4 h-4" /> Create Project
          </button>
        </motion.div>
      )}

      {/* Project Cards Grid */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={containerVariants}>
        {projects.map(project => {
          const activeAllocs = project.resourceAllocations.filter(a => a.status === 'active');
          const terminatedAllocs = project.resourceAllocations.filter(a => a.status === 'terminated');
          const monthlyCost = activeAllocs.reduce((sum, a) => sum + a.resource.baseCost, 0);

          return (
            <motion.div 
              key={project.id} 
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-white/5 to-transparent">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-foreground truncate">{project.name}</h3>
                      {statusBadge(project.status)}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/20 hover:text-rose-400 transition-colors shrink-0"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Cost summary */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created {new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs text-muted-foreground">Est. monthly cost</p>
                    <p className="text-base font-bold text-indigo-400 drop-shadow-md">₹{monthlyCost.toFixed(2)}<span className="text-xs text-muted-foreground font-normal">/mo</span></p>
                  </div>
                </div>
              </div>

              {/* Active Allocations */}
              <div className="px-6 py-4 border-t border-white/10 flex-1 bg-black/20">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Active Resources ({activeAllocs.length})
                  </p>
                  <button
                    onClick={() => setAllocateTarget(project)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors px-2.5 py-1 rounded-lg hover:bg-indigo-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Resource
                  </button>
                </div>

                {activeAllocs.length === 0 && (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <Server className="w-8 h-8 text-gray-500 mx-auto mb-2 drop-shadow-sm" />
                    <p className="text-sm text-muted-foreground">No resources allocated yet.</p>
                    <button
                      onClick={() => setAllocateTarget(project)}
                      className="mt-2 text-xs text-indigo-400 hover:underline"
                    >
                      Allocate your first resource →
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <AnimatePresence>
                    {activeAllocs.map(alloc => (
                      <motion.div 
                        key={alloc.id} 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 group/alloc hover:bg-white/10 transition-colors"
                      >
                        <div className="p-1.5 rounded-lg bg-black/40 shadow-inner">
                          {resourceIcon(alloc.resource.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{alloc.resource.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {alloc.resource.type} · {alloc.resource.region} · Since {new Date(alloc.startDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-emerald-400 drop-shadow-sm">₹{alloc.resource.baseCost.toFixed(2)}/mo</p>
                        </div>
                        <button
                          onClick={() => handleTerminate(alloc.id)}
                          disabled={terminating === alloc.id}
                          title="Deallocate resource"
                          className="opacity-0 group-hover/alloc:opacity-100 ml-1 p-1.5 rounded-lg text-muted-foreground hover:bg-rose-500/20 hover:text-rose-400 transition-all disabled:cursor-not-allowed"
                        >
                          {terminating === alloc.id
                            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                            : <X className="w-3.5 h-3.5" />}
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Terminated allocations (collapsed) */}
                {terminatedAllocs.length > 0 && (
                  <details className="mt-3 group/details">
                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none">
                      {terminatedAllocs.length} terminated resource{terminatedAllocs.length > 1 ? 's' : ''} (click to show)
                    </summary>
                    <div className="space-y-1.5 mt-2">
                      {terminatedAllocs.map(alloc => (
                        <div key={alloc.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 opacity-60">
                          <div className="p-1 rounded bg-black/40">{resourceIcon(alloc.resource.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate line-through opacity-60">{alloc.resource.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alloc.startDate).toLocaleDateString()} → {new Date(alloc.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-xs text-rose-400">terminated</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {showCreate && (
          <CreateProjectModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {allocateTarget && (
          <AllocateModal
            project={allocateTarget}
            token={user.token}
            onClose={() => setAllocateTarget(null)}
            onAllocated={fetchProjects}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
