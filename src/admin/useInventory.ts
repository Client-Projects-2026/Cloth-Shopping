import { useEffect, useMemo, useState } from 'react';
import type { CatalogRow } from '../catalog';
import type { ClothingAudience } from '../diwali';
import { hideProduct, loadInventory, saveProduct } from './catalogRepository';
import type { PreparedImage } from './images';
import { buildSlots, validateProduct, type FormImage, type ProductForm } from './model';

export function useInventory(enabled: boolean, userId: string) {
  const [rows, setRows] = useState<CatalogRow[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const slots = useMemo(() => buildSlots(enabled ? rows : []), [enabled, rows]);

  useEffect(() => {
    if (!enabled) {
      setRows([]);
      setLoading(false);
      setLoadFailed(false);
      setError('');
      setNotice('');
      return;
    }
    let active = true;
    setLoading(true);
    setLoadFailed(false);
    setError('');
    loadInventory()
      .then((data) => {
        if (active) setRows(data);
      })
      .catch((reason) => {
        if (active) {
          setLoadFailed(true);
          setError(message(reason));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled, reloadToken]);

  function replace(row: CatalogRow) {
    setRows((current) => [
      ...current.filter((item) => !(item.audience === row.audience && item.slot === row.slot)),
      row,
    ]);
  }

  async function publish(
    form: ProductForm,
    assets: Partial<Record<FormImage, PreparedImage>>,
  ): Promise<boolean> {
    if (!enabled || loading || loadFailed || busy) return false;
    const validation = validateProduct(form, assets);
    if (validation) {
      setError(validation);
      return false;
    }
    setBusy(true);
    clearMessages();
    try {
      const current = rows.find((row) => row.audience === form.audience && row.slot === form.slot);
      replace(await saveProduct(form, assets, current, userId));
      setNotice(
        `${form.name.trim()} is now on the ${form.audience.toLowerCase()} rack in hanger ${form.slot}.`,
      );
      return true;
    } catch (reason) {
      setError(message(reason));
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function hide(audience: ClothingAudience, slot: number): Promise<void> {
    if (!enabled || loading || loadFailed || busy) return;
    setBusy(true);
    clearMessages();
    try {
      const current = rows.find((row) => row.audience === audience && row.slot === slot);
      replace(await hideProduct(audience, slot, current));
      setNotice(`${audience} hanger ${slot} is now hidden from the storefront.`);
    } catch (reason) {
      setError(message(reason));
    } finally {
      setBusy(false);
    }
  }

  function clearMessages() {
    setError('');
    setNotice('');
  }
  return {
    rows: enabled ? rows : [],
    slots,
    loading,
    loadFailed,
    busy,
    error,
    notice,
    publish,
    hide,
    clearMessages,
    setError,
    setNotice,
    reload: () => setReloadToken((value) => value + 1),
  };
}

function message(reason: unknown): string {
  return reason instanceof Error ? reason.message : 'An unexpected inventory error occurred.';
}
