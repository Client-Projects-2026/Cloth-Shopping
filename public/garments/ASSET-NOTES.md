# Individual garment demo assets

Created with the built-in image generation tool, using the supplied public/Refernce images as style references.

Each of the 20 garments was generated individually. Its left and right images were then generated from that garment's own front image. No collection image was cropped, and no front image was mirrored or flattened to simulate another view. Side images are generated design interpretations for this demo, not verified photography of real inventory.

Saved assets: `public/garments/{id}-{front|left|right}.webp` and `public/garments/{id}-rack.webp`. Original generated PNGs remain in the Codex generated_images directory. The preparation script records each original filename and uses Sharp only for resizing and WebP encoding, with no cropping. All images retain alpha transparency.

## Front-view prompt template

Professional photorealistic boutique catalog asset. SINGLE complete outfit only: SUBJECT. Use attached reference only as inspiration for Indian festive textile quality. Front view, symmetrical, full garment suspended naturally on ONE slim walnut wooden hanger with small brass hook. Garment filled with natural fabric volume (invisible mannequin), no visible body or person. All matching lower garments hang neatly aligned under upper garment as one outfit. Isolated on genuinely transparent alpha background. Vertical 2:3 canvas, whole hanger hook and whole hem visible, centered, 8 percent clear margin all edges. Hanger hook top at 6 percent canvas height. Soft neutral studio lighting, sharp embroidery, natural drape. No rail, no stand, no background, no floor, no contact shadow, no text, no logos, no other clothes, no collage. This is an individual product image, never a crop from a collection photo.

Additional constraint used for the remaining front views: STRICT background is empty alpha. No glow, aura, gradients, vignette or shadows around garment.

## Subjects substituted for SUBJECT

- **men-1**: forest green silk men's long kurta with restrained gold embroidery around band collar, placket and cuffs, ivory pajama trousers
- **men-2**: ivory men's kurta and trousers, gold brocade Nehru waistcoat with five small gold buttons
- **men-3**: midnight navy men's kurta with subtle gold embroidered band collar and cuffs, ivory pajama trousers
- **men-4**: deep maroon men's sherwani with all-over subtle gold floral brocade and gold buttons, cream trousers
- **men-5**: teal men's silk kurta with narrow gold embroidered collar and cuffs, ivory trousers
- **women-1**: ruby red embroidered lehenga skirt and matching modest short-sleeve blouse, small gold floral motifs and heavy gold hem, red sheer dupatta draped over one shoulder
- **women-2**: emerald green silk sari draped into its complete wearable shape with matching modest blouse, gold border and pallu over left shoulder
- **women-3**: royal blue lehenga skirt and modest matching short-sleeve blouse, gold floral embroidery, blue sheer dupatta over one shoulder
- **women-4**: rose magenta floor-length Anarkali dress with fitted bodice, long sleeves, fine gold embroidery and sheer matching dupatta
- **women-5**: teal sharara outfit, knee-length embroidered tunic with long sleeves and matching wide flared trousers, fine gold details and matching sheer dupatta
- **girls-1**: child-size pink lehenga skirt with gold hem, matching modest short-sleeve blouse and a small sheer dupatta
- **girls-2**: child-size golden yellow ankle-length festive party dress, short sleeves, gold embroidered bodice and flared skirt
- **girls-3**: child-size turquoise sharara with modest short-sleeve tunic, fine gold details and matching flared trousers
- **girls-4**: child-size coral pink lehenga skirt and modest matching short-sleeve blouse, gold floral details and coral dupatta
- **girls-5**: child-size violet lehenga skirt and modest short-sleeve blouse, gold embroidered hem and violet dupatta
- **boys-1**: child-size mustard yellow band-collar kurta with gold embroidered cuffs and ivory pajama trousers
- **boys-2**: child-size ivory kurta and trousers with teal brocade Nehru waistcoat, five small gold buttons
- **boys-3**: child-size coral pink kurta with subtle gold band collar embroidery, ivory pajama trousers
- **boys-4**: child-size navy blue kurta with small gold band collar and cuffs, ivory trousers
- **boys-5**: child-size forest green silk kurta with subtle gold detailing, ivory trousers

## Side-view prompt template

Use each garment's front image as the edit target; replace ANGLE with left or right.

Edit target: the attached single garment product image. Keep the exact same outfit, embroidery, colors, hanger, matching trousers/skirt and dupatta. Change ONLY the camera viewpoint to a clear three-quarter ANGLE-side view at 55 degrees around the actual garment. Show convincing fabric volume, the ANGLE sleeve profile, side seam, and how the back wraps around. This must be an actual perspective of the three-dimensional garment, never a mirrored or squashed front photo. Turn the hanger with the garment. Complete outfit and hanger hook fully visible on a portrait 2:3 canvas, centered at the same scale, leave clear margins. Invisible mannequin, no body. Clean transparent alpha background everywhere outside the garment, no ground or shadow, no background, no text, no rail, no other clothes. One single view only.
