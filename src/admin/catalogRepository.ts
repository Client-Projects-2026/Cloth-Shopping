import type { CatalogRow } from '../catalog';
import type { ClothingAudience } from '../diwali';
import { GARMENT_BUCKET, supabase } from '../lib/supabase';
import type { PreparedImage } from './images';
import { seedFor, type FormImage, type ProductForm } from './model';

function client() {
  if (!supabase) throw new Error('Connect Supabase before managing live products.');
  return supabase;
}

export async function loadInventory(): Promise<CatalogRow[]> {
  const { data, error } = await client()
    .from('catalog_items')
    .select('*')
    .order('audience')
    .order('slot');
  if (error) throw new Error(`Could not load inventory: ${error.message}`);
  return (data ?? []) as CatalogRow[];
}

export async function uploadImage(userId: string, blob: Blob): Promise<string> {
  if (!userId) throw new Error('Your admin session has expired. Sign in again.');
  const path = `${userId}/${crypto.randomUUID()}.webp`;
  const { error } = await client().storage.from(GARMENT_BUCKET).upload(path, blob, {
    contentType: 'image/webp',
    upsert: false,
    cacheControl: '3600',
  });
  if (error) throw new Error(`Image upload failed: ${error.message}`);
  return path;
}

export async function saveProduct(
  form: ProductForm,
  assets: Partial<Record<FormImage, PreparedImage>>,
  current: CatalogRow | undefined,
  userId: string,
): Promise<CatalogRow> {
  const paths = { ...form.paths };
  if (assets.front) {
    paths.front = await uploadImage(userId, assets.front.blob);
    paths.rack = await uploadImage(userId, assets.front.thumbnail!);
  }
  if (assets.left) paths.left = await uploadImage(userId, assets.left.blob);
  if (assets.right) paths.right = await uploadImage(userId, assets.right.blob);

  const payload = {
    audience: form.audience,
    slot: form.slot,
    status: 'published',
    name: form.name.trim(),
    garment_type: form.garmentType.trim(),
    description: form.description.trim(),
    color_hex: form.colorHex,
    color_name: form.colorName.trim(),
    price_minor: Math.round(Number(form.price) * 100),
    size_stock: form.sizes.map((entry) => ({ size: entry.size.trim(), count: entry.count })),
    front_path: paths.front,
    left_path: paths.left || null,
    right_path: paths.right || null,
    rack_path: paths.rack,
    updated_at: new Date().toISOString(),
  };
  const query = current?.id
    ? client().from('catalog_items').update(payload).eq('id', current.id)
    : client().from('catalog_items').insert(payload);
  const { data, error } = await query.select('*').single();
  if (error || !data) throw new Error(error?.message ?? 'The product could not be saved.');
  return data as CatalogRow;
}

export async function hideProduct(
  audience: ClothingAudience,
  slot: number,
  current?: CatalogRow,
): Promise<CatalogRow> {
  if (current?.id) {
    const { data, error } = await client()
      .from('catalog_items')
      .update({ status: 'hidden', updated_at: new Date().toISOString() })
      .eq('id', current.id)
      .select('*')
      .single();
    if (error || !data) throw new Error(error?.message ?? 'Could not hide this hanger.');
    return data as CatalogRow;
  }

  const seed = seedFor(audience, slot);
  const { data, error } = await client()
    .from('catalog_items')
    .insert({
      audience,
      slot,
      status: 'hidden',
      name: seed.name,
      garment_type: seed.type,
      description: seed.description,
      color_hex: seed.color,
      color_name: seed.colorName,
      price_minor: 0,
      size_stock: seed.availableSizes,
      front_path: seed.images.front,
      left_path: seed.images.left,
      right_path: seed.images.right,
      rack_path: seed.thumbnail,
    })
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'Could not hide this hanger.');
  return data as CatalogRow;
}
