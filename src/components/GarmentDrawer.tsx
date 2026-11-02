import { useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { garmentAngles, type DiwaliCollectionItem, type GarmentAngle } from '../diwali';
import Dialog from './Dialog';
import GarmentOptions from './GarmentOptions';

interface Props {
  item: DiwaliCollectionItem; size: string;
  onSize: (size: string) => void; onItem: (item: DiwaliCollectionItem) => void;
  onClose: () => void;
}
function GarmentGallery({ item }: { item: DiwaliCollectionItem }) {
  const views = garmentAngles.filter(view => !!item.images[view]);
  const [angle, setAngle] = useState<GarmentAngle>('front');
  const [loaded, setLoaded] = useState('');
  const [failed, setFailed] = useState('');
  const source = item.images[angle] ?? item.images.front;
  const step = (direction: number) => setAngle(views[(views.indexOf(angle) + direction + views.length) % views.length]);
  return <div className="garment-gallery" onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }}>
    <div className="gallery-topline"><span>THE DETAILS, UP CLOSE</span><span>{angle} view</span></div>
    <button className="gallery-image-button" onClick={() => step(1)} disabled={views.length === 1} aria-label={views.length > 1 ? `Change view of ${item.name}; currently ${angle}` : `Front view of ${item.name}`} aria-busy={loaded !== source && failed !== source}>
      {loaded !== source && failed !== source && <span className="image-loading">Loading view…</span>}
      {failed === source ? <span className="image-loading">View unavailable. Choose another angle.</span> :
        <img key={source} src={source} alt={`${item.name}, complete ${angle} view`}
          onLoad={() => setLoaded(source)} onError={() => setFailed(source)}
          className={loaded === source ? 'view-loaded' : ''}/>}
    </button>
    {views.length > 1 && <div className="angle-controls">
      <button onClick={() => step(-1)} aria-label="Previous garment angle"><ArrowLeft size={18}/></button>
      <div role="group" aria-label="Garment view">{views.map(view =>
        <button key={view} onClick={() => setAngle(view)} aria-pressed={angle === view}>{view}</button>
      )}</div>
      <button onClick={() => step(1)} aria-label="Next garment angle"><ArrowRight size={18}/></button>
    </div>}
    <p className="gallery-hint">{views.length > 1 ? 'Tap the garment or use the arrows to explore each angle.' : 'Front view. Add side views in the admin for a closer look.'}</p>
    <p className="sr-only" aria-live="polite">{angle} view of {item.name}</p>
  </div>;
}
export default function GarmentDrawer({ item, size, onSize, onItem, onClose }: Props) {
  return <Dialog titleId="garment-title" onClose={onClose} className="garment-drawer">
    <header className="garment-drawer-header"><span>YOUR CLOSER LOOK</span><button autoFocus onClick={onClose} aria-label="Close garment details"><X size={22}/></button></header>
    <GarmentGallery key={item.id} item={item}/>
    <div className="garment-drawer-details">
      <p className="eyebrow">{item.audience} / {item.type}</p>
      <h2 id="garment-title">{item.name}</h2>
      {item.priceMinor !== undefined && <p className="catalog-price">₹{(item.priceMinor / 100).toLocaleString('en-IN')}</p>}
      <p className="garment-description">{item.description}</p>
      <GarmentOptions item={item} size={size} onSize={onSize} onItem={onItem}/>
      <div className="selection-summary" aria-live="polite"><span>Your selection</span><strong>{item.colorName} · {size || 'Choose a size'}</strong></div>
      {item.isDemo && <p className="sample-note">Demo collection · AI-generated front and side views. Sizes and stock counts are illustrative.</p>}
    </div>
  </Dialog>;
}
