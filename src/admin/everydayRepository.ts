import type { EverydayRow } from '../everydayCatalog';
import { supabase } from '../lib/supabase';
import { uploadImage } from './catalogRepository';
import type { EverydayForm } from './everydayModel';
import type { PreparedImage } from './images';

function client() {
  if (!supabase) throw new Error('Connect Supabase before managing the live collection.');
  return supabase;
}

export async function loadEverydayInventory(): Promise<EverydayRow[]> {
  const { data, error } = await client()
    .from('everyday_items')
    .select('*')
    .order('position')
    .order('name');
  if (error) throw new Error(`Could not load the everyday collection: ${error.message}`);
  return (data ?? []) as EverydayRow[];
}

export async function saveEverydayItem(
  form: EverydayForm,
  image: PreparedImage | undefined,
  userId: string,
): Promise<EverydayRow> {
  const imagePath = image ? await uploadImage(userId, image.blob) : form.imagePath;
  const payload = {
    status: 'published',
    position: form.position,
    name: form.name.trim(),
    category: form.category.trim(),
    description: form.description.trim(),
    color_hex: form.colorHex,
    color_name: form.colorName.trim(),
    tag: form.tag.trim(),
    price_minor: Math.round(Number(form.price) * 100),
    size_stock: form.sizes.map(({ size, count }) => ({ size: size.trim(), count })),
    image_path: imagePath,
    updated_at: new Date().toISOString(),
  };
  const query = form.id
    ? client().from('everyday_items').update(payload).eq('id', form.id)
    : client().from('everyday_items').insert(payload);
  const { data, error } = await query.select('*').single();
  if (error || !data) throw new Error(error?.message ?? 'The collection piece could not be saved.');
  return data as EverydayRow;
}

export async function hideEverydayItem(id: string): Promise<EverydayRow> {
  const { data, error } = await client()
    .from('everyday_items')
    .update({ status: 'hidden', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) throw new Error(error?.message ?? 'The piece could not be hidden.');
  return data as EverydayRow;
}
