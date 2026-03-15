# Plan: Scroll Hijacking + WebGL Distortion Overhaul for The Assembly

## TL;DR
Replace standard vertical scrolling with GSAP Observer-driven, full-page slide transitions powered by a custom GLSL distortion shader overlaid on a global Canvas. Each slide transition will follow a strict sequence: 0.5s delay → 0.6s distortion animation (noise-based displacement) → instant section swap with model repositioning. The 3D models (PC rig for hero/philosophy, processor for problem/lineup) will pre-animate into position during the delay, appearing aligned when distortion fades. Mobile devices will bypass hijacking entirely and use native scrolling.

---

## Steps

### **PHASE 1: Custom GLSL Shader**
1. Create `/src/components/DistortionShader.glsl` (fragment shader)
   - Input: `uTime` (animates 0→1), `uIntensity` (0→1 during transition), `uNoiseTexture` (perlin/fractal noise)
   - Output: Displaces screen coordinates via `fragCoord += vec2(sin(fragCoord.y * 3.0 + uTime), cos(fragCoord.x * 2.0)) * uIntensity * 10.0`
   - Use Simplex or Perlin noise lookup for organic distortion (not sin/cos alone)
   - Preserve alpha channel for clean transitions

2. Create `/src/components/DistortionMaterial.tsx`
   - Wrap GLSL into `THREE.ShaderMaterial`
   - Expose uniforms: `uTime`, `uIntensity`, `uTexture` (render target), `uNoise`
   - Generate or load noise texture (64x64 fractal noise PNG or procedural via canvas)

### **PHASE 2: Global Distortion Overlay Canvas**
3. Create `/src/components/DistortionEffectCanvas.tsx`
   - Full-screen Canvas positioned `fixed top-0 left-0 w-full h-full pointer-events-none z-50`
   - Renders a single plane quad with DistortionMaterial
   - Captures the full window as texture (via offscreenCanvas or PostProcessing layer)
   - **Dependence**: Requires shader from Phase 1
   - Export `useDistortion()` Hook: `{ animateDistortion: (duration: number) => void }`

4. Create Zustand store `/src/store/usePageSlideStore.ts`
   - State: `currentSlide` (0-6), `isTransitioning`, `targetSlide`
   - Actions: `setSlide(index)`, `startTransition(targetIndex)`, `endTransition()`
   - Derived: `slideData` array (position/rotation for each 3D model per slide)

