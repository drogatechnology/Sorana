import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logoSvg from "@/assets/logo/Sorana-Logo.svg";
import aboutVideoSrc from "@/assets/video-about/220941_medium.mp4";

// ── WebGL shaders for fluid cursor displacement ──────────────────────────────
const VERT_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

// Pass 1 – update displacement texture (ping-pong)
const DISP_FRAG_SRC = `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    // Decode previous displacement from [0,1] -> [-1,1]
    vec2 prev = texture2D(uPrev, vUv).rg * 2.0 - 1.0;

    // Decay toward zero
    prev *= 0.955;

    // Cursor brush: Gaussian falloff, aspect-corrected
    vec2 delta = vec2((vUv.x - uMouse.x) * uAspect, vUv.y - uMouse.y);
    float dist  = length(delta);
    float brush = exp(-dist * dist / 0.0055);

    // Paint velocity into displacement
    prev += uVelocity * brush * 4.5;
    prev  = clamp(prev, -1.0, 1.0);

    // Encode [-1,1] -> [0,1]
    gl_FragColor = vec4(prev * 0.5 + 0.5, 0.0, 1.0);
  }
`;

// Pass 2 – render video through displacement
const RENDER_FRAG_SRC = `
  precision highp float;
  uniform sampler2D uVideo;
  uniform sampler2D uDisp;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    // Decode displacement
    vec2 disp = texture2D(uDisp, vUv).rg * 2.0 - 1.0;

    // Correct for aspect ratio so warp is isotropic
    disp.x /= uAspect;

    float dispLen = length(disp);

    // Chromatic aberration: R/G/B channels offset slightly
    float ca = dispLen * 0.007;
    vec2  uv  = vUv + disp * 0.055;

    float r = texture2D(uVideo, uv + vec2(ca,  0.0)).r;
    float g = texture2D(uVideo, uv              ).g;
    float b = texture2D(uVideo, uv - vec2(ca,  0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

// --- Image imports: images from the same folder are always kept as a pair ---
import tempered1   from "@/assets/glasses/tempered/pexels-joerg-hartmann-626385254-20677918.jpg";
import tempered2   from "@/assets/glasses/tempered/pexels-noahdwilke-68724.jpg";
import frosted1    from "@/assets/glasses/frosted/beau-carpenter-EMSoTmhcm3g-unsplash.jpg";
import frosted2    from "@/assets/glasses/frosted/tsuyoshi-kozu-aYI9KmlyWF8-unsplash.jpg";
import frameless1  from "@/assets/glasses/frameless/marina-nazina-nP9e3fu9O1k-unsplash.jpg";
import frameless2  from "@/assets/glasses/frameless/pexels-artbovich-6436749.jpg";
import shower1     from "@/assets/glasses/shower/pexels-artbovich-7546284.jpg";
import shower2     from "@/assets/glasses/shower/pexels-artbovich-8082556.jpg";
import laminated1  from "@/assets/glasses/laminated/eiichi-hirakawa-q_FWWQCPTNw-unsplash.jpg";
import laminated2  from "@/assets/glasses/laminated/martin-bollero-oepMVk65V3g-unsplash.jpg";
import autoglass1  from "@/assets/glasses/autoglass/pexels-introspectivedsgn-4839258.jpg";
import autoglass2  from "@/assets/glasses/autoglass/pexels-uk-car-glass-222332278-11950154.jpg";
import bulletproof1 from "@/assets/glasses/bulletproof/eiichi-hirakawa-q_FWWQCPTNw-unsplash (1).jpg";
import bulletproof2 from "@/assets/glasses/bulletproof/pexels-haberdoedas-33530415.jpg";
import printed1    from "@/assets/glasses/printed/annie-spratt-RAsj_sLQbJ0-unsplash.jpg";
import printed2    from "@/assets/glasses/printed/pexels-macb25-18836811.jpg";
import sandblasted1 from "@/assets/glasses/sandblasted/hung-nguyen-6vve9yyicyc-unsplash.jpg";
import sandblasted2 from "@/assets/glasses/sandblasted/pexels-kassiamelox-14303756.jpg";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
// Must match LoadingScreen total animation time (2200ms stage1 + 1200ms split = 3400ms)
const LOADING_DURATION = 3400;

type PairEntry = { imgs: [string, string]; name: string; category: string };

/** Each pair = two images from the same folder + metadata */
const ALL_PAIRS: PairEntry[] = [
  { imgs: [tempered1,    tempered2],    name: "Tempered Glass",      category: "Architectural" },
  { imgs: [frosted1,     frosted2],     name: "Frosted Glass",        category: "Decorative"    },
  { imgs: [frameless1,   frameless2],   name: "Frameless Partitions", category: "Interior"      },
  { imgs: [shower1,      shower2],      name: "Shower Enclosures",    category: "Bathroom"      },
  { imgs: [laminated1,   laminated2],   name: "Laminated Glass",      category: "Security"      },
  { imgs: [autoglass1,   autoglass2],   name: "Auto Glass",           category: "Automotive"    },
  { imgs: [bulletproof1, bulletproof2], name: "Bulletproof Glass",    category: "Security"      },
  { imgs: [printed1,     printed2],     name: "Printed Glass",        category: "Decorative"    },
  { imgs: [sandblasted1, sandblasted2], name: "Sandblasted Glass",    category: "Frosted"       },
];

// Strip layout: three rows. Middle strip (index 1) is the one that un-rotates on scroll.
const STRIPS = [
  { start: 0, dir:  1, speed: 38 },
  { start: 3, dir: -1, speed: 30 },
  { start: 6, dir:  1, speed: 44 },
] as const;

// Each image: 230×310 px  |  within-pair gap: 10 px  |  between-pair gap: 16 px
// 6 pairs per strip → CYCLE = 6×(230+10+230) + 5×16 + 16 = 2916 px
const CYCLE_PX = 2916;

function buildStripPairs(start: number, count = 6): PairEntry[] {
  return Array.from({ length: count }, (_, i) => ALL_PAIRS[(start + i) % ALL_PAIRS.length]);
}

// Number of additional product showcases after the initial reveal
const EXTRA_STEPS = 2;

// Products end at 500vh (2 + 2*1.5). About panel runs 500–700vh. Buffer 80vh → 780vh total.
// Increased to 880 to allow the about panel to breathe before the services section slides up.
const TOTAL_VH = 850;

export function HeroSection() {
  // ── DOM refs ──────────────────────────────────────────────────────────────
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const heroRef            = useRef<HTMLElement>(null);
  const stripsWrapperRef   = useRef<HTMLDivElement>(null);
  const clonePairRef       = useRef<HTMLDivElement>(null);
  const overlayRef         = useRef<HTMLDivElement>(null);
  const contentRef         = useRef<HTMLDivElement>(null);
  const scrimRef           = useRef<HTMLDivElement>(null);

  // Expanded view refs
  const infoCardRef          = useRef<HTMLDivElement>(null);
  const infoCardInnerRef     = useRef<HTMLDivElement>(null);

  // About panel refs
  const aboutPanelRef        = useRef<HTMLDivElement>(null);
  const aboutVideoRef        = useRef<HTMLVideoElement>(null);
  const aboutContentRef      = useRef<HTMLDivElement>(null);
  const aboutVideoWrapperRef = useRef<HTMLDivElement>(null);
  const glCanvasRef          = useRef<HTMLCanvasElement>(null);

  // WebGL state refs
  const glRef        = useRef<WebGLRenderingContext | null>(null);
  const glStateRef   = useRef<{
    dispProg:    WebGLProgram;
    renderProg:  WebGLProgram;
    fbo:         [WebGLFramebuffer, WebGLFramebuffer];
    tex:         [WebGLTexture, WebGLTexture];
    videoTex:    WebGLTexture;
    quad:        WebGLBuffer;
    ping:        number; // 0 or 1 — which FBO is the "current" target
    mouse:       [number, number];
    prevMouse:   [number, number];
    velocity:    [number, number];
    rafId:       number;
    active:      boolean;
  } | null>(null);

  // Scroll-state tracking
  const hasFoundCenterRef     = useRef(false);
  const activePairRef         = useRef<HTMLElement | null>(null);
  const startWrapperOffsetRef = useRef({ x: 0, y: 0 });
  const timerRef              = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const initialPairIdxRef     = useRef(0);
  const extraPairsRef         = useRef<PairEntry[]>([]);

  // ── GSAP setup ───────────────────────────────────────────────────────────
  useEffect(() => {
    // Pick pairs that correspond to the visual middle strip so we can map them
    const middlePairs = buildStripPairs(3);

    const ctx = gsap.context(() => {
      // Hero text entrance (fires after loading screen clears)
      const els = contentRef.current?.querySelectorAll<HTMLElement>(".hero-animate");
      if (els?.length) {
        gsap.set(els, { opacity: 0, y: 36 });
        timerRef.current = setTimeout(() => {
          gsap.to(els, { opacity: 1, y: 0, stagger: 0.14, duration: 1, ease: "power3.out" });
        }, LOADING_DURATION + 100);
      }

      // Set initial state for the info card
      gsap.set(infoCardRef.current, {
        xPercent:        -50,
        yPercent:        -50,
        height:          1,
        autoAlpha:       0,
        transformOrigin: "50% 50%",
      });
      gsap.set(infoCardInnerRef.current, { autoAlpha: 0 });
      // Clone starts invisible but stays in the render tree
      gsap.set(clonePairRef.current, { autoAlpha: 0 });

      // ── Main scroll-driven animation ──────────────────────────────────────
      const scrollProxy = { p: 0 };
      const proxyTween = gsap.to(scrollProxy, {
        p: 1,
        ease: "none",
        paused: true,
        onUpdate: () => {
          const p = scrollProxy.p; // 0 → 1

          // ─ Phase 1 (p: 0 → 0.45): de-rotate strips, fade hero text ────────
          const p1 = Math.min(p / 0.45, 1);

          // Use autoAlpha so the nodes become pointer-events: none when fully faded
          gsap.set(overlayRef.current, { autoAlpha: 1 - p1 });
          gsap.set(scrimRef.current, { autoAlpha: 1 - p1 });
          gsap.set(contentRef.current, { autoAlpha: 1 - p1 });

          // ─ Phase 2 progress ───────────────────────────────────────────────
          const p2     = Math.max(0, (p - 0.45) / 0.55);
          const p2card = Math.max(0, (p2 - 0.35) / 0.65);

          // One-shot center-pair detection & freeze ─────────────────────────
          if (p > 0.005 && !hasFoundCenterRef.current) {
            hasFoundCenterRef.current = true;

            // 1. Pause CSS animation
            document.querySelectorAll<HTMLElement>(".hero-strip").forEach(el => {
              el.style.animationPlayState = "paused";
            });

            // 2. Temporarily apply exact Phase 1 end state to get straight geometries
            gsap.set(stripsWrapperRef.current, { rotate: 0, scale: 1 });

            const strips = document.querySelectorAll<HTMLElement>(".hero-strip");
            if (strips.length > 1) {
              const middleStrip = strips[1];
              const pairEls = Array.from(middleStrip.querySelectorAll<HTMLElement>(".hero-pair"));

              const cx = document.documentElement.clientWidth / 2;
              const cy = window.innerHeight / 2;

              let bestIdx = 0;
              let bestDist = Infinity;
              pairEls.forEach((el, idx) => {
                const r = el.getBoundingClientRect();
                const dist = Math.hypot(r.left + r.width / 2 - cx, r.top + r.height / 2 - cy);
                if (dist < bestDist) { bestDist = dist; bestIdx = idx; }
              });

              const targetPairEl = pairEls[bestIdx];
              activePairRef.current = targetPairEl;
              targetPairEl.classList.add("is-active");

              initialPairIdxRef.current = bestIdx % middlePairs.length;

              // Pick random extras — different from initial
              const available = ALL_PAIRS.filter((_, i) => i !== initialPairIdxRef.current);
              const shuffled = [...available].sort(() => Math.random() - 0.5);
              extraPairsRef.current = shuffled.slice(0, EXTRA_STEPS);

              // Calculate translation needed to center this exact pair
              const r = targetPairEl.getBoundingClientRect();
              startWrapperOffsetRef.current = {
                x: cx - (r.left + r.width / 2),
                y: cy - (r.top + r.height / 2)
              };

              // Populate clone images for seamless handoff
              const imgs = targetPairEl.querySelectorAll("img");
              const cloneImgs = clonePairRef.current?.querySelectorAll("img");
              if (cloneImgs && cloneImgs.length === 2 && imgs.length === 2) {
                cloneImgs[0].src = imgs[0].src;
                cloneImgs[1].src = imgs[1].src;
              }

              // Populate Card Text and Wipe Images
              const entry = middlePairs[bestIdx % middlePairs.length];
              const textGroups = document.querySelectorAll<HTMLElement>(".hero-card-text-group");
              
              if (textGroups[0]) {
                const tl = textGroups[0].querySelector(".hero-card-tl");
                const bl = textGroups[0].querySelector(".hero-card-bl");
                if (tl) tl.textContent = entry.name;
                if (bl) bl.textContent = entry.category;
              }

              const wipeLayers = document.querySelectorAll<HTMLElement>(".hero-slide-layer");
              extraPairsRef.current.forEach((pair, i) => {
                const layer = wipeLayers[i];
                if (layer) {
                  const imgL = layer.querySelector(".hero-slide-img-left") as HTMLImageElement;
                  const imgR = layer.querySelector(".hero-slide-img-right") as HTMLImageElement;
                  if (imgL) imgL.src = pair.imgs[0];
                  if (imgR) imgR.src = pair.imgs[1];
                }
                const group = textGroups[i + 1];
                if (group) {
                  const tl = group.querySelector(".hero-card-tl");
                  const bl = group.querySelector(".hero-card-bl");
                  if (tl) tl.textContent = pair.name;
                  if (bl) bl.textContent = pair.category;
                }
              });
            }
          }

          // Revert if scrolled back to top ──────────────────────────────────
          if (p <= 0.005 && hasFoundCenterRef.current) {
            hasFoundCenterRef.current = false;
            document.querySelectorAll<HTMLElement>(".hero-strip").forEach((el) => {
              el.style.animationPlayState = "running";
            });
            if (activePairRef.current) {
               activePairRef.current.classList.remove("is-active");
               activePairRef.current = null;
            }
          }

          // Apply Phase 1 transforms — runs every frame unconditionally ─────
          gsap.set(stripsWrapperRef.current, {
            rotate: gsap.utils.interpolate(-25, 0, p1),
            scale:  gsap.utils.interpolate(1.8, 1, p1),
          });

          // ─ Phase 2 (p: 0.45 → 1.0): expand clone pair + reveal card ──────
          const bodyW    = document.documentElement.clientWidth;
          const isMobile = bodyW < 768;

          if (p2 > 0 && hasFoundCenterRef.current && clonePairRef.current && activePairRef.current) {
            const windowH  = window.innerHeight;
            
            const origCx = bodyW / 2 - startWrapperOffsetRef.current.x;
            const origCy = windowH / 2 - startWrapperOffsetRef.current.y;
            
            // Initial grid image dimensions and gap
            const startW   = 230;
            const startH   = 310;
            const startGap = 10;
            
            // Start positions (centers) - perfectly matches the side-by-side grid
            const img1StartCx = origCx - startW / 2 - startGap / 2;
            const img1StartCy = origCy;
            const img2StartCx = origCx + startW / 2 + startGap / 2;
            const img2StartCy = origCy;

            let img1TargetCx, img1TargetCy, img1TargetW, img1TargetH;
            let img2TargetCx, img2TargetCy, img2TargetW, img2TargetH;

            if (isMobile) {
              // Mobile: animate to stacked top/bottom
              img1TargetW = bodyW;
              img1TargetH = windowH / 2;
              img1TargetCx = bodyW / 2;
              img1TargetCy = windowH / 4;

              img2TargetW = bodyW;
              img2TargetH = windowH / 2;
              img2TargetCx = bodyW / 2;
              img2TargetCy = windowH * 3 / 4;
            } else {
              // Desktop: animate to side-by-side
              img1TargetW = bodyW / 2;
              img1TargetH = windowH;
              img1TargetCx = bodyW / 4;
              img1TargetCy = windowH / 2;

              img2TargetW = bodyW / 2;
              img2TargetH = windowH;
              img2TargetCx = bodyW * 3 / 4;
              img2TargetCy = windowH / 2;
            }

            // Smoothly interpolate center coordinates and dimensions
            const img1W  = gsap.utils.interpolate(startW, img1TargetW, p2);
            const img1H  = gsap.utils.interpolate(startH, img1TargetH, p2);
            const img1Cx = gsap.utils.interpolate(img1StartCx, img1TargetCx, p2);
            const img1Cy = gsap.utils.interpolate(img1StartCy, img1TargetCy, p2);

            const img2W  = gsap.utils.interpolate(startW, img2TargetW, p2);
            const img2H  = gsap.utils.interpolate(startH, img2TargetH, p2);
            const img2Cx = gsap.utils.interpolate(img2StartCx, img2TargetCx, p2);
            const img2Cy = gsap.utils.interpolate(img2StartCy, img2TargetCy, p2);

            const imgs = clonePairRef.current.querySelectorAll("img");
            if (imgs.length === 2) {
              gsap.set(imgs[0], { 
                position: 'absolute',
                width: img1W, 
                height: img1H,
                left: img1Cx - img1W / 2,
                top: img1Cy - img1H / 2
              });
              gsap.set(imgs[1], { 
                position: 'absolute',
                width: img2W, 
                height: img2H,
                left: img2Cx - img2W / 2,
                top: img2Cy - img2H / 2
              });
            }

            // Container becomes a simple fullscreen absolute container
            gsap.set(clonePairRef.current, { 
              left: 0, 
              top: 0, 
              width: '100%', 
              height: '100%', 
              autoAlpha: 1 
            });

            // Fade out the entire grid seamlessly to reveal the clone
            gsap.set(stripsWrapperRef.current, {
              opacity: Math.max(0, 1 - (p2 * 5))
            });
          } else if (p2 <= 0) {
            gsap.set(clonePairRef.current, { autoAlpha: 0 });
            gsap.set(stripsWrapperRef.current, { opacity: 1 });
          }

          // On mobile the card completes its reveal at 75% of Phase 2 so the
          // scrub-lag never leaves it visually "half-filled" when slide wipes begin.
          const p2cardFinal = isMobile
            ? Math.min(1, Math.max(0, p2 / 0.75))
            : p2card;

          gsap.set(infoCardRef.current, {
            height:    `${Math.max(1, p2cardFinal * 140)}px`,
            autoAlpha: Math.min(p2cardFinal * 2, 1),
          });
          gsap.set(infoCardInnerRef.current, {
            autoAlpha: Math.max(0, (p2cardFinal - 0.45) / 0.55),
          });
        },
      });

      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start:   "top top",
        end:     `+=${window.innerHeight * 2}`,  // first 200vh
        scrub:   1.5,
        animation: proxyTween,
      });

      // ── Slideshow Wipes & Info Card Swiping (Mersi-Style) ────────────────────────
      const HOLD_STEPS = 0.6; // Extra progress to hold the final product at the end
      const stepSize = 1 / (EXTRA_STEPS + HOLD_STEPS);
      
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start:   `top+=${window.innerHeight * 2} top`,
        end:     `top+=${window.innerHeight * (2 + EXTRA_STEPS * 1.5)} top`, // extended end duration
        scrub:   1.2,
        snap: {
          snapTo: (value) => {
            // If the user has scrolled past the final transition (into the hold zone), don't snap
            if (value > stepSize * EXTRA_STEPS + 0.05) return value;
            // Otherwise snap to the nearest step (0, stepSize, stepSize * 2)
            const step = Math.round(value / stepSize);
            return step * stepSize;
          },
          duration: { min: 0.2, max: 0.6 },
          ease: "power2.inOut"
        },
        onUpdate: (self) => {
          const sp = self.progress; // 0 → 1
          
          // 1. Image Wipe Animations
          const wipeLayers = document.querySelectorAll<HTMLElement>(".hero-slide-layer");
          wipeLayers.forEach((layer, i) => {
             const layerStart = i * stepSize;
             const layerEnd = (i + 1) * stepSize;
             
             let p = 0;
             if (sp <= layerStart) p = 0;
             else if (sp >= layerEnd) p = 1;
             else p = (sp - layerStart) / stepSize;
             
             const eased = gsap.utils.clamp(0, 1, p);
             
             const leftWipe = layer.querySelector<HTMLElement>(".hero-slide-wipe-left");
             const rightWipe = layer.querySelector<HTMLElement>(".hero-slide-wipe-right");
             
             if (leftWipe) leftWipe.style.height = `${eased * 100}%`;
             if (rightWipe) rightWipe.style.height = `${eased * 100}%`;
          });

          // 2. Info Card Layer Wipe Animations
          // On mobile: card wipe completes at 50% of the step so the card feels
          // snappy right when the user starts each new product step — eliminating
          // the "half-filled, keep scrolling" sensation caused by scrub lag.
          const isMobileCard = window.innerWidth < 768;
          const cardStepEnd  = isMobileCard ? 0.5 : 1.0; // fraction of stepSize

          const cardLayers = document.querySelectorAll<HTMLElement>(".hero-info-card-layer");
          cardLayers.forEach((layer, i) => {
            if (i === 0) return; // Base layer is always fully unclipped

            // The transition for layer i happens during step i-1
            const layerStart = (i - 1) * stepSize;
            const layerEnd   = (i - 1) * stepSize + stepSize * cardStepEnd;

            let p = 0;
            if (sp <= layerStart) p = 0;
            else if (sp >= layerEnd) p = 1;
            else p = (sp - layerStart) / (stepSize * cardStepEnd);

            const eased = gsap.utils.clamp(0, 1, p);

            // Wipe from top to bottom: inset(0 0 100% 0) -> inset(0 0 0 0)
            layer.style.clipPath = `inset(0 0 ${100 - eased * 100}% 0)`;

            // Manage pointer events: only the topmost visible layer should be interactive
            if (eased > 0.5 && p < 1) {
              layer.style.pointerEvents = 'auto';
            } else if (eased === 1) {
              layer.style.pointerEvents = 'auto';
            } else {
               layer.style.pointerEvents = 'none';
            }
          });
          
          // Ensure base layer pointer events are turned off if layer 1 is active
          const baseLayer = cardLayers[0];
          if (baseLayer) {
            baseLayer.style.pointerEvents = sp > (stepSize * cardStepEnd * 0.5) ? 'none' : 'auto';
          }
        },
      });

      // ── About Panel Reveal (Step 4) ──────────────────────────────────────
      // Products ST ends at (2 + EXTRA_STEPS * 1.5) = 5 viewport heights
      const ABOUT_START_VH = 2 + EXTRA_STEPS * 1.25;
      ScrollTrigger.create({
        trigger: scrollContainerRef.current,
        start:   `top+=${window.innerHeight * ABOUT_START_VH} top`,
        end:     `top+=${window.innerHeight * (ABOUT_START_VH + 2)} top`,
        scrub:   1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const isMobile = window.innerWidth < 768;
          
          // White panel slides in from LEFT on desktop (clip right edge), BOTTOM on mobile (clip top edge)
          if (aboutPanelRef.current) {
            aboutPanelRef.current.style.clipPath = isMobile
              ? `inset(${100 - p * 100}% 0 0 0)` // wipes UP from bottom
              : `inset(0 ${100 - p * 100}% 0 0)`; // wipes RIGHT from left
            aboutPanelRef.current.style.pointerEvents = p > 0.5 ? 'auto' : 'none';
          }
          // Canvas (and hidden video) wipe in from RIGHT on desktop, TOP on mobile
          const clipVal = isMobile
            ? `inset(0 0 ${100 - p * 100}% 0)` // wipes DOWN from top
            : `inset(0 0 0 ${100 - p * 100}%)`; // wipes LEFT from right
            
          if (aboutVideoRef.current)  aboutVideoRef.current.style.clipPath  = clipVal;
          if (glCanvasRef.current)    glCanvasRef.current.style.clipPath    = clipVal;
          // Enable cursor interactions on video wrapper when visible
          if (aboutVideoWrapperRef.current) {
            aboutVideoWrapperRef.current.style.pointerEvents = p > 0.1 ? 'auto' : 'none';
          }
          // Content fades + rises in after panel is 65% revealed
          if (aboutContentRef.current) {
            const cP = Math.max(0, (p - 0.65) / 0.35);
            aboutContentRef.current.style.opacity = String(cP);
            aboutContentRef.current.style.transform = `translateY(${(1 - cP) * 22}px)`;
          }
        },
      });

    }, scrollContainerRef);

    return () => {
      clearTimeout(timerRef.current);
      ctx.revert();
    };
  }, []);

  // ── WebGL fluid displacement effect ─────────────────────────────────────
  const initWebGL = useCallback(() => {
    const canvas  = glCanvasRef.current;
    const video   = aboutVideoRef.current;
    if (!canvas || !video) return;

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    }) as WebGLRenderingContext | null;
    if (!gl) return;
    glRef.current = gl;

    // ── helpers ──
    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const mkProg = (vert: string, frag: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, mkShader(gl.VERTEX_SHADER,   vert));
      gl.attachShader(p, mkShader(gl.FRAGMENT_SHADER, frag));
      gl.linkProgram(p);
      return p;
    };
    const mkTex = (w: number, h: number, data?: Uint8Array) => {
      const t = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data ?? null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const mkFbo = (tex: WebGLTexture) => {
      const f = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return f;
    };

    const W = canvas.width;
    const H = canvas.height;

    // Build shaders & programs
    const dispProg   = mkProg(VERT_SRC, DISP_FRAG_SRC);
    const renderProg = mkProg(VERT_SRC, RENDER_FRAG_SRC);

    // Neutral displacement: rg = 0.5 (encodes 0 displacement)
    const neutral = new Uint8Array(W * H * 4);
    for (let i = 0; i < neutral.length; i += 4) {
      neutral[i] = 128; neutral[i+1] = 128; neutral[i+2] = 0; neutral[i+3] = 255;
    }

    const tex0     = mkTex(W, H, neutral);
    const tex1     = mkTex(W, H, neutral);
    const videoTex = mkTex(2, 2);
    const fbo0     = mkFbo(tex0);
    const fbo1     = mkFbo(tex1);

    // Full-screen quad
    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    glStateRef.current = {
      dispProg, renderProg,
      fbo:      [fbo0, fbo1],
      tex:      [tex0, tex1],
      videoTex,
      quad,
      ping:        0,
      mouse:       [0.5, 0.5],
      prevMouse:   [0.5, 0.5],
      velocity:    [0, 0],
      rafId:       0,
      active:      false,
    };

    const draw = () => {
      const st = glStateRef.current;
      if (!st || !glRef.current) return;
      const g = glRef.current;

      // Upload new video frame
      if (video.readyState >= 2) {
        g.bindTexture(g.TEXTURE_2D, st.videoTex);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, video);
      }

      // Velocity — smoothly blend toward raw velocity
      const rawVx = st.mouse[0] - st.prevMouse[0];
      const rawVy = st.mouse[1] - st.prevMouse[1];
      st.velocity[0] = st.velocity[0] * 0.82 + rawVx * 0.18 * 60;
      st.velocity[1] = st.velocity[1] * 0.82 + rawVy * 0.18 * 60;
      st.prevMouse[0] = st.mouse[0];
      st.prevMouse[1] = st.mouse[1];

      const aspect = W / H;
      const pong   = 1 - st.ping;

      // ── Pass 1: update displacement (render into pong) ──
      g.bindFramebuffer(g.FRAMEBUFFER, st.fbo[pong]);
      g.viewport(0, 0, W, H);
      g.useProgram(st.dispProg);

      g.bindBuffer(g.ARRAY_BUFFER, st.quad);
      const aPos1 = g.getAttribLocation(st.dispProg, 'aPos');
      g.enableVertexAttribArray(aPos1);
      g.vertexAttribPointer(aPos1, 2, g.FLOAT, false, 0, 0);

      g.activeTexture(g.TEXTURE0);
      g.bindTexture(g.TEXTURE_2D, st.tex[st.ping]);
      g.uniform1i(g.getUniformLocation(st.dispProg, 'uPrev'), 0);
      g.uniform2f(g.getUniformLocation(st.dispProg, 'uMouse'),    st.mouse[0], 1.0 - st.mouse[1]);
      g.uniform2f(g.getUniformLocation(st.dispProg, 'uVelocity'), st.velocity[0], -st.velocity[1]);
      g.uniform1f(g.getUniformLocation(st.dispProg, 'uAspect'),   aspect);

      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);

      // ── Pass 2: render video with displacement ──
      g.bindFramebuffer(g.FRAMEBUFFER, null);
      g.viewport(0, 0, W, H);
      g.useProgram(st.renderProg);

      g.bindBuffer(g.ARRAY_BUFFER, st.quad);
      const aPos2 = g.getAttribLocation(st.renderProg, 'aPos');
      g.enableVertexAttribArray(aPos2);
      g.vertexAttribPointer(aPos2, 2, g.FLOAT, false, 0, 0);

      g.activeTexture(g.TEXTURE0);
      g.bindTexture(g.TEXTURE_2D, st.videoTex);
      g.uniform1i(g.getUniformLocation(st.renderProg, 'uVideo'), 0);

      g.activeTexture(g.TEXTURE1);
      g.bindTexture(g.TEXTURE_2D, st.tex[pong]);
      g.uniform1i(g.getUniformLocation(st.renderProg, 'uDisp'),  1);
      g.uniform1f(g.getUniformLocation(st.renderProg, 'uAspect'), aspect);

      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);

      // Swap ping-pong
      st.ping = pong;
      st.rafId = requestAnimationFrame(draw);
    };

    // Kick off the render loop
    const st = glStateRef.current!;
    st.rafId = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const wrapper = aboutVideoWrapperRef.current;
    const canvas  = glCanvasRef.current;
    if (!wrapper || !canvas) return;

    // Match canvas pixel size to wrapper
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width  = Math.round(width);
        canvas.height = Math.round(height);
        // Re-init WebGL when size changes significantly
        if (glStateRef.current) {
          cancelAnimationFrame(glStateRef.current.rafId);
          glStateRef.current = null;
          glRef.current = null;
        }
        initWebGL();
      }
    });
    ro.observe(wrapper);

    // Pointer tracking — store UV coords inside the wrapper
    const onMove = (e: PointerEvent) => {
      const st = glStateRef.current;
      if (!st) return;
      const rect = wrapper.getBoundingClientRect();
      st.mouse[0] = (e.clientX - rect.left) / rect.width;
      st.mouse[1] = (e.clientY - rect.top)  / rect.height;
    };

    wrapper.addEventListener('pointermove', onMove as EventListener);

    return () => {
      ro.disconnect();
      wrapper.removeEventListener('pointermove', onMove as EventListener);
      if (glStateRef.current) {
        cancelAnimationFrame(glStateRef.current.rafId);
        glStateRef.current = null;
        glRef.current = null;
      }
    };
  }, [initWebGL]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={scrollContainerRef} style={{ height: `${TOTAL_VH}vh` }}>
      <section
        ref={heroRef}
        id="hero"
        className="relative h-screen overflow-hidden bg-foreground"
        style={{ position: "sticky", top: 0 }}
      >
        {/* ── Diagonal image strips ──────────────────────────────────────────── */}
        <div ref={stripsWrapperRef} className="hero-strips-wrapper">
          {STRIPS.map((strip, si) => {
            const base     = buildStripPairs(strip.start);
            const allPairs = [...base, ...base]; // duplicate for seamless loop

            return (
              <div
                key={si}
                className={`hero-strip ${strip.dir > 0 ? "hero-strip-ltr" : "hero-strip-rtl"}`}
                style={{ animationDuration: `${strip.speed}s` }}
              >
                {allPairs.map((pair, pi) => (
                  <div key={pi} className="hero-pair">
                    <img src={pair.imgs[0]} alt="" aria-hidden="true" loading="eager" decoding="async" className="hero-pair-img" />
                    <img src={pair.imgs[1]} alt="" aria-hidden="true" loading="eager" decoding="async" className="hero-pair-img" />
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* ── High-performance clone for Phase 2 ────────────────────────────── */}
        <div
          ref={clonePairRef}
          className="hero-pair is-active"
          style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none' }}
        >
          <img className="hero-pair-img" alt="" />
          <img className="hero-pair-img" alt="" />
        </div>

        {/* ── Additional Slideshow Wipes (Mersi-Style) ──────────────────────── */}
        <div className="hero-slides-wrapper" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
          {[...Array(EXTRA_STEPS)].map((_, i) => (
             <div key={i} className="hero-slide-layer" style={{ position: 'absolute', inset: 0 }}>
               {/* Left panel wipes UP from BOTTOM */}
               <div className="hero-slide-wipe-left" style={{ position: 'absolute', left: 0, bottom: 0, width: '50%', height: 0, overflow: 'hidden', willChange: 'height' }}>
                 <img className="hero-slide-img-left" alt="" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh', objectFit: 'cover' }} />
               </div>
               {/* Right panel wipes DOWN from TOP */}
               <div className="hero-slide-wipe-right" style={{ position: 'absolute', right: 0, top: 0, width: '50%', height: 0, overflow: 'hidden', willChange: 'height' }}>
                 <img className="hero-slide-img-right" alt="" style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100vh', objectFit: 'cover' }} />
               </div>
             </div>
          ))}
        </div>

        {/* ── About Panel (Step 4: slides in after all products) ─────────────── */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>

         {/* LEFT: green glassmorphic panel — slides in from left */}   
          <div
            ref={aboutPanelRef}
            className="about-panel"
            style={{
              clipPath: "inset(0 100% 0 0)",
              pointerEvents: "none",
              background: "linear-gradient(145deg, rgba(4, 50, 25, 0.96) 0%, rgba(10, 124, 63, 0.92) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.10)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 20px 50px rgba(0,0,0,0.25)",
              color: "#ffffff",
            }}
          >
            <div
              ref={aboutContentRef}
              className="about-panel-content"
              style={{
                opacity: 0,
                transform: "translateY(22px)",
                color: "#ffffff",
              }}
            >
              <p className="about-panel-label" style={{ color: "#f98d4a" }}>
                About Us
              </p>

              <h2 className="about-panel-title capitalize" style={{ color: "#ffffff" }}>
                From auto glass roots to Ethiopia's most advanced processor.
              </h2>

              <p className="about-panel-body" style={{ color: "rgba(255,255,255,0.82)" }}>
                Sorana Glass began with deep technical expertise in automotive glass and has grown
                into a fully integrated solutions provider — combining over 20 years of industry
                experience with modern production technology.
              </p>

              <p className="about-panel-body" style={{ marginTop: "1rem", color: "rgba(255,255,255,0.82)" }}>
                Today the factory produces up to 2,000 m² per day and supplies contractors, real
                estate developers, hotels, hospitals and industrial facilities across Ethiopia.
              </p>

              <Link
                to="/about"
                className="about-panel-link"
                style={{
                  color: "#f98d4a",
                }}
              >
                Our Story <ArrowRight size={16} />
              </Link>
            </div>
          </div>



          {/* RIGHT: factory video — rendered through WebGL fluid displacement */}
          <div
            ref={aboutVideoWrapperRef}
            className="about-video-wrapper"
            style={{ pointerEvents: 'none', cursor: 'none' }}
          >
            {/* Hidden video — only used as WebGL texture source */}
            <video
              ref={aboutVideoRef}
              src={aboutVideoSrc}
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                width: '100%', height: '100%',
                objectFit: 'cover',
                clipPath: 'inset(0 0 0 100%)',
                opacity: 0,
                pointerEvents: 'none',
              }}
            />
            {/* WebGL canvas replaces the video visually */}
            <canvas
              ref={glCanvasRef}
              className="about-gl-canvas"
              aria-hidden="true"
              style={{ clipPath: 'inset(0 0 0 100%)' }}
            />
          </div>
        </div>

        {/* ── Brand-colour overlay (fades on scroll phase 1) ───────────────────── */}
        <div ref={overlayRef} className="hero-overlay" aria-hidden="true" />

        {/* ── Dark scrim for text legibility ────────────────────────────────── */}
        <div
          ref={scrimRef}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 6, background: "linear-gradient(to bottom, rgba(10,20,15,0.55) 0%, rgba(10,20,15,0.35) 100%)" }}
          aria-hidden="true"
        />


        {/* ── Hero text content ──────────────────────────────────────────────── */}
        <div
          ref={contentRef}
          className="relative flex h-full flex-col items-center justify-center text-center px-6"
          style={{ zIndex: 10 }}
        >
          {/* Badge */}
          <span className="hero-animate inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E87732]" />
            Sorana Glass · Est. 2017
          </span>

          {/* Headline */}
          <h1 className="hero-animate mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.07] text-white text-balance md:text-7xl">
            Engineering Right Into Ethiopia's{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #E87732, #f9a05a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Finest Spaces
            </span>
            .
          </h1>

          {/* Sub-copy */}
          <p className="hero-animate mt-6 max-w-2xl text-base text-white/70 md:text-lg">
            Over 20 years of glass craftsmanship. From tempered facades to frameless
            showers and automotive windshields — processed, finished and installed in Addis Ababa.
          </p>

          {/* CTAs */}
          <div className="hero-animate mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#0A7C3F] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#0b9048] hover:scale-[1.03] active:scale-[0.98]"
            >
              Request a quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-[1.03] active:scale-[0.98]"
            >
              Explore products
            </Link>
          </div>
        </div>

        {/* ── Scroll-driven info card ────────────────────────────────────────── */}
        <div ref={infoCardRef} className="hero-info-card" aria-hidden="false">
          <div ref={infoCardInnerRef} className="hero-info-card-inner">

            {/* Render stacked pill layers that wipe over each other */}
            {[...Array(1 + EXTRA_STEPS)].map((_, i) => (
              <Link
                key={i}
                to="/products"
                aria-label="View all products"
                className="hero-info-card-layer"
                style={{
                  zIndex: i,
                  // Glassy gradient: using the main color and a darker version with transparency
                  // Orange bg: rgba(192,107,47) -> darker rgba(130,65,25)
                  // Green bg: rgba(10,124,63) -> darker rgba(4,50,25)
                  background: i === 1
                    ? 'linear-gradient(145deg, rgba(192, 107, 47, 0.45) 0%, rgba(130, 65, 25, 0.65) 100%)'
                    : 'linear-gradient(145deg, rgba(10, 124, 63, 0.4) 0%, rgba(4, 50, 25, 0.65) 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
                  clipPath: i === 0 ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
                  pointerEvents: i === 0 ? 'auto' : 'none',
                  // CSS variables to override text colors on the orange background
                  '--text-primary': '#ffffff',
                  '--text-bl': i === 1 ? '#0ae26fff' : '#f98d4aff',
                  '--text-br': '#ffffff',
                  '--arrow-color': i === 1 ? '#0ae26fff' : '#f98d4aff',
                } as React.CSSProperties}
              >
                {/* Center: Stamped Logo */}
                <div className="hero-card-center" aria-hidden="true">
                  <img src={logoSvg} alt="" className="hero-card-logo-img" />
                </div>

                <div className="hero-card-text-group" style={{ position: 'absolute', inset: 0 }}>
                  <div className="hero-card-tl"></div>
                  <div className="hero-card-bl"></div>
                  {/* Arrow is now decorative — the whole card is the link */}
                  <div className="hero-card-tr" aria-hidden="true">
                    <ArrowRight />
                  </div>
                  <div className="hero-card-br">Products</div>
                </div>
              </Link>
            ))}

          </div>
        </div>

        {/* Inline keyframe value accessible to inline styles */}
        <style>{`:root { --hero-cycle: ${CYCLE_PX}px; }`}</style>
      </section>
    </div>
  );
}
