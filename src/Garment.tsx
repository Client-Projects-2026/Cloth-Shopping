import type { Product } from './products';

export default function Garment({ product, className = '' }: { product: Product; className?: string }) {
  const c = product.color;
  const base = { fill: c, stroke: '#463d36', strokeWidth: 1.7, strokeLinejoin: 'round' as const };
  return <svg className={`garment-svg ${className}`} viewBox="0 0 160 220" role="img" aria-label={`${product.colorName} ${product.category.toLowerCase()} illustration`}>
    <path d="M80 17c-12 0-22-8-24-14m24 14c12 0 22-8 24-14" fill="none" stroke="#8d765b" strokeWidth="3" strokeLinecap="round" />
    {product.shape === 'dress' && <><path {...base} d="M67 20 48 31 31 58l17 12 9-13-8 68 31 12 31-12-8-68 9 13 17-12-17-27-19-11-13 15z"/><path d="M68 20q12 19 24 0" fill="none" stroke="#463d36" strokeWidth="1.4"/><path d="M57 81h46M54 111h52" stroke="#ffffff" strokeOpacity=".35" strokeWidth="2"/></>}
    {product.shape === 'shirt' && <><path {...base} d="m64 21-17 9-21 17 16 21 9-8-5 66h68l-5-66 9 8 16-21-21-17-17-9-16 17z"/><path d="m64 21 16 17 16-17M80 38v87M76 50h3m0 18h3m-3 18h3" fill="none" stroke="#463d36" strokeWidth="1.6"/><path d="M49 67 33 48M111 67l16-19" fill="none" stroke="#463d36" strokeWidth="1.5"/></>}
    {product.shape === 'top' && <><path {...base} d="M65 21 47 29 30 53l17 14 10-12-4 70h54l-4-70 10 12 17-14-17-24-18-8-15 17z"/><path d="M65 21q15 32 30 0M80 53v66" fill="none" stroke="#463d36" strokeWidth="1.5"/></>}
    {product.shape === 'pants' && <><path {...base} d="M52 28h56l-4 104-22 2-3-69-3 69-22-2z"/><path d="M54 44h52M80 30v33" fill="none" stroke="#463d36" strokeWidth="1.5"/></>}
    {product.shape === 'jacket' && <><path {...base} d="m63 22-17 9-20 21 16 19 10-10-4 59h64l-4-59 10 10 16-19-20-21-17-9-7 13H70z"/><path d="m63 22 17 23 17-23M80 45v75m-13-65 13 12 13-12" fill="none" stroke="#463d36" strokeWidth="1.6"/><circle cx="86" cy="70" r="1.5" fill="#463d36"/><circle cx="86" cy="88" r="1.5" fill="#463d36"/></>}
    {product.shape === 'skirt' && <><path {...base} d="M55 29h50l10 91-35 11-35-11z"/><path d="M55 42h50M80 44v79" fill="none" stroke="#463d36" strokeWidth="1.4"/></>}
    <path d="M35 150q45 13 90 0" fill="none" stroke="#ffffff" strokeOpacity=".25" strokeWidth="2" />
  </svg>;
}