### **PHASE 3: Scroll Hijacking Logic**
5. Refactor `/src/app/page.tsx`
   - Remove Lenis provider (we're managing scroll ourselves)
   - Add scroll lock (disable wheel/touch events during transition)
   - Implement GSAP Observer:
     ```
     gsap.Observer.create({
       type: "wheel,touch,pointer",
       onDown: () => {
         if (isTransitioning) return; // Lock input
         targetSlide = clamp(currentSlide - 1, 0, totalSlides - 1);
         executeSlideTransition(currentSlide, targetSlide);
       },
       onUp: () => {
         if (isTransitioning) return;
         targetSlide = clamp(currentSlide + 1, 0, totalSlides - 1);
         executeSlideTransition(currentSlide, targetSlide);
       },
     });
     ```
   - **Dependence**: PHASE 2 (Zustand store + DistortionEffectCanvas)

6. Implement slide transition function:
   ```
   executeSlideTransition(from, to):
     1. setIsTransitioning(true)
     2. DELAY 0.5s: GSAP animates 3D model to new position/rotation (in parallel)
     3. DISTORTION: Call useDistortion().animateDistortion(0.6s) [intensity 0→1→0]
     4. IMMEDIATELY (during max distortion): Hide 'from' section, show 'to' section
     5. After 0.6s: setCurrentSlide(to), setIsTransitioning(false)
     Total duration: 0.5s + 0.6s = 1.1s
   ```

### **PHASE 4: Slide Architecture Refactor**
7. Restructure page content into slides:
   - Each section (Hero, Problem, Philosophy, Lineup, Engineering, Capabilities, CTA) becomes **absolutely positioned 100vh/100vw slide**
   - Move outside normal DOM flow (position: fixed + top: 0, left: 0, width: 100vw, height: 100vh)
   - Wrap sections in `<SlideContainer>` component that handles show/hide via opacity + pointer-events
   - Assign slide indices: Hero=0, Problem=1, Philosophy=2, Lineup=3, Engineering=4, Capabilities=5, CTA=6

8. 3D Model Repositioning:
   - Define `slideData`: for each slide, specify Camera position, Model position, Model rotation
   - Create GSAP timeline that animates models during the 0.5s delay:
     - Hero (slide 0): PC rig center-screen (`position: [0, 0, 0], rotation: [0, 0.3, 0]`)
     - Problem (slide 1): Processor large bottom-right (`position: [4, -3, -2], rotation: [0.2, 0.5, 0]`)
     - Philosophy (slide 2): PC rig slightly left (`position: [-2, 1, 0], rotation: [0, -0.2, 0]`)
     - Lineup (slide 3): Processor centered high (`position: [0, 4, -3], rotation: [-0.3, 0, 0]`)
     - Engineering (slide 4): Mix or hide (keep from previous or fade out)
     - Capabilities (slide 5): Hide 3D
     - CTA (slide 6): PC rig hero again
   - **Dependence**: Requires refactored slide structure (step 7)

### **PHASE 5: Mobile Bypass**
9. Add `useMediaQuery` or Tailwind's `@media (max-width: 768px)`:
   - On mobile: Set `document.body.style.overflow = "auto"`, unregister Observer
   - Render fallback: Hide Canvas, hide distortion effect
   - Keep sections as normal vertically-stacked blocks (revert to native scroll)
   - Breakpoint: 768px (md in Tailwind)

### **PHASE 6: Integration & Testing**
10. Update layout.tsx:
    - Wrap page with `DistortionEffectCanvas` + Zustand provider
    - Remove LenisProvider
    - Add `overflow-hidden` to body in globals.css (to prevent default scroll)

11. Finalize timing & easing:
    - Transition delay: 0.5s (ease-in-out for natural pause)
    - Distortion anim: 0.6s (Linear or ease-in-out for smooth wave)
    - Model position: 0.5s (expo.inOut for snappy repositioning)
    - All timings configurable via constants at top of page.tsx

---

## Relevant Files

**To Create:**
- `src/components/DistortionShader.glsl` — GLSL fragment shader with noise-based displacement
- `src/components/DistortionMaterial.tsx` — THREE.ShaderMaterial wrapper
- `src/components/DistortionEffectCanvas.tsx` — Global fixed Canvas overlay
- `src/store/usePageSlideStore.ts` — Zustand store for slide state
- `src/utils/slideConfig.ts` — Slide metadata (camera, model positions/rotations per slide)

**To Modify:**
- `src/app/page.tsx` — Refactor into absolute-positioned slides, add GSAP Observer, implement transition logic
- `src/app/layout.tsx` — Wrap with providers (Zustand, DistortionEffectCanvas)
- `src/app/globals.css` — Add `body { overflow: hidden }` (with mobile exception)
- `src/components/Hero3D.tsx` — Add GSAP animation targets for position/rotation
- `src/components/Processor3D.tsx` — Add GSAP animation targets for position/rotation
- `package.json` — Add `@react-three/postprocessing` (optional, for texture capture) or use manual render target

**Dependencies to Install:**
- `zustand` — State management
- `@react-three/postprocessing` — (Optional) For easier render-to-texture
- No additional Three.js plugins needed (ShaderMaterial is built-in)

---

## Verification

### **Unit / Component Tests**
1. **Shader Test**: Load DistortionShader in a simple test Canvas, verify uniforms animate and distortion is visible
2. **Store Test**: Zustand store transitions correctly between slide states without race conditions
3. **Observer Test**: GSAP Observer fires only when scroll events occur, correctly locks during transition
4. **Canvas Test**: DistortionEffectCanvas renders over page content without blocking interaction (pointer-events: none)

### **Integration Tests**
5. **Full Transition Flow**: 
   - Scroll down from slide 0 → slide 1
   - Verify: 0.5s delay → distortion animates → section swaps → distortion clears
   - Verify: No input accepted during 1.1s transition
   - Verify: 3D model repositions during delay, visible when distortion ends

6. **Boundary Tests**:
   - Scroll up at slide 0 (should be no-op)
   - Scroll down at slide 6 (should be no-op)
   - Rapid scroll clicks (should queue or ignore, not break)

7. **Mobile Breakpoint Test**:
   - Resize to <768px → Observer unregisters, native scroll enabled
   - Resize to >768px → Observer re-registers
   - Canvas should not render on mobile

### **Visual / Manual Tests**
8. **Distortion Effect Quality**:
   - Verify distortion is organic (perlin-based), not jarring
   - Confirm intensity curve is smooth (0→1→0, not stepped)
   - Check no visible seams when distortion clears

9. **Model Animations**:
   - Each slide's 3D model arrives in correct position/rotation
   - Transitions are fluid, no jumps or rotation conflicts
   - Models don't clip with UI text

10. **Performance Check**:
    - Monitor FPS during transitions (target: 60fps on desktop)
    - Check GPU memory usage (Canvas + shader + render target)
    - Verify no memory leaks with repeated transitions

---

## Decisions & Scope Boundaries

### Decisions Made
1. **Global Canvas + Fixed Positioning**: Simplifies z-index management, ensures distortion effect applies uniformly
2. **Zustand over Context**: Better performance for frequent slide state updates, extensible for other pages
3. **Strict Timing (0.5s + 0.6s)**: Predictable UX, can be tuned later without architectural changes
4. **Mobile Exclusion**: Scroll hijacking on mobile adds complexity + poor UX; native scrolling is safer
5. **Model Repositioning During Delay**: User won't see jarring model jumps when transition completes

### Included in Scope
✅ Custom GLSL distortion shader  
✅ GSAP Observer scroll hijacking  
✅ Zustand state management  
✅ 3D model position/rotation per slide  
✅ Mobile bypass  
✅ Full transition timing (0.5s delay + 0.6s effect)  
✅ Input locking during transition  

### Deliberately Excluded
❌ Multi-device gesture (pinch-zoom) — handled by Observer by default  
❌ Keyboard navigation (arrow keys) — can be added later, not core MVP  
❌ Analytics/tracking for slide changes — orthogonal, add after launch  
❌ Back/forward browser history — not required for MVP, can extend later  
❌ Scroll position restoration — full-page slides make this moot  

---

## Further Considerations

1. **Noise Texture vs. Procedural Generation**
   - Option A (Recommended): Pre-generate 64x64 Perlin noise PNG, embed in public/ (simplest, no JS overhead)
   - Option B: Use `THREE.CanvasTexture` with procedural noise in JavaScript (more flexible, slower to init)
   - Recommendation: Start with pre-generated PNG for launch speed; upgrade to procedural if dynamic effects needed

2. **Render Target Texture Capture**
   - Option A (Simpler): Use `@react-three/postprocessing` + `Texture` component (abstraction, less control)
   - Option B (More Control): Manual THREE.WebGLRenderTarget (lower-level, full flexibility)
   - Recommendation: Start with manual RenderTarget for cleaner control over distortion layer

3. **3D Model Scale/Position Complexity**
   - Current: Hero3D and Processor3D have internal `PresentationControls` which may conflict with GSAP animations
   - Recommendation: Disable or remove PresentationControls from these components once integrated; use only GSAP for camera/model motion

---

## Implementation Order (Dependencies)

**Batch 1 (Parallel):**
- Create shader + material (Phase 1)
- Create slideConfig (Phase 4, step 8)
- Create Zustand store (Phase 2, step 4)

**Batch 2 (After Batch 1):**
- Create DistortionEffectCanvas (Phase 2, step 3)

**Batch 3 (After Batch 2):**
- Refactor page.tsx with Observer (Phase 3, step 5)
- Implement transition function (Phase 3, step 6)

**Batch 4 (Parallel with Batch 3):**
- Refactor slide architecture (Phase 4, step 7)
- Update 3D components for animation targets (Phase 4, step 8)

**Batch 5 (Final):**
- Mobile bypass (Phase 5, step 9)
- Layout + provider setup (Phase 6, step 10)
- Testing & refinement (Phase 6, step 11)
