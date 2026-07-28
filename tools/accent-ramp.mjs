// Generate an OKLCH accent ramp for a new base hue that matches the lightness
// scale and relative saturation of the design system's existing red ramp.

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
}
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function rgbToHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(clamp01(v) * 255).toString(16).padStart(2, '0'))
      .join('')
  );
}

function rgbToOklab([r, g, b]) {
  const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

const lchToLab = (L, C, h) => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
function labToLch([L, a, b]) {
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  return [L, Math.hypot(a, b), h < 0 ? h + 360 : h];
}
const inGamut = ([r, g, b]) => [r, g, b].every((v) => v >= -0.0005 && v <= 1.0005);

/** Largest in-gamut chroma at a given lightness + hue. */
function maxChroma(L, h) {
  let lo = 0, hi = 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (inGamut(oklabToRgb(lchToLab(L, mid, h)))) lo = mid;
    else hi = mid;
  }
  return lo;
}

// The design system's red ramp — the reference for lightness and saturation.
const redRamp = {
  100: '#fff2ef', 200: '#ffe0d9', 300: '#ffc4b8', 400: '#ff9783', 500: '#ff563c',
  600: '#dd2b0f', 700: '#ae1800', 800: '#7c1405', 900: '#4d170e',
};

const targetBase = process.argv[2] || '#0f7a3d';
const [, , targetHue] = labToLch(rgbToOklab(hexToRgb(targetBase)));

const out = {};
for (const [step, hex] of Object.entries(redRamp)) {
  const [L, C] = labToLch(rgbToOklab(hexToRgb(hex)));
  // Keep the step's absolute chroma so the ramp reads as the same palette in a
  // different hue. Clamped to gamut — matching red's *share* of the gamut
  // instead would overshoot badly, since green reaches far higher chroma at
  // light steps and turns neon.
  const newC = Math.min(C, maxChroma(L, targetHue));
  out[step] = rgbToHex(oklabToRgb(lchToLab(L, newC, targetHue)));
}

// Contrast helpers so the result can be checked, not assumed.
const relLum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
function contrast(h1, h2) {
  const a = relLum(hexToRgb(h1)), b = relLum(hexToRgb(h2));
  return ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
}

console.log(`base accent: ${targetBase}   hue=${targetHue.toFixed(1)}°\n`);
for (const [step, hex] of Object.entries(out)) {
  console.log(`  --color-accent-${step}: ${hex};   (was ${redRamp[step]})`);
}

const BG = '#f3f2f2', TEXT = '#201e1d';
console.log('\ncontrast checks (WCAG AA needs 4.5 body / 3.0 large):');
console.log(`  accent on bg          ${contrast(targetBase, BG)}   eyebrows, stat figures, links`);
console.log(`  accent-700 on bg      ${contrast(out[700], BG)}   contact CTA label`);
console.log(`  bg on accent          ${contrast(BG, targetBase)}   contact section body`);
console.log(`  accent-800 on acc-100 ${contrast(out[800], out[100])}   .tag-accent`);
console.log(`  text on accent        ${contrast(TEXT, targetBase)}`);
