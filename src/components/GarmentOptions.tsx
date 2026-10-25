import { collectionFor, type DiwaliCollectionItem } from '../diwali';

interface Props {
  item: DiwaliCollectionItem;
  size: string;
  onSize: (size: string) => void;
  onItem: (item: DiwaliCollectionItem) => void;
}
export default function GarmentOptions({ item, size, onSize, onItem }: Props) {
  return <div className="garment-options">
    <fieldset>
      <legend>Size <span>Sample stock</span></legend>
      <div className="size-choices">{item.availableSizes.map(option =>
        <button type="button" key={option.size} aria-pressed={size === option.size}
          disabled={option.count === 0} onClick={() => onSize(option.size)}>
          <strong>{option.size}</strong><small>{option.count} available</small>
        </button>)}</div>
    </fieldset>
    <fieldset>
      <legend>Explore colors &amp; styles <span>{item.colorName}</span></legend>
      <div className="style-swatches">{collectionFor(item.audience).map(other =>
        <button type="button" key={other.id} aria-pressed={item.id === other.id}
          aria-label={`Choose ${other.colorName}: ${other.name}`} title={other.name}
          onClick={() => onItem(other)}><i style={{ backgroundColor: other.color }}/><span>{other.colorName}</span></button>
      )}</div>
    </fieldset>
  </div>;
}

