import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Copy,
  Eye,
  Edit2,
  Plus,
  QrCode,
  ExternalLink,
  RefreshCw,
  Trash2,
  Download,
  Layers,
  CheckSquare,
  Square,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Table, Column } from '../components/ui/Table';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { cardService } from '../services/cardService';
import { Card, CardStatus } from '../types';
import { formatDate, getDynamicUrl, copyToClipboard } from '../utils';
import { exportCardsQrZip } from '../utils/qrExportUtils';
import { ALL_CARD_STATUSES, APP_CONFIG } from '../lib/constants';
import { useToast } from '../hooks/useToast';

export const Cards: React.FC = () => {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [cards, setCards] = useState<Card[]>([]);
  const [filteredCards, setFilteredCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selection state for bulk actions
  const [selectedCardIds, setSelectedCardIds] = useState<Set<string>>(new Set());

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal for Create Single Card
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDestinationUrl, setNewDestinationUrl] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Modal for Edit Destination / Status Change / Client Assignment
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDestinationUrl, setEditDestinationUrl] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editStatus, setEditStatus] = useState<CardStatus>('Ready');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Card State
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [isExportingSelected, setIsExportingSelected] = useState(false);

  // CSV Import / Restore Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');
  const [importClientName, setImportClientName] = useState('');
  const [importBatchName, setImportBatchName] = useState('Restored Printed Batch');
  const [importOverrideDest, setImportOverrideDest] = useState('');
  const [parsedPreview, setParsedPreview] = useState<Array<{
    internal_card_no: string;
    public_token: string;
    destination_url?: string;
    status?: CardStatus;
    scan_count?: number;
  }>>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Bulk Edit Destination State
  const [isBulkDestModalOpen, setIsBulkDestModalOpen] = useState(false);
  const [bulkDestinationUrl, setBulkDestinationUrl] = useState('');
  const [bulkClientName, setBulkClientName] = useState('');
  const [isSavingBulkDest, setIsSavingBulkDest] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const cardsData = await cardService.getCards();
      setCards(cardsData);
      setSelectedCardIds(new Set());
    } catch (err) {
      const msg = (err as Error).message || 'Failed to load cards from Supabase';
      setLoadError(msg);
      error('Failed to load cards', msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter effect
  useEffect(() => {
    let result = [...cards];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.internal_card_no.toLowerCase().includes(q) ||
          c.public_token.toLowerCase().includes(q) ||
          c.destination_url.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
    }

    setFilteredCards(result);
  }, [cards, searchQuery, statusFilter]);

  const handleToggleSelectCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedCardIds.size === filteredCards.length) {
      setSelectedCardIds(new Set());
    } else {
      setSelectedCardIds(new Set(filteredCards.map(c => c.id)));
    }
  };

  const handleCopy = async (card: Card, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getDynamicUrl(card.public_token);
    const copied = await copyToClipboard(url);
    if (copied) {
      success('Copied Dynamic URL', url);
    } else {
      error('Failed to copy URL');
    }
  };

  const handleOpenEdit = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCard(card);
    setEditDestinationUrl(card.destination_url);
    setEditClientName(card.client_name || '');
    setEditStatus(card.status);
    setIsEditModalOpen(true);
  };

  const handleDeleteCardPrompt = (card: Card, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardToDelete(card);
  };

  const handleConfirmDeleteCard = async () => {
    if (!cardToDelete) return;
    setIsDeleting(true);
    try {
      await cardService.deleteCard(cardToDelete.id);
      success('Card Deleted', `${cardToDelete.internal_card_no} permanently removed from Supabase.`);
      setCardToDelete(null);
      await loadData();
    } catch (err) {
      error('Failed to delete card', (err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    const ids = Array.from(selectedCardIds);
    if (ids.length === 0) return;

    setIsDeleting(true);
    try {
      await cardService.deleteCardsBulk(ids);
      success('Cards Deleted', `Permanently removed ${ids.length} cards from Supabase.`);
      setIsBulkDeleteDialogOpen(false);
      setSelectedCardIds(new Set());
      await loadData();
    } catch (err) {
      error('Bulk deletion failed', (err as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportSelectedQRs = async () => {
    const selectedCards = cards.filter(c => selectedCardIds.has(c.id));
    if (selectedCards.length === 0) return;

    setIsExportingSelected(true);
    try {
      const zipName = `QR_Export_Selected_${selectedCards.length}_Cards.zip`;
      await exportCardsQrZip(selectedCards, {
        format: 'png',
        size: 1000,
        zipFilename: zipName,
      });
      success('QR Export Ready', `Downloaded ${zipName} with ${selectedCards.length} QR codes.`);
    } catch (err) {
      error('Export failed', (err as Error).message);
    } finally {
      setIsExportingSelected(false);
    }
  };

  const parseCsvText = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    const cardNoIdx = headers.findIndex(h => h.includes('card no') || h.includes('internal'));
    const tokenIdx = headers.findIndex(h => h.includes('token') || h.includes('public'));
    const destIdx = headers.findIndex(h => h.includes('destination') || h.includes('backend') || h.includes('url'));
    const statusIdx = headers.findIndex(h => h.includes('status'));
    const scanIdx = headers.findIndex(h => h.includes('scan'));

    const items: Array<{
      internal_card_no: string;
      public_token: string;
      destination_url?: string;
      status?: CardStatus;
      scan_count?: number;
    }> = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const values: string[] = [];
      let cur = '';
      let inQ = false;
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') inQ = !inQ;
        else if (char === ',' && !inQ) {
          values.push(cur.trim());
          cur = '';
        } else {
          cur += char;
        }
      }
      values.push(cur.trim());

      const rawCardNo = cardNoIdx >= 0 ? values[cardNoIdx] : values[0];
      const rawToken = tokenIdx >= 0 ? values[tokenIdx] : values[1];
      const rawDest = destIdx >= 0 ? values[destIdx] : undefined;
      const cleanDest = rawDest ? rawDest.replace(/^"|"$/g, '').trim() : undefined;
      const rawStatus = statusIdx >= 0 ? values[statusIdx] : 'Ready';
      const rawScans = scanIdx >= 0 ? parseInt(values[scanIdx], 10) || 0 : 0;

      if (rawCardNo && rawToken) {
        items.push({
          internal_card_no: rawCardNo.replace(/^"|"$/g, '').trim(),
          public_token: rawToken.replace(/^"|"$/g, '').trim().toUpperCase(),
          destination_url: cleanDest,
          status: (rawStatus.replace(/^"|"$/g, '').trim() as CardStatus) || 'Ready',
          scan_count: rawScans,
        });
      }
    }
    return items;
  };

  const handleCsvTextChange = (text: string) => {
    setCsvRawText(text);
    const parsed = parseCsvText(text);
    setParsedPreview(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const content = ev.target?.result as string;
      if (content) {
        handleCsvTextChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreCsvSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parsedPreview.length) {
      error('No valid cards parsed from CSV');
      return;
    }
    setIsImporting(true);
    try {
      const cardsToImport = parsedPreview.map(c => ({
        ...c,
        destination_url: importOverrideDest.trim() || c.destination_url || 'https://www.google.com/',
        client_name: importClientName.trim() || undefined,
        batch_name: importBatchName.trim() || undefined,
      }));

      await cardService.restoreCardsFromCsv(cardsToImport);
      success('Cards Restored Successfully', `Imported ${cardsToImport.length} cards into Supabase database.`);
      setIsImportModalOpen(false);
      setCsvRawText('');
      setParsedPreview([]);
      await loadData();
    } catch (err) {
      error('Import failed', (err as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  const handleBulkDestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkDestinationUrl.trim()) {
      error('Destination URL cannot be empty');
      return;
    }
    setIsSavingBulkDest(true);
    try {
      const selectedList = cards.filter(c => selectedCardIds.has(c.id));
      for (const card of selectedList) {
        await cardService.updateCardDestination(card.id, bulkDestinationUrl.trim());
        if (bulkClientName.trim()) {
          await cardService.updateCardClient(card.id, bulkClientName.trim());
        }
      }
      success('Destination Updated', `Updated ${selectedList.length} cards in Supabase.`);
      setIsBulkDestModalOpen(false);
      setSelectedCardIds(new Set());
      await loadData();
    } catch (err) {
      error('Bulk update failed', (err as Error).message);
    } finally {
      setIsSavingBulkDest(false);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const created = await cardService.createCard({
        destination_url: newDestinationUrl.trim() || undefined,
        client_name: newClientName.trim() || undefined,
      });
      success(
        'Card Created Successfully',
        `${created.internal_card_no} with token ${created.public_token} registered in Supabase`
      );
      setIsCreateModalOpen(false);
      setNewDestinationUrl('');
      setNewClientName('');
      await loadData();
    } catch (err) {
      error('Failed to create card', (err as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

    setIsSaving(true);
    try {
      if (editDestinationUrl.trim() !== selectedCard.destination_url.trim()) {
        await cardService.updateCardDestination(selectedCard.id, editDestinationUrl.trim());
      }
      if (editStatus !== selectedCard.status) {
        await cardService.updateCardStatus(selectedCard.id, editStatus);
      }
      if (editClientName.trim() !== (selectedCard.client_name || '')) {
        await cardService.updateCardClient(selectedCard.id, editClientName.trim());
      }
      success('Card Updated', `Saved details for ${selectedCard.internal_card_no}`);
      setIsEditModalOpen(false);
      await loadData();
    } catch (err) {
      error('Update failed', (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const columns: Column<Card>[] = [
    {
      header: (
        <button
          onClick={handleToggleSelectAll}
          className="p-1 hover:text-brand-600 rounded text-slate-400 flex items-center"
          title={selectedCardIds.size === filteredCards.length && filteredCards.length > 0 ? 'Deselect All' : 'Select All'}
        >
          {selectedCardIds.size === filteredCards.length && filteredCards.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-brand-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>
      ),
      cell: card => (
        <button
          onClick={e => handleToggleSelectCard(card.id, e)}
          className="p-1 hover:text-brand-600 rounded text-slate-400 flex items-center"
        >
          {selectedCardIds.has(card.id) ? (
            <CheckSquare className="w-4 h-4 text-brand-600" />
          ) : (
            <Square className="w-4 h-4" />
          )}
        </button>
      ),
    },
    {
      header: 'Card Number',
      accessorKey: 'internal_card_no',
      cell: card => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-900">{card.internal_card_no}</span>
        </div>
      ),
    },
    {
      header: 'Client / Business',
      accessorKey: 'client_name',
      cell: card => (
        <div className="text-xs font-medium text-slate-800">
          {card.client_name || <span className="text-slate-400 italic">Unassigned</span>}
        </div>
      ),
    },
    {
      header: 'Public Token',
      accessorKey: 'public_token',
      cell: card => (
        <span className="inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {card.public_token}
        </span>
      ),
    },
    {
      header: 'Dynamic URL',
      cell: card => {
        const dynUrl = getDynamicUrl(card.public_token);
        return (
          <div className="max-w-xs truncate font-mono text-xs text-brand-700 font-medium" title={dynUrl}>
            {dynUrl}
          </div>
        );
      },
    },
    {
      header: 'Destination URL',
      accessorKey: 'destination_url',
      cell: card => (
        <div className="max-w-xs truncate text-xs font-mono text-slate-500" title={card.destination_url || 'Unset'}>
          {card.destination_url || <span className="text-slate-400 italic">None (Unassigned)</span>}
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: card => <StatusBadge status={card.status} type="card" size="sm" />,
    },
    {
      header: 'Scans',
      accessorKey: 'total_scans',
      cell: card => (
        <span className="font-mono font-bold text-slate-900 px-2 py-0.5 bg-slate-50 rounded">
          {card.total_scans || card.scan_count || 0}
        </span>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: card => <span className="text-xs text-slate-500">{formatDate(card.created_at)}</span>,
    },
    {
      header: 'Actions',
      cell: card => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={e => handleCopy(card, e)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            title="Copy Dynamic URL"
          >
            <Copy className="w-4 h-4" />
          </button>
          <a
            href={getDynamicUrl(card.public_token)}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors"
            title="Test Dynamic URL in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => navigate(`/cards/${card.id}`)}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-md transition-colors"
            title="View Card Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={e => handleOpenEdit(card, e)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
            title="Edit Destination / Status"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={e => handleDeleteCardPrompt(card, e)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
            title="Delete Card Permanently"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cards Inventory"
        description="Live physical PVC cards registered in the Supabase database. Real-time dynamic redirect & status management."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsImportModalOpen(true)}
              leftIcon={<Upload className="w-4 h-4 text-emerald-600" />}
            >
              Import / Restore CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/qr-generator')}
              leftIcon={<QrCode className="w-4 h-4" />}
            >
              Bulk QR Exporter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/batches')}
              leftIcon={<Layers className="w-4 h-4" />}
            >
              Generate 50 Cards Batch
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create 1 Card
            </Button>
          </div>
        }
      />

      {/* Bulk Selection Action Bar (appears when rows are checked) */}
      {selectedCardIds.size > 0 && (
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-900">
            <CheckSquare className="w-4 h-4 text-brand-600" />
            <span>{selectedCardIds.size} cards selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkDestModalOpen(true)}
              leftIcon={<Edit2 className="w-3.5 h-3.5 text-brand-600" />}
              className="bg-white text-xs"
            >
              Set Destination ({selectedCardIds.size})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportSelectedQRs}
              disabled={isExportingSelected}
              isLoading={isExportingSelected}
              leftIcon={<Download className="w-3.5 h-3.5" />}
              className="bg-white text-xs"
            >
              Export Selected QRs (.ZIP)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBulkDeleteDialogOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5 text-rose-600" />}
              className="bg-white text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
            >
              Delete Selected ({selectedCardIds.size})
            </Button>
            <button
              onClick={() => setSelectedCardIds(new Set())}
              className="text-xs text-slate-500 hover:text-slate-800 ml-2"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Search */}
          <div>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search card #, token, destination..."
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="all">All Statuses ({cards.length})</option>
              {ALL_CARD_STATUSES.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredCards.length}</strong> of{' '}
            <strong className="text-slate-800">{cards.length}</strong> live database cards
          </span>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-brand-600 hover:text-brand-800 font-medium"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Cards Table or Error State */}
      {isLoading ? (
        <LoadingState message="Loading cards from Supabase database..." />
      ) : loadError ? (
        <div className="p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3">
          <div className="text-rose-700 font-semibold text-base">Failed to load cards from Supabase</div>
          <p className="text-xs text-rose-600 max-w-md mx-auto">{loadError}</p>
          <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCw className="w-4 h-4" />}>
            Retry Connection
          </Button>
        </div>
      ) : (
        <Table
          columns={columns}
          data={filteredCards}
          keyExtractor={c => c.id}
          onRowClick={c => navigate(`/cards/${c.id}`)}
          emptyState={
            <EmptyState
              icon={CreditCard}
              title="No cards found"
              description={
                searchQuery || statusFilter !== 'all'
                  ? 'No cards match your current search and filter criteria.'
                  : 'No cards in the database yet. Click "Generate 50 Cards Batch" or "Create 1 Card" to start.'
              }
              actionLabel={
                searchQuery || statusFilter !== 'all'
                  ? undefined
                  : 'Generate 50 Cards Batch'
              }
              onAction={() => navigate('/batches')}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          }
        />
      )}

      {/* Create Card Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Dynamic Card"
        description="Generates a unique internal card number and cryptographically secure random public token in Supabase."
        maxWidth="md"
      >
        <form onSubmit={handleCreateCard} className="space-y-4">
          <div>
            <Input
              label="Client / Business Name (Optional)"
              value={newClientName}
              onChange={e => setNewClientName(e.target.value)}
              placeholder="e.g. Acme Corp, Dr. Smith Dental, etc."
              helperText="Assign a client or business name directly to this card."
            />
          </div>

          <div>
            <Input
              label="Destination URL (Optional)"
              type="url"
              value={newDestinationUrl}
              onChange={e => setNewDestinationUrl(e.target.value)}
              placeholder="https://www.google.com"
              helperText="Where users will be redirected. Defaults to Google or can be updated anytime."
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-800">Dynamic Card Specifications:</div>
            <div>• Internal Card #: Auto-incrementing in Supabase (e.g. CARD-0005)</div>
            <div>• Public Token: Secure 8-character random token (e.g. X8KQ29LM)</div>
            <div>• Dynamic URL: <code className="font-mono text-brand-700">{APP_CONFIG.dynamicBaseUrl}/c/&#123;TOKEN&#125;</code></div>
            <div>• Status: Defaults to READY with scan count 0</div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create Card in Database
            </Button>
          </div>
        </form>
      </Modal>

      {/* Quick Edit Modal */}
      {selectedCard && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit ${selectedCard.internal_card_no}`}
          description={`Update destination URL, client details, or status for token ${selectedCard.public_token}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveCard} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Permanent Dynamic URL (NFC & QR payload)
              </label>
              <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 flex items-center justify-between">
                <span>{getDynamicUrl(selectedCard.public_token)}</span>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase font-sans">
                  Fixed
                </span>
              </div>
            </div>

            <div>
              <Input
                label="Client / Business Name (Optional)"
                value={editClientName}
                onChange={e => setEditClientName(e.target.value)}
                placeholder="e.g. Acme Corp, Dr. Smith Dental, etc."
                helperText="Client or business assigned to this card"
              />
            </div>

            <div>
              <Input
                label="Destination URL"
                type="url"
                required
                value={editDestinationUrl}
                onChange={e => setEditDestinationUrl(e.target.value)}
                placeholder="https://www.google.com"
                helperText="Where users are forwarded when accessing the dynamic link"
              />
            </div>

            <div>
              <Select
                label="Card Lifecycle Status"
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as CardStatus)}
                options={ALL_CARD_STATUSES.map(st => ({ value: st, label: st }))}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving}>
                Save Changes to Supabase
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Import / Restore CSV Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import / Restore Printed Cards from CSV"
        maxWidth="lg"
      >
        <form onSubmit={handleRestoreCsvSubmit} className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="font-semibold flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Instant Card Recovery & Dynamic QR Re-linking</span>
            </div>
            <p className="text-emerald-800">
              Paste the manifest CSV from your printed batch export ZIP or upload the CSV file. All cards will be restored into the Supabase database with their original tokens and dynamic URLs immediately.
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Upload CSV File</label>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer border border-slate-200 rounded-lg p-1.5"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Or Paste CSV Content Directly</label>
            <textarea
              rows={6}
              value={csvRawText}
              onChange={e => handleCsvTextChange(e.target.value)}
              placeholder="Internal Card No,Public Token,Dynamic URL,Backend Destination URL,Status,Total Scans..."
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50"
            />
          </div>

          {parsedPreview.length > 0 && (
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-medium text-slate-800">
              <span className="text-emerald-700 font-bold">
                ✓ {parsedPreview.length} valid cards recognized in CSV!
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {parsedPreview[0]?.internal_card_no} ... {parsedPreview[parsedPreview.length - 1]?.internal_card_no}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <Input
                label="Assign Client Name (Optional)"
                value={importClientName}
                onChange={e => setImportClientName(e.target.value)}
                placeholder="e.g. Acme Corp / General"
              />
            </div>
            <div>
              <Input
                label="Batch Name (Optional)"
                value={importBatchName}
                onChange={e => setImportBatchName(e.target.value)}
                placeholder="e.g. Printed Batch 1"
              />
            </div>
          </div>

          <div>
            <Input
              label="Override Destination URL (Optional)"
              type="url"
              value={importOverrideDest}
              onChange={e => setImportOverrideDest(e.target.value)}
              placeholder="Leave blank to use CSV destination (or https://www.google.com)"
              helperText="If provided, this URL will be assigned to all imported cards instead of the CSV value."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImportModalOpen(false)}
              disabled={isImporting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isImporting}
              disabled={parsedPreview.length === 0}
            >
              Restore & Save {parsedPreview.length ? `(${parsedPreview.length} Cards)` : ''} to Supabase
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Update Destination Modal */}
      <Modal
        isOpen={isBulkDestModalOpen}
        onClose={() => setIsBulkDestModalOpen(false)}
        title={`Set Destination for ${selectedCardIds.size} Cards`}
        maxWidth="md"
      >
        <form onSubmit={handleBulkDestSubmit} className="space-y-4">
          <p className="text-xs text-slate-600">
            Update the live dynamic forwarding destination URL for all {selectedCardIds.size} selected cards at once in Supabase.
          </p>

          <div>
            <Input
              label="New Destination URL"
              type="url"
              required
              value={bulkDestinationUrl}
              onChange={e => setBulkDestinationUrl(e.target.value)}
              placeholder="https://g.page/r/your-client/review"
              helperText="All selected cards will redirect to this link immediately when scanned."
            />
          </div>

          <div>
            <Input
              label="Assign Client Name (Optional)"
              value={bulkClientName}
              onChange={e => setBulkClientName(e.target.value)}
              placeholder="e.g. Hotel Marriott"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBulkDestModalOpen(false)}
              disabled={isSavingBulkDest}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSavingBulkDest}>
              Update All {selectedCardIds.size} Cards
            </Button>
          </div>
        </form>
      </Modal>

      {/* Single Card Delete Dialog */}
      <ConfirmDialog
        isOpen={!!cardToDelete}
        onClose={() => setCardToDelete(null)}
        onConfirm={handleConfirmDeleteCard}
        title={`Delete Card ${cardToDelete?.internal_card_no}`}
        message={`Are you sure you want to permanently delete card "${cardToDelete?.internal_card_no}" (Token: ${cardToDelete?.public_token}) from the database? This action cannot be undone.`}
        confirmText="Delete Card"
        isLoading={isDeleting}
      />

      {/* Bulk Delete Dialog */}
      <ConfirmDialog
        isOpen={isBulkDeleteDialogOpen}
        onClose={() => setIsBulkDeleteDialogOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title={`Delete ${selectedCardIds.size} Selected Cards`}
        message={`Are you sure you want to permanently delete these ${selectedCardIds.size} cards from the Supabase database? This action cannot be undone.`}
        confirmText={`Delete ${selectedCardIds.size} Cards`}
        isLoading={isDeleting}
      />
    </div>
  );
};
