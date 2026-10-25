import { useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { diwaliCollections, type DiwaliAudience } from '../diwali';

const slides: { label: string; title: string; emphasis: string; copy: string; audience: DiwaliAudience; cta: string; pieces: string[]; theme: string }[] = [
  { label: 'THE DIWALI EDIT', title: 'A little festive', emphasis: 'something.', copy: 'Rich colors, little details, and pieces made for your celebration mood. Discover your festive favorites.', audience: 'Women', cta: 'Explore the festive rack', pieces: ['women-2', 'women-1', 'women-3'], theme: 'festive' },
  { label: 'NEW-SEASON INSPIRATION', title: 'Fresh looks.', emphasis: 'Good company.', copy: 'From understated kurtas to statement layers. Find the look that makes an entrance.', audience: 'Men', cta: 'Browse the men’s edit', pieces: ['men-2', 'men-1', 'men-4'], theme: 'new' },
  { label: 'THE FAMILY EDIT', title: 'One occasion,', emphasis: 'everyone.', copy: 'A favorite for every person. Bring your family’s looks together on your own five-hanger rack.', audience: 'Custom / Family', cta: 'Build your family edit', pieces: ['girls-1', 'women-4', 'boys-2'], theme: 'family' },
];
export default function HeroCarousel({ onAudience }: { onAudience: (value: DiwaliAudience) => void }) {
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  return <section className="hero boutique-hero" id="home" aria-roledescription="carousel" aria-label="Featured collections">
    <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/>{slide.label}</p>
      <h1>{slide.title}<br/><em>{slide.emphasis}</em></h1><p className="hero-description">{slide.copy}</p>
      <a className="button button-dark" href="#rack" onClick={() => onAudience(slide.audience)}>{slide.cta}<ArrowDownRight size={17}/></a>
      <div className="hero-note"><span className="note-mark">✳</span><span>A little celebration.<br/>A style of your own.</span></div>
    </div>
    <div className={`campaign-art campaign-${slide.theme}`}>
      <div className="campaign-arch"><p>{slide.label}<span>THE SUNDAY EDIT</span></p>
        <div className="campaign-clothes" key={index}>{slide.pieces.map(id => {
          const item = diwaliCollections.find(piece => piece.id === id)!;
          return <img key={id} src={item.thumbnail} alt={item.name} decoding="async"/>;
        })}</div>
        <span className="campaign-issue">A CELEBRATION OF PERSONAL STYLE</span>
      </div>
      <span className="campaign-seal">{index === 0 ? <>Diwali<br/><em>sale edit</em><small>DEMO PREVIEW</small></> : index === 1 ? <>The new<br/><em>season</em><small>DEMO COLLECTION</small></> : <>Better<br/><em>together</em><small>THE FAMILY EDIT</small></>}</span>
      <div className="campaign-navigation"><button aria-label="Previous featured slide" onClick={() => setIndex((index + 2) % 3)}><ArrowLeft size={18}/></button><div role="group" aria-label="Choose featured slide">{slides.map((value, position) => <button key={value.label} aria-label={value.label} aria-pressed={index === position} onClick={() => setIndex(position)}/>)}</div><span className="campaign-count" aria-live="polite">0{index + 1} / 03</span><button aria-label="Next featured slide" onClick={() => setIndex((index + 1) % 3)}><ArrowRight size={18}/></button></div>
    </div>
    <a className="scroll-cue" href="#rack"><span>SCROLL TO EXPLORE</span><ArrowDown size={15}/></a>
  </section>;
}

