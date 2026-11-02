import { EyeOff, Plus, Search } from 'lucide-react';
import type { ClothingAudience } from '../../diwali';
import { audiences, money, type AdminSlot } from '../model';

interface Props {
  slots: AdminSlot[];
  filter: 'All' | ClothingAudience;
  onFilter: (value: 'All' | ClothingAudience) => void;
  search: string;
  onSearch: (value: string) => void;
  preview: boolean;
  busy: boolean;
  onAdd: () => void;
  onEdit: (audience: ClothingAudience, slot: number) => void;
  onHide: (audience: ClothingAudience, slot: number) => Promise<void>;
}

export default function InventoryPage({
  slots,
  filter,
  onFilter,
  search,
  onSearch,
  preview,
  busy,
  onAdd,
  onEdit,
  onHide,
}: Props) {
  const query = search.trim().toLocaleLowerCase();
  const visibleSlots = slots.filter((item) => {
    if (filter !== 'All' && item.audience !== filter) return false;
    const searchable = `${item.row?.name ?? item.seed.name} ${item.audience} ${item.row?.garment_type ?? item.seed.type}`;
    return searchable.toLocaleLowerCase().includes(query);
  });
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">THE COLLECTION</p>
          <h1>Rack inventory.</h1>
          <p>Edit a piece, replace its imagery, or hide a hanger from the shop.</p>
        </div>
        <button className="admin-primary" onClick={onAdd}>
          <Plus size={18} /> Add a product
        </button>
      </div>
      <div className="admin-inventory-tools">
        <div className="admin-filter-tabs" role="group" aria-label="Filter collection">
          {(['All', ...audiences] as const).map((value) => (
            <button key={value} aria-pressed={filter === value} onClick={() => onFilter(value)}>
              {value}
            </button>
          ))}
        </div>
        <label className="admin-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search pieces"
            aria-label="Search pieces"
          />
        </label>
      </div>
      <div className="admin-inventory-list">
        <div className="admin-table-head">
          <span>PRODUCT</span>
          <span>COLLECTION</span>
          <span>HANGER</span>
          <span>STATUS</span>
          <span>ACTIONS</span>
        </div>
        {visibleSlots.map(({ audience, slot, row, seed, item }) => (
          <div className="admin-inventory-row" key={`${audience}-${slot}`}>
            <div className="admin-product-cell">
              <div className="admin-product-thumb">
                {row?.status !== 'hidden' && <img src={item?.thumbnail ?? seed.thumbnail} alt="" />}
              </div>
              <div>
                <strong>{row?.name ?? seed.name}</strong>
                <small>
                  {row?.garment_type ?? seed.type}
                  {row?.price_minor ? ` · ${money(row.price_minor)}` : ''}
                </small>
              </div>
            </div>
            <span>{audience}</span>
            <span>0{slot} / 05</span>
            <span>
              <i
                className={`admin-badge ${row?.status === 'hidden' ? 'hidden' : row ? 'live' : 'demo'}`}
              >
                {row?.status === 'hidden' ? 'Hidden' : row ? 'Live' : 'Demo'}
              </i>
            </span>
            <div className="admin-row-actions">
              <button
                onClick={() => onEdit(audience, slot)}
                aria-label={`Edit ${audience} hanger ${slot}`}
              >
                Edit
              </button>
              {row?.status !== 'hidden' && (
                <button
                  className="admin-hide"
                  disabled={preview || busy}
                  onClick={() => void onHide(audience, slot)}
                  aria-label={`Hide ${audience} hanger ${slot}`}
                  title="Hide from shop"
                >
                  <EyeOff size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
        {visibleSlots.length === 0 && (
          <div className="admin-empty">No pieces match your search.</div>
        )}
      </div>
    </>
  );
}
