# ORBIS — reference rebuild

This separate version lives in `D:\createwebsite\chat1\page2`. It leaves `page1` available for comparison.

## Run

```powershell
cd D:\createwebsite\chat1\page2
npm install
npm run dev -- --port 5180
```

Open the URL printed by Vite. `npm run build` produces the static production site in `dist`; `npm run preview` serves that build.

## What changed

- A single procedural Three.js machine supplies the front, angled, close-up, exploded, and espresso views. The machine no longer changes between unrelated still images.
- The upper covers, lid, collar, grinder, heater, control board, dial, side panels, nozzle, and reservoir have independent geometry and controlled disassembly paths. The lower chassis stays connected.
- The page uses about 31.7 viewport heights of scrolling, compared with about 10 in the first version. Eleven reading holds keep important compositions still while the scroll progress continues.
- Lenis smooths wheel movement, and a lightly scrubbed scroll driver maps position to the visual timeline. Scrolling backward follows the same states in reverse. Nothing automatically advances while the reader stops scrolling.
- The expanding ivory wipe, large background words, editorial panel, warm endpoint, radial dial labels, and growing engineering leader lines are web elements or geometry.
- Reduced-motion preferences show stable chapter compositions with working chapter navigation.

## Where to tune the reference match

| File | Controls |
| --- | --- |
| `src/data/pacing.js` | Reading holds and scroll distance per transition |
| `src/hooks/useMasterTimeline.js` | Camera position, scale, angle, text timing, transitions |
| `src/components/machineModel.js` | Geometry, materials, component separation, glass and coffee |
| `src/components/MachineScene.jsx` | Lighting, renderer, responsive camera sizing |
| `src/components/Layers.jsx` | Editable copy, labels, and opening dial |
| `src/styles.css` | Typography, positioning, colors, responsive layout |

Add `?debug` to show the equivalent reference timestamp and scroll percentage. The reference timestamp describes a visual state; it does not dictate the reading speed.

## Assets

Only `client-assets` is served and copied into the production build. The rebuilt machine is also supplied as `client-assets/assets/v2/orbis-machine.glb`, with named component groups. Original generated images are retained separately in `public/assets/v2` for traceability. See `ASSETS.md` for provenance and generation prompts.

The reference video and its extracted frames are used only for inspection. They are not included in the experience or used as a background.

## Review and limitations

The machine geometry is reconstructed from the video; it is not the original model. The supplied video does not contain enough information to recover unseen geometry, exact original materials, or lighting. This version recreates its sequence and major compositions, with deliberately slower pacing; it should not be represented as pixel-identical to the original film.

The full camera and exploded experience requires WebGL. A static rendered machine provides a fallback if WebGL cannot initialize. Presentation CTAs navigate the experience rather than submitting purchases.

Verification results and checkpoint screenshots are in `review`. The browser checks cover four desktop sizes, two mobile widths, wheel interpolation, reading holds, reverse state restoration, chapter navigation, and reduced-motion behavior.
