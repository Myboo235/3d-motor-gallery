# Hayabusa — 3D Gallery

An interactive 3D gallery of the **Suzuki GSX1300R Hayabusa**. Orbit the bike, click any part to isolate and zoom to it, explode the model apart, switch paint colours, and read details in English or Vietnamese (with Japanese accents).

Built with plain HTML/CSS/JavaScript and [three.js](https://threejs.org). No build step, no npm install.

## Quick start

You need a static web server, because the page loads ES modules and a `.gltf` file (opening `index.html` by double-click will not work).

Pick any one:

```bash
# Python 3 (already installed on most systems)
python3 -m http.server 5173
```

```bash
# or Node
npx serve -l 5173 .
```

Then open <http://localhost:5173>.

> Tip: add `?nointro` to the URL (`http://localhost:5173/?nointro`) to skip the assembly intro animation.
> If you still see an old version after editing, hard-reload with `Ctrl+Shift+R`.

## Features

- **14 selectable parts** — pick from the left list or click the bike / numbered hotspots. Other parts fade out (toggle with *Isolate*).
- **Exploded view** — slider in the bottom dock; side fairings and exhausts split left/right.
- **View presets** — Front, Side, Rear, Top.
- **4 colours** — Pearl White, Metallic Black, Candy Red, Racing Blue (tints the body panels; UI accent colour follows).
- **Test ride** — spins the wheels and rotates the turntable.
- **Wireframe**, **auto-rotate**, and **Capture** (saves a transparent PNG).
- **Languages** — EN / VI switch (top right, remembered in `localStorage`); Japanese is used as decoration.

## Controls

| Action | Input |
| --- | --- |
| Orbit / zoom | Drag / scroll (pinch on touch) |
| Select a part | Click it, a hotspot, or a list item |
| Next / previous part | `→` / `←` |
| Back to overview | `Esc` |
| Toggle explode | `E` |
| Toggle test ride | `R` |
| Toggle auto-rotate | `Space` |

## Project structure

```
index.html            page markup (uses data-i18n attributes)
styles.css            all styling
src/
  main.js             scene, camera, UI, interaction, language switch
  bike.js             loads the GLTF and splits it into 14 parts
  data.js             part names/descriptions/specs, colours, UI strings (EN/VI)
models/suzuki_hayabusa/
  scene.gltf, scene.bin, textures/, license.txt
vendor/three/         vendored three.js + addons (offline, no CDN)
.claude/launch.json   dev-server config for Claude Code preview
```

## Customising

- **Text / translations** — edit `src/data.js` (`PARTS`, `GROUPS`, `OVERVIEW`, `UI`). Add a language by adding a key to each object and a button in `index.html` (`#lang`).
- **Colours** — edit `VARIANTS` in `src/data.js`.
- **Part grouping** — the source model is a few large meshes, so `classify()` in `src/bike.js` assigns each connected piece to a part using mesh names and bounding boxes. If a piece lands in the wrong part, adjust the rules there.
- **Camera per part / explode direction** — `view` and `explode` fields on each part in `src/data.js`.
- **Swapping the model** — replace the files in `models/`, update `MODEL` in `src/bike.js`, then rewrite `classify()` for the new mesh layout.

## Notes

- Specs shown in the UI are approximate and for reference only.
- Fonts (Barlow Condensed, Be Vietnam Pro, JetBrains Mono, Noto Sans JP) load from Google Fonts; offline, the page falls back to system fonts.
- The page needs WebGL. Rendering on machines without a GPU will be slow.

## Credits

- 3D model: **“Suzuki Hayabusa”** by [JUSTGAME](https://sketchfab.com/JUSTGAME), licensed under [CC BY 4.0](http://creativecommons.org/licenses/by/4.0/) — [source on Sketchfab](https://sketchfab.com/3d-models/suzuki-hayabusa-121f40c2c0974fb08823f3bd93c578fe). The credit link in the page footer must be kept.
- [three.js](https://threejs.org) (MIT).
- Suzuki and Hayabusa are trademarks of their owners; this is an unofficial fan project.
