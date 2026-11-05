import { useEffect, useRef, useState } from 'react';
import { prepareGarmentImage, type PreparedImage } from './images';
import type { FormImage } from './model';

type Assets = Partial<Record<FormImage, PreparedImage>>;

export function usePreparedImages() {
  const [assets, setAssets] = useState<Assets>({});
  const current = useRef<Assets>({});
  const generation = useRef(0);
  const requests = useRef<Record<FormImage, number>>({ front: 0, left: 0, right: 0 });

  useEffect(() => {
    return () => {
      generation.current += 1;
      Object.values(current.current).forEach((asset) => {
        if (asset) URL.revokeObjectURL(asset.preview);
      });
      current.current = {};
    };
  }, []);

  function reset() {
    generation.current += 1;
    Object.values(current.current).forEach((asset) => {
      if (asset) URL.revokeObjectURL(asset.preview);
    });
    current.current = {};
    setAssets({});
  }

  async function prepare(
    kind: FormImage,
    file: File,
    requireCutout = kind === 'front',
  ): Promise<boolean> {
    const currentGeneration = generation.current;
    const request = ++requests.current[kind];
    try {
      const image = await prepareGarmentImage(file, requireCutout);
      if (currentGeneration !== generation.current || request !== requests.current[kind]) {
        URL.revokeObjectURL(image.preview);
        return false;
      }
      const previous = current.current[kind];
      current.current = { ...current.current, [kind]: image };
      setAssets(current.current);
      if (previous) URL.revokeObjectURL(previous.preview);
      return true;
    } catch (error) {
      if (currentGeneration !== generation.current || request !== requests.current[kind])
        return false;
      throw error;
    }
  }

  return { assets, prepare, reset };
}
