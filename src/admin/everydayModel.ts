import type { EverydayRow } from '../everydayCatalog';
import type { PreparedImage } from './images';

export interface EverydayForm {
  id?: string;
  name: string;
  category: string;
  description: string;
  colorHex: string;
  colorName: string;
  tag: string;
  price: string;
  position: number;
  sizes: { size: string; count: number }[];
  imagePath: string;
}

export function makeEverydayForm(row?: EverydayRow): EverydayForm {
  return {
    id: row?.id,
    name: row?.name ?? '',
    category: row?.category ?? '',
    description: row?.description ?? '',
    colorHex: row?.color_hex ?? '#425b4a',
    colorName: row?.color_name ?? '',
    tag: row?.tag ?? '',
    price: row ? String(row.price_minor / 100) : '',
    position: row?.position ?? 1,
    sizes: row?.size_stock.map((size) => ({ ...size })) ?? [
      { size: 'S', count: 0 },
      { size: 'M', count: 0 },
      { size: 'L', count: 0 },
      { size: 'XL', count: 0 },
    ],
    imagePath: row?.image_path ?? '',
  };
}

export function validateEverydayForm(form: EverydayForm, image?: PreparedImage): string | null {
  if (form.name.trim().length < 2 || form.name.trim().length > 100)
    return 'Enter a name between 2 and 100 characters.';
  if (form.category.trim().length < 2 || form.category.trim().length > 40)
    return 'Enter a category between 2 and 40 characters.';
  if (form.description.trim().length < 10 || form.description.trim().length > 500)
    return 'Write a description between 10 and 500 characters.';
  if (form.colorName.trim().length < 2 || form.colorName.trim().length > 50)
    return 'Enter a color name between 2 and 50 characters.';
  if (!/^#[0-9a-fA-F]{6}$/.test(form.colorHex)) return 'Choose a valid color swatch.';
  if (form.tag.trim().length > 32) return 'Keep the card label under 33 characters.';
  if (!Number.isInteger(form.position) || form.position < 1 || form.position > 999)
    return 'Choose a display position from 1 to 999.';
  if (
    !/^\d+(\.\d{1,2})?$/.test(form.price) ||
    Number(form.price) <= 0 ||
    Number(form.price) > 1000000
  )
    return 'Enter a price in rupees with up to two decimal places.';
  if (
    !form.sizes.length ||
    form.sizes.length > 12 ||
    form.sizes.some(
      ({ size, count }) =>
        !size.trim() || size.length > 24 || !Number.isInteger(count) || count < 0 || count > 100000,
    )
  )
    return 'Add 1–12 valid sizes and stock counts.';
  if (new Set(form.sizes.map(({ size }) => size.trim().toLowerCase())).size !== form.sizes.length)
    return 'Each size needs a unique label.';
  if (!image && !form.imagePath) return 'Add a product photo before publishing.';
  return null;
}
