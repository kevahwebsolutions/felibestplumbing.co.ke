// WCAG 2.x contrast ratio helper. Usage: node scripts/contrast.mjs "#fff on #d63a0c" ...
const lum = (hex) => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
if (process.argv[1]?.endsWith('contrast.mjs')) {
  for (const pair of process.argv.slice(2)) {
    const [fg, bg] = pair.split(/\s+on\s+/);
    const r = ratio(fg.trim(), bg.trim());
    console.log(`${pair.padEnd(28)} ${r.toFixed(2)}  ${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA-large' : 'FAIL'}`);
  }
}
