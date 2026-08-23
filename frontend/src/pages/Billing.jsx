import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import {
  CreditCard, Download, CheckCircle, Clock, AlertCircle,
  Loader2, FileText, X, TrendingUp, IndianRupee, Receipt
} from 'lucide-react';

const API = API_URL;

/* ─── Pay Modal ─── */
function PayModal({ bill, onClose, onPaid, token }) {
  const [method, setMethod] = useState('Credit Card');
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const methods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'];

  const handlePay = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.post(`${API}/bills/pay`, { billId: bill.id, method }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onPaid();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-white">Pay Invoice</h2>
            <p className="text-sm text-gray-400 mt-0.5">Invoice #{bill.id.substring(0, 8).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Amount */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400 mb-1">Amount Due</p>
            <p className="text-4xl font-extrabold text-white">₹{bill.totalAmount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">Billing Period: {bill.billingMonth}</p>
          </div>

          {/* Payment method */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Payment Method</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {methods.map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    method === m
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                      : 'border-white/8 bg-white/3 text-gray-400 hover:bg-white/6 hover:text-gray-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg px-3 py-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button
              onClick={handlePay}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {saving ? 'Processing...' : `Pay ₹${bill.totalAmount.toFixed(2)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Invoice PDF-like print ─── */
function printInvoice(bill) {
  const win = window.open('', '_blank');
  const items = bill.billItems.map(i => `
    <tr>
      <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;font-size:13px;">${i.description}</td>
      <td style="padding:10px 8px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;font-size:13px;">₹${i.amount.toFixed(2)}</td>
    </tr>`).join('');

  win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Invoice #${bill.id.substring(0,8).toUpperCase()}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 40px; color: #111; }
        h1 { color: #4f46e5; margin: 0; font-size: 28px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .meta { color: #6b7280; font-size: 13px; margin-top: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        thead th { background: #f3f4f6; padding: 12px 8px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; }
        thead th:last-child { text-align: right; }
        .total-row td { padding: 14px 8px; font-weight: 700; font-size: 15px; }
        .tax-row td { padding: 6px 8px; color: #6b7280; font-size: 13px; }
        .badge { display:inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .paid { background: #d1fae5; color: #065f46; }
        .pending { background: #fef3c7; color: #92400e; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>VIT Cloud</h1>
          <div class="meta">Cloud Resource Management Platform</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:20px;font-weight:700;color:#374151;">INVOICE</div>
          <div class="meta">#${bill.id.substring(0,8).toUpperCase()}</div>
          <div class="meta">Period: ${bill.billingMonth}</div>
          <div class="meta" style="margin-top:8px">
            <span class="badge ${bill.status}">${bill.status.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items}
          <tr class="tax-row">
            <td>Subtotal</td>
            <td style="text-align:right">₹${(bill.totalAmount - bill.taxes).toFixed(2)}</td>
          </tr>
          <tr class="tax-row">
            <td>GST / Tax (18%)</td>
            <td style="text-align:right">₹${bill.taxes.toFixed(2)}</td>
          </tr>
          <tr class="total-row" style="border-top:2px solid #111;">
            <td>Total Due</td>
            <td style="text-align:right;color:#4f46e5;">₹${bill.totalAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <div style="margin-top:50px;color:#9ca3af;font-size:12px;text-align:center;">
        Thank you for using VIT Cloud. For billing inquiries contact billing@vitcloud.io
      </div>
    </body>
    </html>
  `);
  win.document.close();
  win.print();
}

/* ─── Main Billing Page ─── */
export default function Billing() {
  const { user }                = useAuth();
  const [bills, setBills]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genMsg, setGenMsg]     = useState('');
  const [payTarget, setPayTarget] = useState(null);

  const fetchBills = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/bills`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => { fetchBills(); }, [fetchBills]);

  const handleGenerateInvoice = async () => {
    setGenerating(true);
    setGenMsg('');
    try {
      const res = await axios.post(`${API}/bills`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGenMsg(`✅ Invoice #${res.data.id.substring(0, 8).toUpperCase()} generated — ₹${res.data.totalAmount.toFixed(2)}`);
      fetchBills();
    } catch (err) {
      setGenMsg(`❌ ${err.response?.data?.message || 'Failed to generate invoice'}`);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
      <Loader2 className="w-6 h-6 animate-spin" />
      Loading invoices...
    </div>
  );

  const pendingTotal   = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.totalAmount, 0);
  const paidTotal      = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.totalAmount, 0);
  const pendingCount   = bills.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/10">
              <CreditCard className="w-7 h-7 text-indigo-400" />
            </span>
            Billing &amp; Invoices
          </h1>
          <p className="text-muted-foreground text-sm mt-1 ml-1">All invoices are computed based on actual resource usage duration.</p>
        </div>
        <button
          onClick={handleGenerateInvoice}
          disabled={generating}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
          {generating ? 'Generating...' : 'Generate Invoice'}
        </button>
      </div>

      {/* Generation message */}
      {genMsg && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
          genMsg.startsWith('✅')
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          <span>{genMsg}</span>
          <button onClick={() => setGenMsg('')} className="ml-auto shrink-0 opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">Total Pending</p>
            <p className="text-3xl font-extrabold">₹{pendingTotal.toFixed(2)}</p>
            <p className="text-indigo-300 text-xs mt-1">{pendingCount} invoice{pendingCount !== 1 ? 's' : ''} due</p>
          </div>
          <IndianRupee className="absolute -right-3 -bottom-3 w-24 h-24 text-white/10" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-muted-foreground text-sm font-medium">Total Paid</p>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{paidTotal.toFixed(2)}</p>
          <p className="text-muted-foreground text-xs mt-1">{bills.filter(b => b.status === 'paid').length} paid invoices</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <p className="text-muted-foreground text-sm font-medium">Total Invoiced</p>
          </div>
          <p className="text-2xl font-bold text-foreground">₹{(pendingTotal + paidTotal).toFixed(2)}</p>
          <p className="text-muted-foreground text-xs mt-1">{bills.length} total invoice{bills.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Invoice List */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Invoice History
        </h2>

        {bills.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-card rounded-2xl border border-border">
            <Receipt className="w-14 h-14 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-foreground">No invoices yet</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-6 text-center max-w-sm">
              Allocate resources to your projects and use "Generate Invoice" to get billed based on usage.
            </p>
            <button onClick={handleGenerateInvoice} disabled={generating} className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Receipt className="w-4 h-4" />}
              Generate Invoice
            </button>
          </div>
        )}

        <div className="space-y-4">
          {bills.map(bill => (
            <div key={bill.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:border-indigo-500/20 transition-all">
              {/* Invoice header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-foreground">
                      Invoice #{bill.id.substring(0, 8).toUpperCase()}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      bill.status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {bill.status === 'paid' ? '✓ PAID' : '⏳ PENDING'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Period: {bill.billingMonth}
                    </span>
                    <span>Generated: {new Date(bill.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-extrabold text-foreground">₹{bill.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => printInvoice(bill)}
                      className="p-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      title="Download / Print Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {bill.status === 'pending' && (
                      <button
                        onClick={() => setPayTarget(bill)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        Pay Now
                      </button>
                    )}
                    {bill.status === 'paid' && (
                      <div className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-semibold flex items-center gap-1.5 border border-emerald-500/20">
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Invoice line items */}
              <div className="border-t border-border px-6 py-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left pb-3 font-semibold">Description</th>
                      <th className="text-right pb-3 font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.billItems.map(item => (
                      <tr key={item.id} className="border-t border-border/50">
                        <td className="py-2.5 text-foreground pr-4">{item.description}</td>
                        <td className="py-2.5 text-right font-semibold text-foreground">₹{item.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-border">
                      <td className="pt-3 pb-1 text-muted-foreground">Subtotal</td>
                      <td className="pt-3 pb-1 text-right text-muted-foreground">₹{(bill.totalAmount - bill.taxes).toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="pb-1 text-muted-foreground text-xs">GST / Tax (18%)</td>
                      <td className="pb-1 text-right text-muted-foreground text-xs">₹{bill.taxes.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t-2 border-border">
                      <td className="pt-3 font-bold text-foreground text-base">Total</td>
                      <td className="pt-3 text-right font-extrabold text-indigo-400 text-lg">₹{bill.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Modal */}
      {payTarget && (
        <PayModal
          bill={payTarget}
          token={user.token}
          onClose={() => setPayTarget(null)}
          onPaid={fetchBills}
        />
      )}
    </div>
  );
}
