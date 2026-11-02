import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { diwaliCollections, type ClothingAudience, type DiwaliCollectionItem } from './diwali';
import { garmentUrl, supabase } from './lib/supabase';

export interface CatalogRow {
  id: string;
  audience: ClothingAudience;
  slot: number;
  status: 'published' | 'hidden';
  name: string;
  garment_type: string;
  description: string;
  color_hex: string;
  color_name: string;
  price_minor: number;
  size_stock: { size: string; count: number }[];
  front_path: string;
  left_path: string | null;
  right_path: string | null;
  rack_path: string;
}

// The public RPC sends only audience, slot and status for hidden products.
export type PublicCatalogRow = Pick<CatalogRow, 'audience' | 'slot' | 'status'> &
  Partial<Omit<CatalogRow, 'audience' | 'slot' | 'status'>>;

const audiences: ClothingAudience[] = ['Men', 'Women', 'Girls', 'Boys'];
const isAudience = (value: unknown): value is ClothingAudience =>
  audiences.includes(value as ClothingAudience);
const validSizes = (value: unknown): value is CatalogRow['size_stock'] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.length <= 12 &&
  value.every(
    (entry) =>
      typeof entry?.size === 'string' &&
      entry.size.length <= 24 &&
      Number.isInteger(entry.count) &&
      entry.count >= 0,
  );

export function mergeCatalog(rows: PublicCatalogRow[]): DiwaliCollectionItem[] {
  const bySlot = new Map(diwaliCollections.map((item) => [`${item.audience}:${item.slot}`, item]));
  for (const row of rows) {
    if (!isAudience(row.audience) || !Number.isInteger(row.slot) || row.slot < 1 || row.slot > 5)
      continue;
    const key = `${row.audience}:${row.slot}`;
    if (row.status === 'hidden') {
      bySlot.delete(key);
      continue;
    }
    if (
      row.status !== 'published' ||
      !row.id ||
      !row.name ||
      !row.garment_type ||
      !row.description ||
      !row.color_hex ||
      !row.color_name ||
      !validSizes(row.size_stock) ||
      !row.front_path ||
      !row.rack_path
    ) {
      bySlot.delete(key);
      continue;
    }
    const front = garmentUrl(row.front_path);
    const thumbnail = garmentUrl(row.rack_path);
    if (!front || !thumbnail) {
      bySlot.delete(key);
      continue;
    }
    const left = row.left_path ? garmentUrl(row.left_path) : undefined;
    const right = row.right_path ? garmentUrl(row.right_path) : undefined;
    bySlot.set(key, {
      id: row.id,
      audience: row.audience,
      slot: row.slot,
      name: row.name,
      type: row.garment_type,
      description: row.description,
      color: row.color_hex,
      colorName: row.color_name,
      priceMinor: Number.isSafeInteger(row.price_minor) ? row.price_minor : undefined,
      availableSizes: row.size_stock,
      thumbnail,
      images: { front, ...(left ? { left } : {}), ...(right ? { right } : {}) },
      isDemo: false,
    });
  }
  return audiences.flatMap((audience) =>
    Array.from({ length: 5 }, (_, index) => bySlot.get(`${audience}:${index + 1}`)).filter(
      (item): item is DiwaliCollectionItem => !!item,
    ),
  );
}

interface CatalogState {
  items: DiwaliCollectionItem[];
  loading: boolean;
  error: boolean;
}
const CatalogContext = createContext<CatalogState>({
  items: diwaliCollections,
  loading: false,
  error: false,
});

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<PublicCatalogRow[]>([]);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    supabase.rpc('get_public_catalog').then(({ data, error: requestError }) => {
      if (!active) return;
      if (requestError || !Array.isArray(data)) setError(true);
      else setRows(data as PublicCatalogRow[]);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);
  const items = useMemo(
    () => (supabase && (loading || error) ? [] : mergeCatalog(rows)),
    [rows, loading, error],
  );
  return (
    <CatalogContext.Provider value={{ items, loading, error }}>{children}</CatalogContext.Provider>
  );
}

export const useCatalog = () => useContext(CatalogContext);
export function useCollectionFor() {
  const { items } = useCatalog();
  return (audience: ClothingAudience) => items.filter((item) => item.audience === audience);
}
