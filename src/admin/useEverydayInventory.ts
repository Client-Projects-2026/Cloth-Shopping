import { useEffect, useState } from 'react';
import type { EverydayRow } from '../everydayCatalog';
import { hideEverydayItem, loadEverydayInventory, saveEverydayItem } from './everydayRepository';
import { validateEverydayForm, type EverydayForm } from './everydayModel';
import type { PreparedImage } from './images';

export function useEverydayInventory(enabled: boolean, userId: string) {
  const [rows, setRows] = useState<EverydayRow[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

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
    loadEverydayInventory()
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
  }, [enabled, userId, reloadToken]);

  function clearMessages() {
    setError('');
    setNotice('');
  }
  async function publish(form: EverydayForm, image?: PreparedImage): Promise<boolean> {
    if (!enabled || loading || loadFailed || busy) return false;
    const validation = validateEverydayForm(form, image);
    if (validation) {
      setError(validation);
      return false;
    }
    setBusy(true);
    clearMessages();
    try {
      const row = await saveEverydayItem(form, image, userId);
      setRows((current) =>
        [...current.filter((item) => item.id !== row.id), row].sort(
          (a, b) => a.position - b.position || a.name.localeCompare(b.name),
        ),
      );
      setNotice(`${row.name} is published in Pieces for real life.`);
      return true;
    } catch (reason) {
      setError(message(reason));
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function hide(id: string): Promise<void> {
    if (!enabled || loading || loadFailed || busy) return;
    setBusy(true);
    clearMessages();
    try {
      const row = await hideEverydayItem(id);
      setRows((current) => current.map((item) => (item.id === id ? row : item)));
      setNotice(`${row.name} is hidden from Pieces for real life.`);
    } catch (reason) {
      setError(message(reason));
    } finally {
      setBusy(false);
    }
  }
  return {
    rows: enabled ? rows : [],
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
  return reason instanceof Error ? reason.message : 'An unexpected collection error occurred.';
}
