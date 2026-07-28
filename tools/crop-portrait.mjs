// Recentre the portrait on the face, keeping the design's 3:4 frame.
//
// The source is 900x1200 — already 3:4 — so object-fit:cover crops nothing and
// the subject sits low in the frame with a lot of empty tree canopy above.
// This takes the largest 3:4 window that puts the face at the centre.

import sharp from 'sharp';

const SRC = process.argv[2];
const OUT = process.argv[3];

// Face centre measured from the source: between the eyes and the nose.
const FACE_X = 0.43;
const FACE_Y = 0.61;
const RATIO = 3 / 4;

const { width: W, height: H } = await sharp(SRC).metadata();
const cx = W * FACE_X;
const cy = H * FACE_Y;

// Largest half-extents that keep the window inside the image on every side.
const maxHalfW = Math.min(cx, W - cx);
const maxHalfH = Math.min(cy, H - cy);

// Fit a 3:4 box inside those bounds.
let cropW = Math.min(maxHalfW * 2, maxHalfH * 2 * RATIO);
let cropH = cropW / RATIO;

const left = Math.round(cx - cropW / 2);
const top = Math.round(cy - cropH / 2);
cropW = Math.round(cropW);
cropH = Math.round(cropH);

console.log(`source     ${W}x${H}`);
console.log(`face at    ${Math.round(cx)},${Math.round(cy)}  (${FACE_X * 100}%, ${FACE_Y * 100}%)`);
console.log(`crop       ${cropW}x${cropH} at ${left},${top}  ratio=${(cropW / cropH).toFixed(4)}`);

await sharp(SRC)
  .extract({ left, top, width: cropW, height: cropH })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const after = await sharp(OUT).metadata();
console.log(`wrote      ${OUT}  ${after.width}x${after.height}`);
