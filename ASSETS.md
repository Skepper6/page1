# Asset provenance

The environments and design study were generated with the built-in image-generation tool. The website machine itself was constructed in code so all camera views and dismantled parts share the same geometry.

## Production assets

- `client-assets/assets/v2/night.webp`: optimized generated night environment.
- `client-assets/assets/v2/dawn.webp`: optimized matching dawn environment.
- `client-assets/assets/v2/orbis-machine.glb`: exported procedural 3D machine with named components.
- `client-assets/assets/v2/machine-fallback.webp`: transparent rendering of the rebuilt geometry for browsers without WebGL.
- `client-assets/assets/processed/bean.webp` and `stars.webp`: retained derivatives from the supplied original asset set.

The generated master design study is saved as `public/assets/v2/machine-master.png`. It contains a baked checkerboard and is used only as a design reference, never as a website visual. The production machine has no raster background to remove.

## Final generation prompts

### Machine design study

Use case: product-mockup. Generate a high-resolution isolated photorealistic CGI product asset for a coded website, on TRUE TRANSPARENT alpha background. The most recent reference image shows a website with WATCH PRECISION COME APART. Use it for the PRODUCT DESIGN ONLY. Reconstruct ONLY that espresso machine, absolutely no website text, no arrows, no background, no browser UI. Match its exact tall narrow almost cylindrical charcoal-black silhouette: width to height about 0.58, perfectly straight-on front camera, symmetric left and right thin dark transparent water-reservoir side rails largely hidden behind the body, slim subtle bronze elliptical top lid, deep matte black curved front, restrained edge reflections. Most important: the dial is a large BLACK FACE with a SINGLE THIN glowing warm amber perimeter ring, not a thick metallic donut, at front upper quarter, centered horizontally. Dial face reads small white ORBIS centered, small white radial GRIND / CREATE / REPEAT around inner face. Tiny cylindrical black dispensing nozzle directly underneath. Tall empty recessed brewing cavity below, simple ribbed black drip tray and curved black base with small understated ORBIS. NO CUP for this master asset. Full complete machine fully inside frame, no ground plane or cast ground shadow, no bright silver chrome, no oversized side reservoir, no three-quarter angle, no checkerboard pixels. Subdued dark premium cinematic studio lighting, sufficient edge definition on both dark and ivory backgrounds. Portrait 1024x1536 composition with machine occupying 86 percent height, transparent margins.

### Night environment

Use case: photorealistic-natural. Asset: 16:9 cinematic background plate for the ORBIS reference-style espresso-machine website. Generate 1920x1080 landscape image. Almost-black midnight navy sky fills the top 75 percent, very subtle scattered tiny distant stars, no milky way, no blue nebula, no moon. In the bottom 25 percent: photorealistic extremely dark charcoal rocky volcanic terrain, craggy low mountains on left and right, a flat low central foreground platform in bottom-center available for a product to be composited later. The horizon is low at 77 percent height in center, rises to 68 percent at left and right. Soft very dim cold-blue rim light only on rock edges, the rest stays near black. The whole scene is dark quiet luxury editorial, not a science-fiction planet landscape. No objects, no coffee machine, no coffee beans, no text, no logos, no lens flares, no sparkles. The center and upper region remain nearly black negative space. Full opaque image, no checkerboard.

### Dawn environment

Use case: lighting-weather. Edit the latest generated landscape image into the matching dawn endpoint for the SAME website scene. Preserve the exact camera, the rocky foreground, mountain silhouettes, and flat center platform positions. Change only sky and lighting: soft photographic warm golden sunrise emerging behind the distant horizon at x=36 percent, y=76 percent, gentle pale warm sun just above horizon, distant layer of soft clouds and haze, sky from muted pale blue at top through creamy gold near horizon. Foreground remains charcoal-black rocks, now with restrained gold light on edges, no bright orange. Photorealistic luxury product-film environment, subtle natural lens glow only around horizon. No machine, no product, no lettering, no UI, no additional objects, no checkerboard. Same landscape aspect ratio and full opaque background.
