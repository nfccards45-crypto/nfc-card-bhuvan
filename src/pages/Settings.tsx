import React, { useState } from 'react';
import {
  User,
  Shield,
  Globe,
  Database,
  Info,
  Trash2,
  Phone,
  CreditCard,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { cardService } from '../services/cardService';
import { APP_CONFIG } from '../lib/constants';

export const Settings: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || 'Admin');
  const [email, setEmail] = useState(user?.email || 'admin@cardsync.io');
  
  // Dialog States
  const [isWipeCardsDialogOpen, setIsWipeCardsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success('Profile Updated', 'Admin profile details saved.');
  };

  const handleWipeCards = async () => {
    setIsProcessing(true);
    try {
      await cardService.wipeAllCards();
      success('Cards Wiped', 'All cards cleared from database.');
      setIsWipeCardsDialogOpen(false);
    } catch (err) {
      error('Wipe failed', (err as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const contacts = [
    {
      name: 'Bhuvan',
      phone: '6363603365',
      role: 'Orders & Support',
    },
    {
      name: 'Manish',
      phone: '8105055737',
      role: 'Orders & Support',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings"
        description="Admin profile, dynamic domain configuration, order contacts, and database management."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Profile Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <User className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Admin Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Admin Name"
                />
                <Input
                  label="Admin Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@domain.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Administrative Role
                </label>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-slate-800 font-semibold">
                    <Shield className="w-4 h-4 text-brand-600" />
                    <span>{user?.role || 'Super Admin'}</span>
                  </div>
                  <span className="text-xs bg-brand-50 text-brand-700 font-medium px-2 py-0.5 rounded">
                    Full Access
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="sm">
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Orders Contacts Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Phone className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Orders Contacts</h3>
            </div>

            <p className="text-xs text-slate-500">
              Key contacts for orders and support. Reach these numbers for card order inquiries.
            </p>

            <div className="space-y-3">
              {contacts.map(contact => (
                <div
                  key={contact.phone}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {contact.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{contact.name}</div>
                      <div className="text-xs text-slate-500">{contact.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <a
                      href={`tel:+91${contact.phone}`}
                      className="font-mono text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic URL Domain Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Globe className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Dynamic URL Domain</h3>
            </div>

            <p className="text-xs text-slate-500">
              The canonical base domain assigned to all dynamic NFC chips and QR codes across the network.
            </p>

            <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-sm flex items-center justify-between border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Production Dynamic Base URL:</span>
                <span className="text-brand-300 font-semibold">{APP_CONFIG.dynamicBaseUrl}</span>
              </div>
              <span className="text-[11px] font-sans font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-1 rounded">
                Active
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <div><strong>Dynamic Path Pattern:</strong> <code className="text-slate-800 font-mono">/c/&#123;PUBLIC_TOKEN&#125;</code></div>
              <div><strong>Default Target:</strong> Google.com (changeable per card)</div>
              <div><strong>Resolution:</strong> Supabase Edge Function → HTTP 302 redirect</div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: App Info & Database Tools */}
        <div className="space-y-6">
          {/* App Info Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Info className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Application Info</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Project Name</span>
                <span className="font-semibold text-slate-800">{APP_CONFIG.appName}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Version</span>
                <span className="font-mono text-slate-800">{APP_CONFIG.version}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Data Layer</span>
                <span className="text-brand-700 font-mono font-medium">Supabase PostgreSQL</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Backend Status</span>
                <span className="text-emerald-700 font-medium">Connected & Active</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-slate-500">Admin Email</span>
                <span className="font-mono text-slate-700 text-[11px]">admin@cardsync.io</span>
              </div>
            </div>
          </div>

          {/* Database Tools Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Database className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Data & Reset Tools</h3>
            </div>

            <p className="text-xs text-slate-500">
              Permanently wipe all card records from the Supabase database. This action cannot be undone.
            </p>

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWipeCardsDialogOpen(true)}
                leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
                className="w-full text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                Wipe All Database Cards
              </Button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              ⚠ Wiping cards is permanent and irreversible. All card numbers, tokens, and scan history will be lost.
            </div>
          </div>

          {/* Card Count Info Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">Card System</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Card Format</span>
                <code className="font-mono text-slate-800">CARD-0001 → ∞</code>
              </div>
              <div className="flex justify-between">
                <span>Token Format</span>
                <code className="font-mono text-slate-800">8-char Random</code>
              </div>
              <div className="flex justify-between">
                <span>Batch Size</span>
                <code className="font-mono text-slate-800">50 cards</code>
              </div>
              <div className="flex justify-between">
                <span>Default Destination</span>
                <code className="font-mono text-slate-800">google.com</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wipe Cards Dialog */}
      <ConfirmDialog
        isOpen={isWipeCardsDialogOpen}
        onClose={() => setIsWipeCardsDialogOpen(false)}
        onConfirm={handleWipeCards}
        title="Wipe All Database Cards"
        message="Are you sure you want to permanently delete ALL card records from the Supabase database? This will delete all card numbers, tokens, and scan history. This action cannot be undone."
        confirmText="Wipe All Cards"
        isLoading={isProcessing}
      />
    </div>
  );
};
