import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { type DiwaliAudience } from './diwali';
import ClothingRack from './components/ClothingRack';
import EverydayCollection from './components/EverydayCollection';
import HeroCarousel from './components/HeroCarousel';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [audience, setAudience] = useState<DiwaliAudience>('Women');
  return (
    <>
      <div className="announcement">
        <span>A little inspiration for what to wear next</span>
        <span className="announcement-dot" />
        <span>A concept for your local clothing shop</span>
      </div>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="The Sunday Edit home">
          THE SUNDAY <i>EDIT</i>
          <span className="wordmark-dot">.</span>
        </a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
          <a href="#rack" onClick={() => setMenuOpen(false)}>
            Festive rack
          </a>
          <a href="#collection" onClick={() => setMenuOpen(false)}>
            The collection
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            Our story
          </a>
          <a href="#visit" onClick={() => setMenuOpen(false)}>
            Come say hello
          </a>
        </nav>
        <a className="header-cta" href="#collection">
          Explore the edit <ArrowUpRight size={15} />
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>
      <main>
        <HeroCarousel onAudience={setAudience} />
        <section className="intro-strip">
          <p>WEAR IT YOUR WAY</p>
          <span>✳</span>
          <p>FIND YOUR EVERYDAY FAVORITES</p>
          <span>✳</span>
          <p>MADE TO MAKE YOU FEEL LIKE YOU</p>
          <span>✳</span>
        </section>
        <ClothingRack audience={audience} onAudience={setAudience} />
        <EverydayCollection />

        <section className="about-section" id="about">
          <div className="about-image">
            <div className="about-sun" />
            <div className="about-quote">
              “A good outfit
              <br />
              can change the
              <br />
              <em>whole day.”</em>
            </div>
            <span className="about-caption">A LITTLE NOTE FROM YOUR NEIGHBORHOOD SHOP</span>
          </div>
          <div className="about-copy">
            <p className="eyebrow">A NOTE FROM THE SHOP</p>
            <h2>
              A place to find
              <br />
              <em>your kind of style.</em>
            </h2>
            <p className="about-body">
              This is where your shop’s story belongs — the people, the little details, and what
              makes a visit feel like yours. Add a few honest words about what you love doing and
              who you love doing it for.
            </p>
            <p className="about-placeholder">
              OWNER NOTE: Replace this sample introduction with a real description of your shop
              before launch.
            </p>
            <a href="#visit" className="text-link">
              Come say hello <ArrowUpRight size={15} />
            </a>
          </div>
        </section>

        <section className="visit-section section-pad" id="visit">
          <div className="visit-left">
            <p className="eyebrow">GOOD THINGS ARE BETTER IN PERSON</p>
            <h2>
              Let’s make it
              <br />
              <em>a proper hello.</em>
            </h2>
            <p>Drop by, browse a little, and find something that feels like you.</p>
          </div>
          <div className="visit-card">
            <span className="visit-star">✳</span>
            <p className="eyebrow">YOUR LOCAL CLOTHING SHOP</p>
            <h3>The Sunday Edit</h3>
            <p className="visit-placeholder">
              Shop location and visit details to be added by the owner.
            </p>
            <div className="visit-rule" />
            <p className="visit-small">
              Phone, WhatsApp, email, address and social links are hidden until real details are
              supplied.
            </p>
            <span className="visit-stamp">
              SAY
              <br />
              HELLO
            </span>
          </div>
        </section>
      </main>
      <footer className="footer">
        <a className="wordmark footer-mark" href="#home">
          THE SUNDAY <i>EDIT</i>
          <span className="wordmark-dot">.</span>
        </a>
        <span className="footer-note">A LOCAL SHOP WEBSITE CONCEPT, READY FOR YOUR STORY.</span>
        <a className="footer-top" href="#home">
          Back to top <ArrowUpRight size={14} />
        </a>
      </footer>
    </>
  );
}
