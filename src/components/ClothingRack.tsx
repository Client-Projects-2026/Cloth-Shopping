import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Pause, Play, Sparkles } from 'lucide-react';
import { collectionFor, diwaliAudiences, diwaliCollections, occasions, MAX_FAMILY_MEMBERS, type ClothingAudience, type DiwaliAudience, type DiwaliCollectionItem, type FamilyMember, type Occasion } from '../diwali';
import GarmentOptions from './GarmentOptions';
import GarmentDrawer from './GarmentDrawer';
import FamilyBuilder from './FamilyBuilder';

interface Props { audience: DiwaliAudience; onAudience: (value: DiwaliAudience) => void }
function EmptyHanger({ number }: { number: number }) {
  return <div className="empty-rack-slot">
    <svg viewBox="0 0 180 300" aria-hidden="true"><path d="M90 23c0-17 24-17 24-2 0 10-24 14-24 27v12L24 101q-6 8 7 8h118q13 0 7-8L90 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><path d="m38 101 52-34 52 34" stroke="currentColor" fill="none" strokeWidth="8" strokeLinecap="round"/></svg>
    <span>Hanger 0{number}<small>Waiting for someone</small></span>
  </div>;
}
export default function ClothingRack({ audience, onAudience }: Props) {
  const [occasion, setOccasion] = useState<Occasion>('diwali');
  const [paused, setPaused] = useState(false);
  const [selection, setSelection] = useState<{ itemId: string; memberId?: number; size: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const nextId = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setSelection(null); setDrawerOpen(false); }, [audience]);
  const theme = occasions.find(value => value.id === occasion)!;
  const family = audience === 'Custom / Family';
  const selected = selection ? diwaliCollections.find(item => item.id === selection.itemId) : undefined;
  const items = family ? members.map(member => diwaliCollections.find(item => item.id === member.productId)!) : collectionFor(audience);
  const chooseAudience = (value: DiwaliAudience) => {
    setSelection(null); setDrawerOpen(false); onAudience(value);
    scrollRef.current?.scrollTo({ left: 0, behavior: 'instant' });
  };
  const selectItem = (item: DiwaliCollectionItem, member?: FamilyMember) => {
    setSelection({ itemId: item.id, memberId: member?.id, size: member?.size ?? '' });
    setDrawerOpen(false);
  };
  const changeStyle = (item: DiwaliCollectionItem) => {
    if (!selection) return;
    const size = item.availableSizes.some(option => option.size === selection.size) ? selection.size : '';
    setSelection({ ...selection, itemId: item.id, size });
    if (selection.memberId) setMembers(values => values.map(member => member.id === selection.memberId ? { ...member, productId: item.id, size: size || item.availableSizes[0].size } : member));
  };
  const changeSize = (size: string) => {
    if (!selection) return;
    setSelection({ ...selection, size });
    if (selection.memberId) setMembers(values => values.map(member => member.id === selection.memberId ? { ...member, size } : member));
  };
  const addMember = (role: ClothingAudience) => {
    const item = collectionFor(role)[0];
    const member = { id: nextId.current++, productId: item.id, size: item.availableSizes[0].size };
    setMembers(values => values.length < MAX_FAMILY_MEMBERS ? [...values, member] : values);
  };
  const updateMember = (id: number, update: Partial<Pick<FamilyMember, 'productId' | 'size'>>) => {
    setMembers(values => values.map(member => member.id === id ? { ...member, ...update } : member));
    if (selection?.memberId === id) setSelection({ ...selection, itemId: update.productId ?? selection.itemId, size: update.size ?? selection.size });
  };
  const removeMember = (id: number) => {
    setMembers(values => values.filter(member => member.id !== id));
    if (selection?.memberId === id) { setSelection(null); setDrawerOpen(false); }
  };
  return <section className="rack-section section-pad boutique-rack" id="rack">
    <div className="section-heading"><div><p className="eyebrow">A LITTLE SOMETHING TO BROWSE</p><h2>Take a peek at<br/><em>the rack.</em></h2></div><p className="heading-aside">Find the piece that feels like you.<br/>Tap a hanger. Make it yours.</p></div>
    <div className="rack-toolbar">
      <div className="audience-tabs" role="group" aria-label="Choose a collection">{diwaliAudiences.map(value =>
        <button key={value} aria-pressed={audience === value} onClick={() => chooseAudience(value)}>{value}</button>
      )}</div>
      <label className="occasion-picker"><Sparkles size={16}/><span>Rack backdrop<select aria-label="Change occasion backdrop" value={occasion} onChange={event => setOccasion(event.target.value as Occasion)}>{occasions.map(value => <option key={value.id} value={value.id}>{value.label}</option>)}</select></span></label>
    </div>
    <div className={`boutique-stage theme-${occasion}`} data-motion={paused ? 'paused' : 'playing'}>
      <div className="stage-decoration" aria-hidden="true"><div className="stage-arch"/><div className="stage-lights">{Array.from({ length: 13 }, (_, i) => <i key={i} style={{ '--light': i } as CSSProperties}/>)}</div><span className="stage-flower flower-one">✳</span><span className="stage-flower flower-two">✳</span></div>
      <div className="stage-heading"><div><span>{theme.label} edit</span><p>{theme.caption}</p></div><button className="motion-button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play garment motion' : 'Pause garment motion'} aria-pressed={paused}>{paused ? <Play size={14}/> : <Pause size={14}/>}<span>{paused ? 'Play motion' : 'Pause motion'}</span></button></div>
      <div className="rack-scroll" ref={scrollRef} tabIndex={0} aria-label={`${audience} clothing rack, scroll horizontally to browse all five hangers`}>
        <div className="rack-display">
          <div className="clothes-rail" aria-hidden="true"/><div className="rail-post post-left" aria-hidden="true"/><div className="rail-post post-right" aria-hidden="true"/>
          <div className="garment-row">{Array.from({ length: 5 }, (_, index) => {
            const item = items[index];
            const member = family ? members[index] : undefined;
            const active = !!item && selected?.id === item.id && (!family || selection?.memberId === member?.id);
            return <div className="garment-slot" key={member?.id ?? `${audience}-${index}`}>
              {item ? <button className="hanging-garment" aria-label={`Select ${item.name}`} aria-pressed={active}
                onClick={() => selectItem(item, member)} style={{ '--sway-duration': `${5.8 + index * .55}s`, '--sway-delay': `${-index * 1.7}s` } as CSSProperties}>
                <span className="garment-suspension"><img src={item.thumbnail} alt={item.name} draggable={false} loading="lazy" decoding="async"/></span>
                <span className="hanger-caption"><small>{family ? `0${index + 1} / ${item.audience}` : item.type}</small><strong>{item.name}</strong><span>{active ? <><Check size={12}/> Selected</> : <>Explore piece <ArrowUpRight size={12}/></>}</span></span>
              </button> : <EmptyHanger number={index + 1}/>}
            </div>;
          })}</div>
        </div>
      </div>
      <div className="stage-footer"><span>{family ? `${members.length} of 5 hangers filled` : '5 pieces, picked for the occasion'}<small>Garment designs &amp; stock are samples</small></span>
        <div className="rack-scroll-controls"><button onClick={() => scrollRef.current?.scrollBy({ left: -210, behavior: 'smooth' })} aria-label="Scroll rack left"><ArrowLeft size={17}/></button><span>Swipe to browse</span><button onClick={() => scrollRef.current?.scrollBy({ left: 210, behavior: 'smooth' })} aria-label="Scroll rack right"><ArrowRight size={17}/></button></div>
        <span className="backdrop-description" aria-live="polite">{theme.detail}</span></div>
    </div>
    {family && <FamilyBuilder members={members} onAdd={addMember} onUpdate={updateMember} onRemove={removeMember}/>}
    {selected && selection && <div className="selected-piece" key={selection.memberId ?? 'collection'}>
      <div className="selected-piece-art"><img src={selected.images.front} alt={`Full view of ${selected.name}`}/></div>
      <div className="selected-piece-details"><p className="eyebrow">{selected.audience} / YOUR PICK</p><h3>{selected.name}</h3>
        <GarmentOptions item={selected} size={selection.size} onSize={changeSize} onItem={changeStyle}/>
        <div className="selected-piece-footer"><p aria-live="polite">{selected.colorName} · {selection.size || 'Choose your size'}</p><button className="button button-dark" onClick={() => setDrawerOpen(true)}>View this piece <ArrowUpRight size={17}/></button></div>
      </div>
    </div>}
    {!selected && <p className="rack-select-hint"><span/> Select a hanging piece to see sizes, colors and every angle.</p>}
    {drawerOpen && selected && selection && <GarmentDrawer item={selected} size={selection.size} onSize={changeSize} onItem={changeStyle} onClose={() => setDrawerOpen(false)}/>}
  </section>;
}

