import { Plus, X } from 'lucide-react';
import { collectionFor, diwaliCollections, MAX_FAMILY_MEMBERS, type ClothingAudience, type FamilyMember } from '../diwali';

interface Props {
  members: FamilyMember[];
  onAdd: (audience: ClothingAudience) => void;
  onUpdate: (id: number, update: Partial<Pick<FamilyMember, 'productId' | 'size'>>) => void;
  onRemove: (id: number) => void;
}
const roles: { audience: ClothingAudience; label: string }[] = [
  { audience: 'Men', label: 'Man' }, { audience: 'Women', label: 'Woman' },
  { audience: 'Girls', label: 'Girl' }, { audience: 'Boys', label: 'Boy' },
];
export default function FamilyBuilder({ members, onAdd, onUpdate, onRemove }: Props) {
  return <div className="family-editor">
    <div className="family-editor-heading"><div><p className="eyebrow">A LOOK FOR EVERYONE</p><h3>Make it <em>a family affair.</em></h3></div><span>{members.length} / {MAX_FAMILY_MEMBERS} hangers</span></div>
    {members.length === 0 && <p className="family-empty-copy">Start with someone in your family. Their outfit will appear on an empty hanger above.</p>}
    <div className="family-rows">{members.map((member, index) => {
      const item = diwaliCollections.find(product => product.id === member.productId)!;
      return <div className="family-row" key={member.id}>
        <span className="member-number">0{index + 1}</span>
        <label>For<select value={item.audience} onChange={event => {
          const first = collectionFor(event.target.value as ClothingAudience)[0];
          onUpdate(member.id, { productId: first.id, size: first.availableSizes[0].size });
        }}>{roles.map(role => <option key={role.audience} value={role.audience}>{role.label}</option>)}</select></label>
        <label>Choose a stock style<select value={member.productId} onChange={event => onUpdate(member.id, { productId: event.target.value })}>
          {collectionFor(item.audience).map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
        </select></label>
        <label>Size<select value={member.size} onChange={event => onUpdate(member.id, { size: event.target.value })}>
          {item.availableSizes.map(option => <option key={option.size} disabled={!option.count}>{option.size}</option>)}
        </select></label>
        <button onClick={() => onRemove(member.id)} aria-label={`Remove family member ${index + 1}`}><X size={18}/></button>
      </div>;
    })}</div>
    <div className="family-add-buttons">{roles.map(role =>
      <button key={role.audience} disabled={members.length >= MAX_FAMILY_MEMBERS} onClick={() => onAdd(role.audience)}><Plus size={15}/> Add {role.label.toLowerCase()}</button>
    )}</div>
    <p className="sample-note" aria-live="polite">{members.length === MAX_FAMILY_MEMBERS ? 'Your five hangers are full. Remove a person to add another.' : 'Choose any of the five stock styles for each person. Your edit stays on this page.'}</p>
  </div>;
}
