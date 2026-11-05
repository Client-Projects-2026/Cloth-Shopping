import type { DiwaliCollectionItem } from './diwali';

type StockedItem = Pick<DiwaliCollectionItem, 'availableSizes'>;

export function hasAvailableStock(item: StockedItem): boolean {
  return item.availableSizes.some(({ count }) => count > 0);
}

export function chooseAvailableSize(item: StockedItem, preferred = ''): string {
  return (
    item.availableSizes.find(({ size, count }) => size === preferred && count > 0)?.size ??
    item.availableSizes.find(({ count }) => count > 0)?.size ??
    ''
  );
}
