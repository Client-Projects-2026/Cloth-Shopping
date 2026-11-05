import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { useEverydayProducts } from '../everydayCatalog';
import type { Product } from '../products';
import Garment from '../Garment';
import Dialog from './Dialog';

function ProductVisual({ product }: { product: Product }) {
  return product.image ? (
    <img className="real-product-image" src={product.image} alt={product.name} loading="lazy" />
  ) : (
    <Garment product={product} />
  );
}

export default function EverydayCollection() {
  const { items, loading, error, isDemo } = useEverydayProducts();
  const [filter, setFilter] = useState('All pieces');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [size, setSize] = useState('');
  const categories = ['All pieces', ...new Set(items.map((item) => item.category))];
  const activeFilter = categories.includes(filter) ? filter : 'All pieces';
  const visible =
    activeFilter === 'All pieces' ? items : items.filter((item) => item.category === activeFilter);
  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const selected = selectedIndex < 0 ? null : items[selectedIndex];

  function select(product: Product) {
    setSelectedId(product.id);
    setSize('');
  }
  function step(direction: number) {
    const next = items[(selectedIndex + direction + items.length) % items.length];
    if (next) select(next);
  }

  return (
    <section className="collection-section section-pad" id="collection">
      <div className="collection-top">
        <div>
          <p className="eyebrow">THE COLLECTION {isDemo && '— DEMO EDIT'}</p>
          <h2>
            Pieces for <em>real life.</em>
          </h2>
        </div>
        <a className="text-link" href="#rack">
          Back to the rack <ArrowUpRight size={15} />
        </a>
      </div>
      {!loading && !error && items.length > 0 && (
        <div className="filters" aria-label="Filter collection">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={activeFilter === category ? 'filter active-filter' : 'filter'}
              aria-pressed={activeFilter === category}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      {loading && (
        <p className="demo-notice" role="status">
          Loading the collection…
        </p>
      )}
      {error && (
        <p className="demo-notice" role="status">
          The collection is temporarily unavailable. Please try again later.
        </p>
      )}
      {!loading && !error && !items.length && (
        <p className="demo-notice">New pieces are coming soon.</p>
      )}
      <div className="product-grid">
        {visible.map((product, index) => (
          <button
            className="product-card"
            key={product.id}
            onClick={() => select(product)}
            aria-label={`View ${product.name}`}
          >
            <div className={`product-visual visual-${product.shape}`}>
              <span className="product-tag">{product.tag || product.category}</span>
              <ProductVisual product={product} />
              <span className="product-quick">
                Take a closer look <ArrowUpRight size={14} />
              </span>
            </div>
            <div className="product-meta">
              <div>
                <h3>{product.name}</h3>
                <p>
                  {product.category} ·{' '}
                  {isDemo
                    ? 'Demo piece'
                    : product.priceMinor !== undefined
                      ? `₹${(product.priceMinor / 100).toLocaleString('en-IN')}`
                      : 'Shop piece'}
                </p>
              </div>
              <span className="product-number">{String(index + 1).padStart(2, '0')}</span>
            </div>
          </button>
        ))}
      </div>
      {isDemo && (
        <p className="demo-notice">
          A collection concept. Product names, colors and descriptions are placeholders for
          demonstration.
        </p>
      )}
      {selected && (
        <Dialog
          titleId="drawer-title"
          onClose={() => setSelectedId(null)}
          className="everyday-drawer"
        >
          <button
            className="drawer-close"
            onClick={() => setSelectedId(null)}
            aria-label="Close product details"
          >
            <X />
          </button>
          <div className={`drawer-art visual-${selected.shape}`}>
            {isDemo && (
              <span className="drawer-demo-label">DEMO PIECE · DETAILS TO BE CONFIRMED</span>
            )}
            <ProductVisual product={selected} />
          </div>
          <div className="drawer-details">
            <p className="eyebrow">
              {selected.category.toUpperCase()} {isDemo && '— DEMO EDIT'}
            </p>
            <h2 id="drawer-title">{selected.name}</h2>
            <p>{selected.description}</p>
            <div className="detail-rule" />
            <p className="detail-color">
              <span className="color-swatch" style={{ backgroundColor: selected.color }} />
              {selected.colorName}
              {isDemo && <span className="detail-muted"> · illustrative color</span>}
            </p>
            {selected.priceMinor !== undefined && (
              <p className="everyday-price">
                ₹{(selected.priceMinor / 100).toLocaleString('en-IN')}
              </p>
            )}
            {selected.sizes && (
              <fieldset className="everyday-sizes">
                <legend>Available sizes</legend>
                <div>
                  {selected.sizes.map((option) => (
                    <button
                      type="button"
                      key={option.size}
                      disabled={option.count === 0}
                      aria-pressed={size === option.size}
                      onClick={() => setSize(option.size)}
                    >
                      {option.size}
                      <small>{option.count} available</small>
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {isDemo && (
              <p className="detail-note">
                Size, price and availability are not supplied. Contact the shop directly once real
                details have been added.
              </p>
            )}
            <div className="drawer-controls">
              <button onClick={() => step(-1)} aria-label="Previous garment">
                <ArrowLeft size={17} />
              </button>
              <span>
                {selectedIndex + 1} / {String(items.length).padStart(2, '0')}
              </span>
              <button onClick={() => step(1)} aria-label="Next garment">
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
}
