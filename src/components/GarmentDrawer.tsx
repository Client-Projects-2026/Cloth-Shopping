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
  const [angle, setAngle] = useState<GarmentAngle>('front');
  const [loaded, setLoaded] = useState('');
  const [failed, setFailed] = useState('');
  const source = item.images[angle];
  const step = (direction: number) => setAngle(garmentAngles[(garmentAngles.indexOf(angle) + direction + 3) % 3]);
  return <div className="garment-gallery" onKeyDown={event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); step(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }}>
    <div className="gallery-topline"><span>THE DETAILS, UP CLOSE</span><span>{angle} view</span></div>
    <button className="gallery-image-button" onClick={() => step(1)} aria-label={`Change view of ${item.name}; currently ${angle}`} aria-busy={loaded !== source && failed !== source}>
      {loaded !== source && failed !== source && <span className="image-loading">Loading view…</span>}
      {failed === source ? <span className="image-loading">View unavailable. Choose another angle.</span> :
        <img key={source} src={source} alt={`${item.name}, complete ${angle} view`}
          onLoad={() => setLoaded(source)} onError={() => setFailed(source)}
          className={loaded === source ? 'view-loaded' : ''}/>}
    </button>
    <div className="angle-controls">
      <button onClick={() => step(-1)} aria-label="Previous garment angle"><ArrowLeft size={18}/></button>
      <div role="group" aria-label="Garment view">{garmentAngles.map(view =>
        <button key={view} onClick={() => setAngle(view)} aria-pressed={angle === view}>{view}</button>
      )}</div>
      <button onClick={() => step(1)} aria-label="Next garment angle"><ArrowRight size={18}/></button>
    </div>
    <p className="gallery-hint">Tap the garment or use the arrows to explore each angle.</p>
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
      <p className="garment-description">{item.description}</p>
      <GarmentOptions item={item} size={size} onSize={onSize} onItem={onItem}/>
      <div className="selection-summary" aria-live="polite"><span>Your selection</span><strong>{item.colorName} · {size || 'Choose a size'}</strong></div>
      <p className="sample-note">Demo collection · AI-generated front and side views. Sizes and stock counts are illustrative.</p>
    </div>
  </Dialog>;
}

