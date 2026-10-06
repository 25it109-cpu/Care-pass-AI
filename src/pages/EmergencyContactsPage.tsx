// src/pages/EmergencyContactsPage.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { EmergencyContact } from '../types';
import { EmergencySafetyCard } from '../components/common/EmergencySafetyCard';
import {
  PhoneCall,
  Plus,
  Trash2,
  ShieldCheck,
  User,
  Heart,
  Star,
  Settings,
  AlertTriangle
} from 'lucide-react';

export const EmergencyContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Form
  const [name, setName] = useState<string>('');
  const [relationship, setRelationship] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isPrimary, setIsPrimary] = useState<boolean>(false);

  const loadContacts = async () => {
    try {
      const data = await api.getEmergencyContacts();
      setContacts(data.contacts);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    try {
      await api.addEmergencyContact({
        contactName: name.trim(),
        relationship: relationship.trim() || 'Family',
        phoneNumber: phone.trim(),
        isPrimary
      });
      setName('');
      setRelationship('');
      setPhone('');
      setIsPrimary(false);
      setIsAdding(false);
      await loadContacts();
    } catch (err: any) {
      alert(err.message || 'Failed to add emergency contact');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this emergency contact?')) return;
    try {
      await api.deleteEmergencyContact(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete contact');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-2">
            <PhoneCall className="h-3.5 w-3.5" />
            <span>Safety Card & Contacts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Emergency Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your primary emergency support network and regional emergency dispatch settings.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Main Safety Card with Configurable Emergency Number */}
      <EmergencySafetyCard />

      {/* Add Contact Modal / Form */}
      {isAdding && (
        <form
          onSubmit={handleAddContact}
          className="rounded-2xl border border-cyan-500/30 bg-surface-elevated p-6 shadow-glass space-y-4 animate-in fade-in"
        >
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            New Emergency Contact
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Contact Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Relationship</label>
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g. Sister, Spouse, Caregiver"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
            <input
              type="checkbox"
              id="is-primary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="rounded border-white/20 bg-slate-900 text-cyan-500 focus:ring-cyan-400"
            />
            <label htmlFor="is-primary" className="cursor-pointer">
              Set as primary emergency contact
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan transition-colors"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Emergency Contacts List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-400" />
          <span>Designated Personal Contacts ({contacts.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl border p-5 shadow-glass transition-all ${
                c.isPrimary
                  ? 'bg-surface-elevated border-cyan-500/30'
                  : 'bg-surface-elevated/60 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {c.contactName}
                      {c.isPrimary && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                          Primary
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400">{c.relationship}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete contact"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-200 font-semibold">
                  {c.phoneNumber}
                </span>

                <a
                  href={`tel:${c.phoneNumber}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-bold transition-colors"
                >
                  <PhoneCall className="h-3 w-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {contacts.length === 0 && !loading && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-surface-elevated/30 p-10 text-center text-xs text-slate-400">
            No personal emergency contacts added yet. Click "+ Add Contact" to designate your support contacts.
          </div>
        )}
      </div>
    </div>
  );
};
