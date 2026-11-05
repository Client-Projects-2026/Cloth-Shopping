import { useState, type FormEvent } from 'react';
import { EyeOff, Plus } from 'lucide-react';
import Garment from '../../Garment';
import { garmentUrl } from '../../lib/supabase';
import { products as demoProducts } from '../../products';
import { makeEverydayForm, type EverydayForm } from '../everydayModel';
import { useEverydayInventory } from '../useEverydayInventory';
import { usePreparedImages } from '../usePreparedImages';
import EverydayEditor from './EverydayEditor';

interface Props {
  preview: boolean;
  userId: string;
}

export default function EverydayCollectionPage({ preview, userId }: Props) {
  const inventory = useEverydayInventory(!preview, userId);
  const { assets, prepare, reset } = usePreparedImages();
  const [form, setForm] = useState<EverydayForm | null>(null);

  function open(row?: (typeof inventory.rows)[number]) {
    reset();
    inventory.clearMessages();
    setForm(makeEverydayForm(row));
  }
  function close() {
    reset();
    inventory.clearMessages();
    setForm(null);
  }
  async function chooseImage(file?: File) {
    if (!file) return;
    inventory.clearMessages();
    try {
      if (await prepare('front', file, false))
        inventory.setNotice('Product photo converted to WebP, ready to publish.');
    } catch (reason) {
      inventory.setError(
        reason instanceof Error ? reason.message : 'Could not prepare this photo.',
      );
    }
  }
  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || preview) return;
    if (await inventory.publish(form, assets.front)) {
      reset();
      setForm(null);
    }
  }

  return (
    <>
      {inventory.notice && (
        <p className="admin-success" role="status">
          {inventory.notice}
        </p>
      )}
      {inventory.error && (
        <p className="admin-error" role="alert">
          {inventory.error}
        </p>
      )}
      {inventory.loading && (
        <section className="admin-card admin-loading-state" role="status">
          <h1>Loading the everyday collection…</h1>
        </section>
      )}
      {inventory.loadFailed && (
        <section className="admin-card admin-loading-state">
          <h1>Collection unavailable.</h1>
          <p>Try loading the latest products again.</p>
          <button className="admin-primary" onClick={inventory.reload}>
            Try again
          </button>
        </section>
      )}
      {!inventory.loading &&
        !inventory.loadFailed &&
        (form ? (
          <EverydayEditor
            form={form}
            setForm={setForm}
            image={assets.front}
            preview={preview}
            busy={inventory.busy}
            onBack={close}
            onImage={chooseImage}
            onPublish={publish}
          />
        ) : (
          <>
            <div className="admin-page-head">
              <div>
                <p className="admin-kicker">PIECES FOR REAL LIFE</p>
                <h1>Everyday collection.</h1>
                <p>
                  Add product photos, prices, sizes and categories for the collection below the
                  rack.
                </p>
              </div>
              <button className="admin-primary" onClick={() => open()}>
                <Plus size={18} /> Add collection piece
              </button>
            </div>
            <div className="admin-card everyday-admin-intro">
              <strong>
                {inventory.rows.length
                  ? `${inventory.rows.filter((row) => row.status === 'published').length} published pieces`
                  : 'Six sample pieces are showing in the shop'}
              </strong>
              <p>
                {inventory.rows.length
                  ? 'Edit or hide a piece below. Hidden pieces stay in your studio.'
                  : 'Publishing your first piece replaces the sample collection with your own products.'}
              </p>
            </div>
            <div className="everyday-admin-grid">
              {inventory.rows.length
                ? inventory.rows.map((row) => (
                    <article className="admin-card everyday-admin-item" key={row.id}>
                      <div className="everyday-admin-photo">
                        <img src={garmentUrl(row.image_path)} alt={row.name} />
                      </div>
                      <div className="everyday-admin-meta">
                        <span
                          className={`admin-badge ${row.status === 'hidden' ? 'hidden' : 'live'}`}
                        >
                          {row.status === 'hidden' ? 'Hidden' : 'Live'}
                        </span>
                        <small>
                          {row.category} / Position {row.position}
                        </small>
                        <h2>{row.name}</h2>
                        <p>₹{(row.price_minor / 100).toLocaleString('en-IN')}</p>
                      </div>
                      <div className="everyday-admin-actions">
                        <button onClick={() => open(row)}>Edit piece</button>
                        {row.status === 'published' && (
                          <button
                            disabled={inventory.busy}
                            onClick={() => void inventory.hide(row.id)}
                          >
                            <EyeOff size={16} /> Hide
                          </button>
                        )}
                      </div>
                    </article>
                  ))
                : demoProducts.map((product) => (
                    <article className="admin-card everyday-admin-item" key={product.id}>
                      <div className={`everyday-admin-photo visual-${product.shape}`}>
                        <Garment product={product} />
                      </div>
                      <div className="everyday-admin-meta">
                        <span className="admin-badge demo">Demo</span>
                        <small>{product.category}</small>
                        <h2>{product.name}</h2>
                        <p>Illustrative piece</p>
                      </div>
                    </article>
                  ))}
            </div>
          </>
        ))}
    </>
  );
}
