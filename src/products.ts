export type Product = { id: string; name: string; category: string; description: string; color: string; colorName: string; shape: 'dress' | 'shirt' | 'top' | 'pants' | 'jacket' | 'skirt'; tag: string };

// DEMO CONTENT: illustrative product names and colors; replace with the shop's real products.
export const products: Product[] = [
  { id: '01', name: 'The Sunday Dress', category: 'Dresses', description: 'An easy, flowing shape for slow mornings and spontaneous plans.', color: '#bd806d', colorName: 'Terracotta', shape: 'dress', tag: 'Easy does it' },
  { id: '02', name: 'Everyday Linen Shirt', category: 'Shirts', description: 'Relaxed lines, a softly open collar and room to make it your own.', color: '#d5c6a4', colorName: 'Oat', shape: 'shirt', tag: 'Wear on repeat' },
  { id: '03', name: 'Soft Hour Blouse', category: 'Tops', description: 'A considered little layer with a touch of something special.', color: '#d59aa2', colorName: 'Rose', shape: 'top', tag: 'A little lovely' },
  { id: '04', name: 'The Good Trouser', category: 'Bottoms', description: 'An uncomplicated silhouette that goes wherever the day takes you.', color: '#819184', colorName: 'Sage', shape: 'pants', tag: 'Made for moving' },
  { id: '05', name: 'After Hours Layer', category: 'Layers', description: 'A light extra layer for when the evening turns a little cooler.', color: '#8980a0', colorName: 'Soft plum', shape: 'jacket', tag: 'One more layer' },
  { id: '06', name: 'The Little Skirt', category: 'Bottoms', description: 'An easy swish and a lovely everyday shape.', color: '#e1b68c', colorName: 'Apricot', shape: 'skirt', tag: 'A little movement' },
];
