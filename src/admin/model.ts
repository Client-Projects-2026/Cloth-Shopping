import { mergeCatalog, type CatalogRow } from '../catalog';
import {
  diwaliCollections,
  type ClothingAudience,
  type DiwaliCollectionItem,
  type GarmentAngle,
} from '../diwali';
import type { PreparedImage } from './images';

export type AdminPage = 'overview' | 'inventory' | 'add' | 'guide' | 'editor' | 'everyday';
export type FormImage = GarmentAngle;
export type ProductForm = {
  audience: ClothingAudience;
  slot: number;
  name: string;
  garmentType: string;
  description: string;
  colorHex: string;
  colorName: string;
  price: string;
  sizes: { size: string; count: number }[];
  paths: { front: string; left: string; right: string; rack: string };
};
export type AdminSlot = {
  audience: ClothingAudience;
  slot: number;
  row: CatalogRow | undefined;
  seed: DiwaliCollectionItem;
  item: DiwaliCollectionItem | undefined;
};

export const audiences: ClothingAudience[] = ['Men', 'Women', 'Girls', 'Boys'];

export function seedFor(audience: ClothingAudience, slot: number): DiwaliCollectionItem {
  const seed = diwaliCollections.find((item) => item.audience === audience && item.slot === slot);
  if (!seed) throw new Error(`Missing demo item for ${audience} hanger ${slot}`);
  return seed;
}

export function defaultSizes(audience: ClothingAudience) {
  const labels =
    audience === 'Men' || audience === 'Women'
      ? ['S', 'M', 'L', 'XL']
      : ['2–4 years', '5–7 years', '8–10 years'];
  return labels.map((size) => ({ size, count: 0 }));
}

export const money = (minor: number) => `₹${(minor / 100).toLocaleString('en-IN')}`;

export function makeForm(
  audience: ClothingAudience,
  slot: number,
  row?: CatalogRow,
  seed?: DiwaliCollectionItem,
): ProductForm {
  return {
    audience,
    slot,
    name: row?.name ?? seed?.name ?? '',
    garmentType: row?.garment_type ?? seed?.type ?? '',
    description: row?.description ?? seed?.description ?? '',
    colorHex: row?.color_hex ?? seed?.color ?? '#425b4a',
    colorName: row?.color_name ?? seed?.colorName ?? '',
    price: row?.price_minor ? String(row.price_minor / 100) : '',
    sizes:
      row?.size_stock?.map((entry) => ({ ...entry })) ??
      seed?.availableSizes.map((entry) => ({ ...entry })) ??
      defaultSizes(audience),
    paths: {
      front: row?.front_path ?? seed?.images.front ?? '',
      left: row?.left_path ?? seed?.images.left ?? '',
      right: row?.right_path ?? seed?.images.right ?? '',
      rack: row?.rack_path ?? seed?.thumbnail ?? '',
    },
  };
}

export function validateProduct(
  form: ProductForm,
  assets: Partial<Record<FormImage, PreparedImage>>,
): string | null {
  if (form.name.trim().length < 2 || form.name.trim().length > 100)
    return 'Enter a product name between 2 and 100 characters.';
  if (form.garmentType.trim().length < 2 || form.garmentType.trim().length > 60)
    return 'Enter a garment type between 2 and 60 characters.';
  if (form.description.trim().length < 10 || form.description.trim().length > 500)
    return 'Write a description between 10 and 500 characters.';
  if (form.colorName.trim().length < 2 || form.colorName.trim().length > 50)
    return 'Enter a color name between 2 and 50 characters.';
  if (!/^#[0-9a-fA-F]{6}$/.test(form.colorHex)) return 'Choose a valid color swatch.';
  const price = Number(form.price);
  if (
    !form.price.trim() ||
    !Number.isFinite(price) ||
    price <= 0 ||
    price > 1000000 ||
    !/^\d+(\.\d{1,2})?$/.test(form.price)
  )
    return 'Enter a price in rupees with up to two decimal places.';
  if (
    !form.sizes.length ||
    form.sizes.length > 12 ||
    form.sizes.some(
      (entry) =>
        !entry.size.trim() ||
        entry.size.length > 24 ||
        !Number.isInteger(entry.count) ||
        entry.count < 0 ||
        entry.count > 100000,
    )
  )
    return 'Add 1–12 valid sizes and non-negative stock counts.';
  if (
    new Set(form.sizes.map((entry) => entry.size.trim().toLowerCase())).size !== form.sizes.length
  )
    return 'Each size needs a unique label.';
  // Sample artwork must not be promoted to a live product without a shop photo.
  if (
    !assets.front &&
    (!form.paths.front || !form.paths.rack || form.paths.front.startsWith('/garments/'))
  )
    return 'Upload a transparent front image for the hanger.';
  return null;
}

export function buildSlots(rows: CatalogRow[]): AdminSlot[] {
  const merged = mergeCatalog(rows);
  const overrides = new Map(rows.map((row) => [`${row.audience}:${row.slot}`, row]));
  const visible = new Map(merged.map((item) => [`${item.audience}:${item.slot}`, item]));
  return audiences.flatMap((audience) =>
    Array.from({ length: 5 }, (_, index) => {
      const slot = index + 1;
      const key = `${audience}:${slot}`;
      return {
        audience,
        slot,
        row: overrides.get(key),
        seed: seedFor(audience, slot),
        item: visible.get(key),
      };
    }),
  );
}
