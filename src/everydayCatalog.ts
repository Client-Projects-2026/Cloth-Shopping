import { useEffect, useMemo, useState } from 'react';
import { garmentUrl, supabase } from './lib/supabase';
import { products as demoProducts, type Product } from './products';

export interface EverydayRow {
  id: string;
  status: 'published' | 'hidden';
  position: number;
  name: string;
  category: string;
  description: string;
  color_hex: string;
  color_name: string;
  tag: string;
  price_minor: number;
  size_stock: { size: string; count: number }[];
  image_path: string;
}

export type PublicEverydayRow = Pick<EverydayRow, 'status'> & Partial<Omit<EverydayRow, 'status'>>;

function validSizes(value: unknown): value is EverydayRow['size_stock'] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= 12 &&
    value.every(
      (entry) =>
        typeof entry?.size === 'string' &&
        entry.size.trim().length > 0 &&
        entry.size.length <= 24 &&
        Number.isInteger(entry.count) &&
        entry.count >= 0,
    )
  );
}

function shapeFor(category: string): Product['shape'] {
  const label = category.toLowerCase();
  if (label.includes('dress')) return 'dress';
  if (label.includes('shirt')) return 'shirt';
  if (label.includes('bottom') || label.includes('trouser') || label.includes('pant'))
    return 'pants';
  if (label.includes('layer') || label.includes('jacket')) return 'jacket';
  if (label.includes('skirt')) return 'skirt';
  return 'top';
}

export function resolveEverydayProducts(rows: PublicEverydayRow[]): Product[] {
  if (!rows.length) return demoProducts;
  return rows
    .filter((row) => row.status === 'published')
    .flatMap((row) => {
      if (
        !row.id ||
        !row.name ||
        !row.category ||
        !row.description ||
        !row.color_name ||
        !/^#[0-9a-fA-F]{6}$/.test(row.color_hex ?? '') ||
        !row.image_path ||
        !Number.isSafeInteger(row.price_minor) ||
        (row.price_minor ?? 0) <= 0 ||
        !Number.isInteger(row.position) ||
        !validSizes(row.size_stock)
      )
        return [];
      const image = garmentUrl(row.image_path);
      if (!image) return [];
      return [
        {
          id: row.id,
          name: row.name,
          category: row.category,
          description: row.description,
          color: row.color_hex!,
          colorName: row.color_name,
          tag: row.tag ?? '',
          shape: shapeFor(row.category),
          image,
          priceMinor: row.price_minor!,
          sizes: row.size_stock,
          position: row.position!,
        },
      ];
    })
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
}

export function useEverydayProducts() {
  const [rows, setRows] = useState<PublicEverydayRow[]>([]);
  const [loading, setLoading] = useState(!!supabase);
  const [error, setError] = useState(false);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let active = true;
    async function load(connection: NonNullable<typeof supabase>) {
      try {
        const { data, error: requestError } = await connection.rpc(
          'get_public_everyday_collection',
        );
        if (!active) return;
        if (requestError || !Array.isArray(data)) setError(true);
        else setRows(data as PublicEverydayRow[]);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }
    void load(client);
    return () => {
      active = false;
    };
  }, []);
  const items = useMemo(
    () => (loading || error ? [] : resolveEverydayProducts(rows)),
    [rows, loading, error],
  );
  return { items, loading, error, isDemo: rows.length === 0 && !loading && !error };
}
