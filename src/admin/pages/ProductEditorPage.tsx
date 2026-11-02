import type { Dispatch, FormEvent, SetStateAction } from 'react';
import type { ClothingAudience } from '../../diwali';
import { ArrowLeft, Image as ImageIcon, Plus, Save, ShieldCheck } from 'lucide-react';
import { garmentUrl } from '../../lib/supabase';
import { audiences, defaultSizes, money, type FormImage, type ProductForm } from '../model';
import type { PreparedImage } from '../images';

interface Props {
  mode: 'add' | 'editor';
  form: ProductForm;
  setForm: Dispatch<SetStateAction<ProductForm>>;
  assets: Partial<Record<FormImage, PreparedImage>>;
  preview: boolean;
  busy: boolean;
  onBack: () => void;
  onImage: (kind: FormImage, file?: File) => Promise<void>;
  onPublish: (event: FormEvent<HTMLFormElement>) => void;
}

export default function ProductEditorPage({
  mode,
  form,
  setForm,
  assets,
  preview,
  busy,
  onBack,
  onImage,
  onPublish,
}: Props) {
  return (
    <>
      <div className="admin-page-head admin-editor-head">
        <div>
          <button className="admin-inline-back" onClick={() => onBack()}>
            <ArrowLeft size={16} /> Back to inventory
          </button>
          <p className="admin-kicker">{mode === 'add' ? 'NEW PIECE' : 'EDIT A PIECE'}</p>
          <h1>{mode === 'add' ? 'Add to the rack.' : 'Make this look yours.'}</h1>
          <p>Every detail below appears on the storefront after you publish.</p>
        </div>
        <div className="admin-editor-head-note">
          <ShieldCheck size={19} />
          <span>Only approved admins can publish.</span>
        </div>
      </div>
      <form className="admin-editor" onSubmit={onPublish}>
        <div className="admin-editor-main">
          <section className="admin-card admin-form-card">
            <div className="admin-form-heading">
              <span>01</span>
              <div>
                <h2>Placement &amp; story</h2>
                <p>Choose the collection and the hanger this piece will occupy.</p>
              </div>
            </div>
            <div className="admin-form-grid">
              <label>
                Collection
                <select
                  value={form.audience}
                  disabled={mode === 'editor'}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      audience: event.target.value as ClothingAudience,
                      sizes: defaultSizes(event.target.value as ClothingAudience),
                    }))
                  }
                >
                  {audiences.map((audience) => (
                    <option key={audience}>{audience}</option>
                  ))}
                </select>
              </label>
              <label>
                Hanger position
                <select
                  value={form.slot}
                  disabled={mode === 'editor'}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, slot: Number(event.target.value) }))
                  }
                >
                  {[1, 2, 3, 4, 5].map((slot) => (
                    <option key={slot} value={slot}>
                      Hanger {slot}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-wide">
                Product name
                <input
                  maxLength={100}
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, name: event.target.value }))
                  }
                  placeholder="e.g. Emerald Heritage Kurta"
                />
              </label>
              <label>
                Garment type
                <input
                  maxLength={60}
                  required
                  value={form.garmentType}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, garmentType: event.target.value }))
                  }
                  placeholder="e.g. Kurta set"
                />
              </label>
              <label>
                Price (₹)
                <input
                  inputMode="decimal"
                  required
                  value={form.price}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                  placeholder="e.g. 2499.00"
                />
              </label>
              <label className="admin-wide">
                Description
                <textarea
                  maxLength={500}
                  rows={4}
                  required
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  placeholder="Fabric, fit and details customers will want to know."
                />
              </label>
            </div>
          </section>
          <section className="admin-card admin-form-card">
            <div className="admin-form-heading">
              <span>02</span>
              <div>
                <h2>Color &amp; sizes</h2>
                <p>Keep available counts accurate for every size you offer.</p>
              </div>
            </div>
            <div className="admin-form-grid">
              <label>
                Color name
                <input
                  maxLength={50}
                  required
                  value={form.colorName}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, colorName: event.target.value }))
                  }
                  placeholder="e.g. Forest green"
                />
              </label>
              <label>
                Color swatch
                <span className="admin-color-control">
                  <input
                    type="color"
                    value={form.colorHex}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, colorHex: event.target.value }))
                    }
                  />
                  <input
                    aria-label="Hex color"
                    value={form.colorHex}
                    maxLength={7}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, colorHex: event.target.value }))
                    }
                  />
                </span>
              </label>
            </div>
            <div className="admin-size-heading">
              <strong>Available sizes</strong>
              <span>Count visible to shoppers</span>
            </div>
            <div className="admin-size-list">
              {form.sizes.map((entry, index) => (
                <div key={index}>
                  <input
                    aria-label={`Size label ${index + 1}`}
                    maxLength={24}
                    value={entry.size}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sizes: current.sizes.map((size, i) =>
                          i === index ? { ...size, size: event.target.value } : size,
                        ),
                      }))
                    }
                  />
                  <input
                    aria-label={`Stock count for size ${entry.size || index + 1}`}
                    type="number"
                    min="0"
                    max="100000"
                    value={entry.count}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        sizes: current.sizes.map((size, i) =>
                          i === index ? { ...size, count: Number(event.target.value) } : size,
                        ),
                      }))
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove size ${entry.size}`}
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        sizes: current.sizes.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="admin-add-size"
              disabled={form.sizes.length >= 12}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  sizes: [...current.sizes, { size: '', count: 0 }],
                }))
              }
            >
              <Plus size={16} /> Add size
            </button>
          </section>
          <section className="admin-card admin-form-card">
            <div className="admin-form-heading">
              <span>03</span>
              <div>
                <h2>Garment photography</h2>
                <p>
                  The front image hangs on the rack. Side views appear only when you provide them.
                </p>
              </div>
            </div>
            <div className="admin-image-grid">
              {(['front', 'left', 'right'] as const).map((kind) => {
                const src = assets[kind]?.preview ?? garmentUrl(form.paths[kind]);
                return (
                  <div className="admin-image-field" key={kind}>
                    <div className="admin-image-preview">
                      {src ? (
                        <img src={src} alt={`${kind} preview of garment`} />
                      ) : (
                        <ImageIcon size={30} />
                      )}
                    </div>
                    <div>
                      <strong>
                        {kind === 'front'
                          ? 'Front / rack'
                          : `${kind[0].toUpperCase()}${kind.slice(1)} view`}
                      </strong>
                      <small>
                        {kind === 'front' ? 'Required · transparent' : 'Optional · separate image'}
                      </small>
                    </div>
                    <label className="admin-upload">
                      {src ? 'Replace image' : 'Choose image'}
                      <input
                        type="file"
                        accept={
                          kind === 'front'
                            ? 'image/png,image/webp'
                            : 'image/png,image/webp,image/jpeg'
                        }
                        onChange={(event) => {
                          void onImage(kind, event.target.files?.[0]);
                          event.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                );
              })}
            </div>
            <p className="admin-image-note">
              <ImageIcon size={16} /> PNG or WebP cutout for the front. The studio converts it to
              full-size and rack WebP files without cropping.
            </p>
          </section>
        </div>
        <aside className="admin-editor-aside">
          <div className="admin-card admin-preview-card">
            <p className="admin-kicker">LIVE PREVIEW</p>
            <div className="admin-preview-image">
              {assets.front?.preview || garmentUrl(form.paths.front) ? (
                <img
                  src={assets.front?.preview || garmentUrl(form.paths.front)}
                  alt="Current product front preview"
                />
              ) : (
                <ImageIcon size={39} />
              )}
            </div>
            <div className="admin-preview-detail">
              <span>
                {form.audience} / HANGER 0{form.slot}
              </span>
              <h3>{form.name || 'Your new piece'}</h3>
              <p>{form.garmentType || 'Garment type'}</p>
              <strong>
                {form.price && Number(form.price) > 0
                  ? money(Math.round(Number(form.price) * 100))
                  : 'Set your price'}
              </strong>
            </div>
          </div>
          <div className="admin-card admin-publish-card">
            <p className="admin-kicker">READY WHEN YOU ARE</p>
            <h3>Publish to the shop</h3>
            <p>
              {mode === 'add'
                ? 'Publishing replaces the current piece in this hanger slot.'
                : 'Your updates appear in this hanger slot after publishing.'}
            </p>
            <button type="submit" className="admin-primary" disabled={preview || busy}>
              <Save size={17} />
              {busy ? 'Publishing…' : 'Publish product'}
            </button>
            {preview && <small>Sign in to enable publishing.</small>}
          </div>
        </aside>
      </form>
    </>
  );
}
