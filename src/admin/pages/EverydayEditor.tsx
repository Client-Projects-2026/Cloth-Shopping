import type { Dispatch, FormEvent, SetStateAction } from 'react';
import { ArrowLeft, Image as ImageIcon, Plus, Save } from 'lucide-react';
import { garmentUrl } from '../../lib/supabase';
import { money } from '../model';
import type { EverydayForm } from '../everydayModel';
import type { PreparedImage } from '../images';

interface Props {
  form: EverydayForm;
  setForm: Dispatch<SetStateAction<EverydayForm | null>>;
  image?: PreparedImage;
  preview: boolean;
  busy: boolean;
  onBack: () => void;
  onImage: (file?: File) => Promise<void>;
  onPublish: (event: FormEvent<HTMLFormElement>) => void;
}

export default function EverydayEditor({
  form,
  setForm,
  image,
  preview,
  busy,
  onBack,
  onImage,
  onPublish,
}: Props) {
  const update = (change: Partial<EverydayForm>) =>
    setForm((current) => (current ? { ...current, ...change } : current));
  const source = image?.preview ?? garmentUrl(form.imagePath);
  return (
    <>
      <div className="admin-page-head admin-editor-head">
        <div>
          <button className="admin-inline-back" onClick={onBack}>
            <ArrowLeft size={16} /> Back to everyday collection
          </button>
          <p className="admin-kicker">
            {form.id ? 'EDIT COLLECTION PIECE' : 'NEW COLLECTION PIECE'}
          </p>
          <h1>{form.id ? 'Refine this piece.' : 'Add a real-life piece.'}</h1>
          <p>Use one complete product photo. The shop will show its price and available sizes.</p>
        </div>
      </div>
      <form className="admin-editor" onSubmit={onPublish}>
        <div className="admin-editor-main">
          <section className="admin-card admin-form-card">
            <div className="admin-form-heading">
              <span>01</span>
              <div>
                <h2>Product details</h2>
                <p>Customers use these details to find the right piece.</p>
              </div>
            </div>
            <div className="admin-form-grid">
              <label className="admin-wide">
                Product name
                <input
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(event) => update({ name: event.target.value })}
                  placeholder="e.g. Everyday Linen Shirt"
                />
              </label>
              <label>
                Category
                <input
                  required
                  maxLength={40}
                  value={form.category}
                  onChange={(event) => update({ category: event.target.value })}
                  placeholder="e.g. Shirts"
                  list="everyday-categories"
                />
                <datalist id="everyday-categories">
                  <option value="Dresses" />
                  <option value="Tops" />
                  <option value="Shirts" />
                  <option value="Bottoms" />
                  <option value="Layers" />
                </datalist>
              </label>
              <label>
                Display order
                <input
                  type="number"
                  min="1"
                  max="999"
                  required
                  value={form.position}
                  onChange={(event) => update({ position: Number(event.target.value) })}
                />
              </label>
              <label>
                Price (₹)
                <input
                  required
                  inputMode="decimal"
                  value={form.price}
                  onChange={(event) => update({ price: event.target.value })}
                  placeholder="e.g. 2499.00"
                />
              </label>
              <label>
                Card label <small>(optional)</small>
                <input
                  maxLength={32}
                  value={form.tag}
                  onChange={(event) => update({ tag: event.target.value })}
                  placeholder="e.g. New arrival"
                />
              </label>
              <label className="admin-wide">
                Description
                <textarea
                  required
                  maxLength={500}
                  rows={4}
                  value={form.description}
                  onChange={(event) => update({ description: event.target.value })}
                  placeholder="Fabric, fit, and details customers want to know."
                />
              </label>
            </div>
          </section>
          <section className="admin-card admin-form-card">
            <div className="admin-form-heading">
              <span>02</span>
              <div>
                <h2>Color &amp; stock</h2>
                <p>Size counts appear in the product detail view.</p>
              </div>
            </div>
            <div className="admin-form-grid">
              <label>
                Color name
                <input
                  required
                  maxLength={50}
                  value={form.colorName}
                  onChange={(event) => update({ colorName: event.target.value })}
                  placeholder="e.g. Oat"
                />
              </label>
              <label>
                Color swatch
                <span className="admin-color-control">
                  <input
                    type="color"
                    value={form.colorHex}
                    onChange={(event) => update({ colorHex: event.target.value })}
                  />
                  <input
                    aria-label="Hex color"
                    maxLength={7}
                    value={form.colorHex}
                    onChange={(event) => update({ colorHex: event.target.value })}
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
                      update({
                        sizes: form.sizes.map((size, i) =>
                          i === index ? { ...size, size: event.target.value } : size,
                        ),
                      })
                    }
                  />
                  <input
                    aria-label={`Stock count for size ${entry.size || index + 1}`}
                    type="number"
                    min="0"
                    max="100000"
                    value={entry.count}
                    onChange={(event) =>
                      update({
                        sizes: form.sizes.map((size, i) =>
                          i === index ? { ...size, count: Number(event.target.value) } : size,
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    aria-label={`Remove size ${entry.size}`}
                    onClick={() => update({ sizes: form.sizes.filter((_, i) => i !== index) })}
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
              onClick={() => update({ sizes: [...form.sizes, { size: '', count: 0 }] })}
            >
              <Plus size={16} /> Add size
            </button>
          </section>
          <section className="admin-card admin-form-card">
            <div className="admin-form-heading">
              <span>03</span>
              <div>
                <h2>Product photo</h2>
                <p>Upload one complete image. PNG, WebP, and JPEG are accepted.</p>
              </div>
            </div>
            <div className="everyday-upload-preview">
              {source ? (
                <img src={source} alt="Current product preview" />
              ) : (
                <ImageIcon size={42} />
              )}
            </div>
            <label className="admin-upload everyday-upload-button">
              {source ? 'Replace photo' : 'Choose product photo'}
              <input
                type="file"
                accept="image/png,image/webp,image/jpeg"
                onChange={(event) => {
                  void onImage(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />
            </label>
            <p className="admin-image-note">
              Use a clear, owned product photo at least 400 × 400 pixels. The complete image is
              fitted into a WebP canvas without cropping.
            </p>
          </section>
        </div>
        <aside className="admin-editor-aside">
          <div className="admin-card admin-preview-card">
            <p className="admin-kicker">SHOP PREVIEW</p>
            <div className="admin-preview-image">
              {source ? <img src={source} alt="Product card preview" /> : <ImageIcon size={39} />}
            </div>
            <div className="admin-preview-detail">
              <span>{form.category || 'CATEGORY'}</span>
              <h3>{form.name || 'Your new piece'}</h3>
              <p>{form.colorName || 'Color'}</p>
              <strong>
                {form.price && Number(form.price) > 0
                  ? money(Math.round(Number(form.price) * 100))
                  : 'Set your price'}
              </strong>
            </div>
          </div>
          <div className="admin-card admin-publish-card">
            <p className="admin-kicker">READY WHEN YOU ARE</p>
            <h3>Publish to the collection</h3>
            <p>The shop will show this photo, price, and size counts after publishing.</p>
            <button type="submit" className="admin-primary" disabled={preview || busy}>
              <Save size={17} />
              {busy ? 'Publishing…' : 'Publish piece'}
            </button>
            {preview && <small>Sign in to enable publishing.</small>}
          </div>
        </aside>
      </form>
    </>
  );
}
