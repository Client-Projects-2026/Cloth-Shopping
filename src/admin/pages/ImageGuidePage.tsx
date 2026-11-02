import { AlertCircle, Plus } from 'lucide-react';

export default function ImageGuidePage({ onAdd }: { onAdd: () => void }) {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-kicker">THE STUDIO HANDBOOK</p>
          <h1>Images that hang beautifully.</h1>
          <p>A small amount of preparation makes every garment feel clear and considered.</p>
        </div>
        <button className="admin-primary" onClick={onAdd}>
          <Plus size={18} /> Add a product
        </button>
      </div>
      <div className="admin-guide-layout">
        <section className="admin-card admin-guide-feature">
          <div>
            <span>01 / THE FRONT CUTOUT</span>
            <h2>
              Show the whole piece.
              <br />
              <em>Leave the background out.</em>
            </h2>
            <p>
              Export the complete garment on a transparent canvas. Keep sleeves, hems and hanger
              visible, with breathing room around the edges. Avoid photos of several dresses
              together.
            </p>
            <div className="admin-guide-pills">
              <span>PNG or WebP</span>
              <span>Transparent background</span>
              <span>At least 400 × 400 px</span>
              <span>Under 8 MB source</span>
            </div>
          </div>
          <div className="admin-guide-visual">
            <img
              src="/garments/women-1-front.webp"
              alt="Example of a complete transparent garment"
            />
          </div>
        </section>
        <div className="admin-guide-steps">
          <section className="admin-card">
            <span>02</span>
            <h3>Give each angle its own photo.</h3>
            <p>
              Front is required for the hanger. Add a separate left and right photograph when
              available. The shop only shows angles you actually upload.
            </p>
          </section>
          <section className="admin-card">
            <span>03</span>
            <h3>We fit it into the frame.</h3>
            <p>
              The studio converts each image to WebP on a 1200 × 1600 transparent canvas. The full
              garment stays visible. It also makes a smaller rack thumbnail from the front.
            </p>
          </section>
          <section className="admin-card">
            <span>04</span>
            <h3>Check the details.</h3>
            <p>
              Set the collection, hanger slot, color, price and stock per size. Preview the result,
              then publish. A hidden hanger disappears from the public rack.
            </p>
          </section>
        </div>
        <div className="admin-guide-footnote">
          <AlertCircle size={18} />
          <p>
            Background removal is not automatic. A JPEG with a solid backdrop cannot become a clean
            garment cutout through format conversion alone. Prepare a transparent front image before
            uploading.
          </p>
        </div>
      </div>
    </>
  );
}
