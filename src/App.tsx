import { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import { products, type Product } from './products';
import { type DiwaliAudience } from './diwali';
import Garment from './Garment';
import ClothingRack from './components/ClothingRack';
import HeroCarousel from './components/HeroCarousel';
import Dialog from './components/Dialog';

export default function App() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All pieces');
  const [audience, setAudience] = useState<DiwaliAudience>('Women');
  const categories = ['All pieces', 'Dresses', 'Tops', 'Shirts', 'Bottoms', 'Layers'];
  const shownProducts = filter === 'All pieces' ? products : products.filter(p => p.category === filter);
  return <>
    <div className="announcement"><span>A little inspiration for what to wear next</span><span className="announcement-dot"/><span>A concept for your local clothing shop</span></div>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label="The Sunday Edit home">THE SUNDAY <i>EDIT</i><span className="wordmark-dot">.</span></a>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
        <a href="#rack" onClick={() => setMenuOpen(false)}>Festive rack</a><a href="#collection" onClick={() => setMenuOpen(false)}>The collection</a><a href="#about" onClick={() => setMenuOpen(false)}>Our story</a><a href="#visit" onClick={() => setMenuOpen(false)}>Come say hello</a>
      </nav>
      <a className="header-cta" href="#collection">Explore the edit <ArrowUpRight size={15}/></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>
    <main>

      <HeroCarousel onAudience={setAudience}/>
      <section className="intro-strip"><p>WEAR IT YOUR WAY</p><span>✳</span><p>FIND YOUR EVERYDAY FAVORITES</p><span>✳</span><p>MADE TO MAKE YOU FEEL LIKE YOU</p><span>✳</span></section>
      <ClothingRack audience={audience} onAudience={setAudience}/>
      <section className="collection-section section-pad" id="collection"><div className="collection-top"><div><p className="eyebrow">THE COLLECTION — DEMO EDIT</p><h2>Pieces for <em>real life.</em></h2></div><a className="text-link" href="#rack">Back to the rack <ArrowUpRight size={15}/></a></div>
        <div className="filters" aria-label="Filter collection">{categories.map(c => <button key={c} onClick={() => setFilter(c)} className={filter === c ? 'filter active-filter' : 'filter'} aria-pressed={filter === c}>{c}</button>)}</div>
        <div className="product-grid">{shownProducts.map(p => <button className="product-card" key={p.id} onClick={() => setSelected(p)} aria-label={`View ${p.name}`}>
          <div className={`product-visual visual-${p.shape}`}><span className="product-tag">{p.tag}</span><Garment product={p}/><span className="product-quick">Take a closer look <ArrowUpRight size={14}/></span></div>
          <div className="product-meta"><div><h3>{p.name}</h3><p>{p.category} · Demo piece</p></div><span className="product-number">0{p.id}</span></div>
        </button>)}</div><p className="demo-notice">A collection concept. Product names, colors and descriptions are placeholders for demonstration.</p>
      </section>

      <section className="about-section" id="about"><div className="about-image"><div className="about-sun"/><div className="about-quote">“A good outfit<br/>can change the<br/><em>whole day.”</em></div><span className="about-caption">A LITTLE NOTE FROM YOUR NEIGHBORHOOD SHOP</span></div><div className="about-copy"><p className="eyebrow">A NOTE FROM THE SHOP</p><h2>A place to find<br/><em>your kind of style.</em></h2><p className="about-body">This is where your shop’s story belongs — the people, the little details, and what makes a visit feel like yours. Add a few honest words about what you love doing and who you love doing it for.</p><p className="about-placeholder">OWNER NOTE: Replace this sample introduction with a real description of your shop before launch.</p><a href="#visit" className="text-link">Come say hello <ArrowUpRight size={15}/></a></div></section>

      <section className="visit-section section-pad" id="visit"><div className="visit-left"><p className="eyebrow">GOOD THINGS ARE BETTER IN PERSON</p><h2>Let’s make it<br/><em>a proper hello.</em></h2><p>Drop by, browse a little, and find something that feels like you.</p></div><div className="visit-card"><span className="visit-star">✳</span><p className="eyebrow">YOUR LOCAL CLOTHING SHOP</p><h3>The Sunday Edit</h3><p className="visit-placeholder">Shop location and visit details to be added by the owner.</p><div className="visit-rule"/><p className="visit-small">Phone, WhatsApp, email, address and social links are hidden until real details are supplied.</p><span className="visit-stamp">SAY<br/>HELLO</span></div></section>
    </main>
    <footer className="footer"><a className="wordmark footer-mark" href="#home">THE SUNDAY <i>EDIT</i><span className="wordmark-dot">.</span></a><span className="footer-note">A LOCAL SHOP WEBSITE CONCEPT, READY FOR YOUR STORY.</span><a className="footer-top" href="#home">Back to top <ArrowUpRight size={14}/></a></footer>

    {selected && <Dialog titleId="drawer-title" onClose={() => setSelected(null)} className="everyday-drawer"><button className="drawer-close" onClick={() => setSelected(null)} aria-label="Close product details"><X/></button><div className={`drawer-art visual-${selected.shape}`}><span className="drawer-demo-label">DEMO PIECE · DETAILS TO BE CONFIRMED</span><Garment product={selected}/></div><div className="drawer-details"><p className="eyebrow">{selected.category.toUpperCase()} <span>—</span> DEMO EDIT</p><h2 id="drawer-title">{selected.name}</h2><p>{selected.description}</p><div className="detail-rule"/><p className="detail-color"><span className="color-swatch" style={{ backgroundColor: selected.color }}/>{selected.colorName} <span className="detail-muted">· illustrative color</span></p><p className="detail-note">Size, price and availability are not supplied. Contact the shop directly once real details have been added.</p><div className="drawer-controls"><button onClick={() => { const i = products.findIndex(p => p.id === selected.id); setSelected(products[(i + products.length - 1) % products.length]); }} aria-label="Previous garment"><ArrowLeft size={17}/></button><span>{selected.id} / 06</span><button onClick={() => { const i = products.findIndex(p => p.id === selected.id); setSelected(products[(i + 1) % products.length]); }} aria-label="Next garment"><ArrowRight size={17}/></button></div></div></Dialog>}

  </>;
}

