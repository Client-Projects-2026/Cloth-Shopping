import { useEffect, useState, type FormEvent } from 'react';
import type { ClothingAudience } from '../diwali';
import { prepareGarmentImage, type PreparedImage } from './images';
import { makeForm, seedFor, type AdminPage, type FormImage, type ProductForm } from './model';
import { useAdminSession } from './useAdminSession';
import { useInventory } from './useInventory';
import AdminShell from './pages/AdminShell';
import ImageGuidePage from './pages/ImageGuidePage';
import InventoryPage from './pages/InventoryPage';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import ProductEditorPage from './pages/ProductEditorPage';
import './admin.css';

export default function AdminApp() {
  const session = useAdminSession();
  const inventory = useInventory(session.status === 'authorized', session.userId);
  const [preview, setPreview] = useState(false);
  const [page, setPage] = useState<AdminPage>('overview');
  const [filter, setFilter] = useState<'All' | ClothingAudience>('All');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ProductForm>(() => makeForm('Men', 1));
  const [assets, setAssets] = useState<Partial<Record<FormImage, PreparedImage>>>({});
  const unavailable =
    session.status === 'authorized' && (inventory.loading || inventory.loadFailed);

  useEffect(
    () => () => {
      Object.values(assets).forEach((asset) => asset && URL.revokeObjectURL(asset.preview));
    },
    [assets],
  );

  function openEditor(audience: ClothingAudience, slot: number) {
    const row = inventory.rows.find((item) => item.audience === audience && item.slot === slot);
    setAssets({});
    setForm(makeForm(audience, slot, row, seedFor(audience, slot)));
    inventory.clearMessages();
    setPage('editor');
  }

  function startNew() {
    setAssets({});
    setForm(makeForm('Men', 1));
    inventory.clearMessages();
    setPage('add');
  }

  function navigate(next: AdminPage) {
    if (next === 'add') startNew();
    else {
      inventory.clearMessages();
      setPage(next);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function chooseImage(kind: FormImage, file?: File) {
    if (!file) return;
    inventory.clearMessages();
    try {
      const image = await prepareGarmentImage(file, kind === 'front');
      setAssets((current) => ({ ...current, [kind]: image }));
      inventory.setNotice(
        `${kind === 'front' ? 'Front and rack thumbnail' : `${kind} view`} converted to WebP, ready to publish.`,
      );
    } catch (reason) {
      inventory.setError(
        reason instanceof Error ? reason.message : 'Could not prepare this image.',
      );
    }
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview || session.status !== 'authorized') return;
    if (await inventory.publish(form, assets)) {
      setAssets({});
      setPage('inventory');
    }
  }

  async function exit() {
    inventory.clearMessages();
    if (preview) setPreview(false);
    else await session.signOut();
    setPage('overview');
  }

  if (session.status !== 'authorized' && !preview) {
    return (
      <LoginPage
        authStatus={session.status}
        busy={session.busy}
        error={session.error}
        onSignIn={session.signIn}
        onPreview={() => {
          session.clearError();
          setPreview(true);
        }}
      />
    );
  }

  return (
    <AdminShell
      page={page}
      preview={preview}
      notice={inventory.notice}
      error={inventory.error}
      onNavigate={navigate}
      onExit={exit}
    >
      {unavailable && (
        <section className="admin-card admin-loading-state" role="status">
          <h1>{inventory.loadFailed ? 'Inventory is unavailable.' : 'Loading your inventory…'}</h1>
          <p>
            {inventory.loadFailed
              ? 'The studio could not verify the current catalog. Try loading it again.'
              : 'Checking the latest products and hanger positions.'}
          </p>
          {inventory.loadFailed && (
            <button className="admin-primary" onClick={inventory.reload}>
              Try again
            </button>
          )}
        </section>
      )}
      {!unavailable && page === 'overview' && (
        <OverviewPage
          slots={inventory.slots}
          liveCount={inventory.rows.filter((row) => row.status === 'published').length}
          hiddenCount={inventory.rows.filter((row) => row.status === 'hidden').length}
          sampleCount={20 - inventory.rows.length}
          onAdd={startNew}
          onInventory={() => navigate('inventory')}
          onGuide={() => navigate('guide')}
          onCollection={(audience) => {
            setFilter(audience);
            navigate('inventory');
          }}
        />
      )}
      {!unavailable && page === 'inventory' && (
        <InventoryPage
          slots={inventory.slots}
          filter={filter}
          onFilter={setFilter}
          search={search}
          onSearch={setSearch}
          preview={preview}
          busy={inventory.busy || inventory.loading}
          onAdd={startNew}
          onEdit={openEditor}
          onHide={inventory.hide}
        />
      )}
      {!unavailable && (page === 'add' || page === 'editor') && (
        <ProductEditorPage
          mode={page}
          form={form}
          setForm={setForm}
          assets={assets}
          preview={preview}
          busy={inventory.busy || inventory.loading}
          onBack={() => navigate('inventory')}
          onImage={chooseImage}
          onPublish={publish}
        />
      )}
      {!unavailable && page === 'guide' && <ImageGuidePage onAdd={startNew} />}
    </AdminShell>
  );
}
