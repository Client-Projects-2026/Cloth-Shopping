import { ArrowUpRight, ChevronRight, Image as ImageIcon, Plus } from 'lucide-react';
import type { ClothingAudience } from '../../diwali';
import { audiences, seedFor, type AdminSlot } from '../model';

interface Props {
  liveCount: number;
  sampleCount: number;
  hiddenCount: number;
  slots: AdminSlot[];
  onAdd: () => void;
  onInventory: () => void;
  onGuide: () => void;
  onCollection: (audience: ClothingAudience) => void;
}

export default function OverviewPage({
  liveCount,
  sampleCount,
  hiddenCount,
  slots,
  onAdd,
  onInventory,
  onGuide,
  onCollection,
}: Props) {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">GOOD TO SEE YOU</p>
          <h1>Your shop, at a glance.</h1>
          <p>Keep the latest looks in front of your customers, one hanger at a time.</p>
        </div>
        <button className="admin-primary" onClick={onAdd}>
          <Plus size={18} /> Add a product
        </button>
      </div>
      <div className="admin-stats">
        <div>
          <span>LIVE LOOKS</span>
          <strong>{liveCount.toString().padStart(2, '0')}</strong>
          <small>Published from the studio</small>
        </div>
        <div>
          <span>DEMO PIECES</span>
          <strong>{sampleCount.toString().padStart(2, '0')}</strong>
          <small>Ready to replace</small>
        </div>
        <div>
          <span>HIDDEN HANGERS</span>
          <strong>{hiddenCount.toString().padStart(2, '0')}</strong>
          <small>Not shown in the shop</small>
        </div>
        <div>
          <span>RACK CAPACITY</span>
          <strong>20</strong>
          <small>Five looks per collection</small>
        </div>
      </div>
      <div className="admin-overview-grid">
        <section className="admin-card">
          <div className="admin-card-heading">
            <div>
              <p className="admin-kicker">THE RACK</p>
              <h2>Collection health</h2>
            </div>
            <button onClick={() => onInventory()}>
              View inventory <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="admin-collection-list">
            {audiences.map((audience) => {
              const count = slots.filter(
                (slot) => slot.audience === audience && slot.row?.status === 'published',
              ).length;
              return (
                <div key={audience}>
                  <span>{audience}</span>
                  <div className="admin-progress">
                    <i style={{ width: `${count * 20}%` }} />
                  </div>
                  <strong>{count} / 5 live</strong>
                </div>
              );
            })}
          </div>
        </section>
        <section className="admin-card admin-guide-card">
          <span className="admin-guide-icon">
            <ImageIcon size={23} />
          </span>
          <p className="admin-kicker">A BETTER HANGER</p>
          <h2>Beautiful photos make the difference.</h2>
          <p>
            Start with a transparent front image. The studio makes a full WebP view and a lighter
            rack thumbnail automatically.
          </p>
          <button onClick={() => onGuide()}>
            Read the image guide <ArrowUpRight size={17} />
          </button>
        </section>
      </div>
      <section className="admin-card admin-recent">
        <div className="admin-card-heading">
          <div>
            <p className="admin-kicker">QUICK ACCESS</p>
            <h2>Choose a collection</h2>
          </div>
        </div>
        <div className="admin-quick-categories">
          {audiences.map((audience) => (
            <button
              key={audience}
              onClick={() => {
                onCollection(audience);
              }}
            >
              <img src={seedFor(audience, 1).thumbnail} alt="" />
              <span>
                {audience}
                <small>Five hanger slots</small>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
