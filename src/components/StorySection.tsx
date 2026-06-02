import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── WebGL shaders for fluid cursor displacement ──────────────────────────────
const VERT_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
    // flip y because WebGL textures are loaded upside down by default if not flipped
    vUv.y = 1.0 - vUv.y;
    gl_Position = vec4(aPos, 0.0, 1.0);
  }
`;

const DISP_FRAG_SRC = `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uVelocity;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 prev = texture2D(uPrev, vUv).rg * 2.0 - 1.0;
    prev *= 0.955;
    vec2 delta = vec2((vUv.x - uMouse.x) * uAspect, vUv.y - uMouse.y);
    float dist  = length(delta);
    float brush = exp(-dist * dist / 0.0055);
    prev += uVelocity * brush * 4.5;
    prev  = clamp(prev, -1.0, 1.0);
    gl_FragColor = vec4(prev * 0.5 + 0.5, 0.0, 1.0);
  }
`;

const RENDER_FRAG_SRC = `
  precision highp float;
  uniform sampler2D uImage;
  uniform sampler2D uDisp;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 disp = texture2D(uDisp, vUv).rg * 2.0 - 1.0;
    disp.x /= uAspect;
    float dispLen = length(disp);
    float ca = dispLen * 0.007;
    vec2  uv  = vUv + disp * 0.055;

    float r = texture2D(uImage, uv + vec2(ca,  0.0)).r;
    float g = texture2D(uImage, uv              ).g;
    float b = texture2D(uImage, uv - vec2(ca,  0.0)).b;

    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

function setupWebGL(
  canvas: HTMLCanvasElement,
  imageSrc: string,
  mouseRef: { current: [number, number] },
  prevMouseRef: { current: [number, number] },
  velocityRef: { current: [number, number] }
) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    premultipliedAlpha: false,
  }) as WebGLRenderingContext | null;
  if (!gl) return null;

  const mkShader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const mkProg = (vert: string, frag: string) => {
    const p = gl.createProgram()!;
    gl.attachShader(p, mkShader(gl.VERTEX_SHADER, vert));
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

  const dispProg = mkProg(VERT_SRC, DISP_FRAG_SRC);
  const renderProg = mkProg(VERT_SRC, RENDER_FRAG_SRC);

  const neutral = new Uint8Array(W * H * 4);
  for (let i = 0; i < neutral.length; i += 4) {
    neutral[i] = 128; neutral[i + 1] = 128; neutral[i + 2] = 0; neutral[i + 3] = 255;
  }

  const tex0 = mkTex(W, H, neutral);
  const tex1 = mkTex(W, H, neutral);
  const imgTex = mkTex(2, 2);
  const fbo0 = mkFbo(tex0);
  const fbo1 = mkFbo(tex1);

  const quad = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const img = new Image();
  img.crossOrigin = "anonymous";
  let imgLoaded = false;
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, imgTex);
    // don't flip y here since we flipped vUv in vertex shader
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    imgLoaded = true;
  };
  img.src = imageSrc;

  const state = {
    ping: 0,
    rafId: 0,
    active: true,
  };

  const draw = () => {
    if (!state.active) return;

    // Velocity update
    const rawVx = mouseRef.current[0] - prevMouseRef.current[0];
    const rawVy = mouseRef.current[1] - prevMouseRef.current[1];
    velocityRef.current[0] = velocityRef.current[0] * 0.82 + rawVx * 0.18 * 60;
    velocityRef.current[1] = velocityRef.current[1] * 0.82 + rawVy * 0.18 * 60;
    prevMouseRef.current[0] = mouseRef.current[0];
    prevMouseRef.current[1] = mouseRef.current[1];

    const aspect = W / H;
    const pong = 1 - state.ping;

    // Pass 1: update displacement
    gl.bindFramebuffer(gl.FRAMEBUFFER, state.ping === 0 ? fbo1 : fbo0);
    gl.viewport(0, 0, W, H);
    gl.useProgram(dispProg);

    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const aPos1 = gl.getAttribLocation(dispProg, 'aPos');
    gl.enableVertexAttribArray(aPos1);
    gl.vertexAttribPointer(aPos1, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, state.ping === 0 ? tex0 : tex1);
    gl.uniform1i(gl.getUniformLocation(dispProg, 'uPrev'), 0);
    gl.uniform2f(gl.getUniformLocation(dispProg, 'uMouse'), mouseRef.current[0], mouseRef.current[1]);
    gl.uniform2f(gl.getUniformLocation(dispProg, 'uVelocity'), velocityRef.current[0], velocityRef.current[1]);
    gl.uniform1f(gl.getUniformLocation(dispProg, 'uAspect'), aspect);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Pass 2: render image
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, W, H);
    gl.useProgram(renderProg);

    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const aPos2 = gl.getAttribLocation(renderProg, 'aPos');
    gl.enableVertexAttribArray(aPos2);
    gl.vertexAttribPointer(aPos2, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.uniform1i(gl.getUniformLocation(renderProg, 'uImage'), 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, state.ping === 0 ? tex1 : tex0);
    gl.uniform1i(gl.getUniformLocation(renderProg, 'uDisp'), 1);
    gl.uniform1f(gl.getUniformLocation(renderProg, 'uAspect'), aspect);

    if (imgLoaded) {
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    state.ping = pong;
    state.rafId = requestAnimationFrame(draw);
  };

  state.rafId = requestAnimationFrame(draw);
  return state;
}

const STEPS = [
  {
    index: "01",
    text: "Established in 2017 under its current legal structure, Sorana builds on a long operational history that began under a sister company focused on auto glass services.",
    image: "https://images.pexels.com/photos/13203179/pexels-photo-13203179.jpeg",
  },
  {
    index: "02",
    text: "That automotive heritage shaped a culture of precision and accountability. As demand for architectural glass grew across Ethiopia, Sorana expanded into full-scale processing — investing in 4 advanced tempering furnaces, including a recent upgrade from leading global supplier North Glass.",
    image: "https://images.pexels.com/photos/35333877/pexels-photo-35333877.jpeg",
  },
  {
    index: "03",
    text: "Today the factory produces up to 2,000 m² per day and supplies contractors, real estate developers, car assembly companies, hotels, hospitals, museums and industrial facilities across the country.",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&fit=crop",
  }
];

export function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  // Story Refs
  const imageLayersRef = useRef<(HTMLDivElement | null)[]>([]);
  const textLayersRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const indexLayersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Mission/Vision Refs
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);

  const leftMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const leftPrevMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const leftVelocityRef = useRef<[number, number]>([0, 0]);

  const rightMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const rightPrevMouseRef = useRef<[number, number]>([0.5, 0.5]);
  const rightVelocityRef = useRef<[number, number]>([0, 0]);

  const leftGlStateRef = useRef<any>(null);
  const rightGlStateRef = useRef<any>(null);

  // User-provided Unsplash/Pexels images
  const missionImg = "https://images.pexels.com/photos/8276215/pexels-photo-8276215.jpeg";
  const visionImg = "https://images.pexels.com/photos/1208074/pexels-photo-1208074.jpeg";

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Total steps = 3 steps of story + 1 step of mission/vision = 4 steps total (indices 0,1,2,3)
      // so total steps integer = 4, but let's call the total segments = STEPS.length
      const totalSegments = STEPS.length;

      // Ensure elements are hidden initially except the first one
      gsap.set(textLayersRef.current.slice(1), { opacity: 0, y: 20 });
      gsap.set(indexLayersRef.current.slice(1), { opacity: 0, y: 10 });

      function getClip(i: number, sp: number) {
        let rightClip = 100, leftClip = 0;
        const revealStart = (i - 1) / totalSegments;
        const revealEnd = i / totalSegments;
        const hideStart = i / totalSegments;
        const hideEnd = (i + 1) / totalSegments;

        const isLastImage = i === STEPS.length - 1;

        if (i === 0) {
          rightClip = 0;
          if (!isLastImage && sp >= hideEnd) {
            leftClip = 100;
          } else if (!isLastImage && sp > hideStart) {
            const p = (sp - hideStart) / (hideEnd - hideStart);
            leftClip = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p)) * 100;
          }
        } else {
          if (sp <= revealStart) {
            rightClip = 100; leftClip = 0;
          } else if (!isLastImage && sp >= hideEnd) {
            rightClip = 0; leftClip = 100;
          } else if (sp > revealStart && sp <= revealEnd) {
            const p = (sp - revealStart) / (revealEnd - revealStart);
            rightClip = (1 - gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p))) * 100;
            leftClip = 0;
          } else if (!isLastImage && sp > hideStart && sp < hideEnd) {
            const p = (sp - hideStart) / (hideEnd - hideStart);
            rightClip = 0;
            leftClip = gsap.utils.clamp(0, 1, gsap.parseEase('power2.inOut')(p)) * 100;
          } else if (isLastImage && sp > revealEnd) {
            rightClip = 0; leftClip = 0; // Last image stays unclipped
          }
        }
        return { rightClip, leftClip };
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom 100%',
        scrub: 1.2,
        snap: {
          snapTo: (value) => {
            const stepSize = 1 / totalSegments;
            return Math.round(value / stepSize) * stepSize;
          },
          duration: { min: 0.2, max: 0.6 },
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const sp = self.progress;

          // Update load bar width (only during the story steps)
          if (progressBarRef.current) {
            // max progress for bar is when sp = 1
            const barProgress = Math.min(1, sp * (totalSegments / (totalSegments - 1)));
            gsap.to(progressBarRef.current, {
              scaleX: barProgress,
              duration: 0.1,
              ease: "none"
            });
          }

          // 1. Update Story Images
          STEPS.forEach((_, i) => {
            const { rightClip, leftClip } = getClip(i, sp);
            const clipVal = `inset(0 ${rightClip}% 0 ${leftClip}%)`;

            if (imageLayersRef.current[i]) {
              imageLayersRef.current[i]!.style.clipPath = clipVal;
            }

            // Crossfade Text and Index based on progress
            const stepStart = Math.max(0, (i - 0.5) / totalSegments);
            const stepEnd = Math.min(1, (i + 0.5) / totalSegments);

            let opacity = 0;
            let y = 20;

            if (sp >= stepStart && sp <= stepEnd) {
              const center = i / totalSegments;
              const dist = Math.abs(sp - center);
              const maxDist = 0.5 / totalSegments;
              opacity = 1 - (dist / maxDist);
              y = 20 * (dist / maxDist) * (sp < center ? 1 : -1);
            }

            opacity = gsap.utils.clamp(0, 1, opacity);
            if (opacity === 0) {
              y = sp < (i / totalSegments) ? 20 : -20;
            }

            if (textLayersRef.current[i]) {
              gsap.to(textLayersRef.current[i], {
                opacity: opacity,
                y: y,
                duration: 0.1,
                ease: "none"
              });
            }

            if (indexLayersRef.current[i]) {
              gsap.to(indexLayersRef.current[i], {
                opacity: opacity,
                y: y * 0.5,
                duration: 0.1,
                ease: "none"
              });
            }
          });

          // 2. Update Mission/Vision Reveal
          // This happens during the last segment (from (totalSegments-1)/totalSegments to 1)
          const mvStart = (totalSegments - 1) / totalSegments;
          const mvEnd = 1;
          let mvProgress = 0;

          if (sp >= mvEnd) mvProgress = 1;
          else if (sp > mvStart) mvProgress = (sp - mvStart) / (mvEnd - mvStart);

          const mvEased = gsap.utils.clamp(0, 1, gsap.parseEase("power2.inOut")(mvProgress));
          const isMobile = window.innerWidth < 768;

          if (leftPanelRef.current) {
            if (isMobile) {
              leftPanelRef.current.style.clipPath = `inset(${100 - mvEased * 100}% 0 0 0)`;
            } else {
              leftPanelRef.current.style.clipPath = `inset(0 0 0 ${100 - mvEased * 100}%)`;
            }
            leftPanelRef.current.style.pointerEvents = mvProgress > 0.5 ? 'auto' : 'none';
          }
          if (rightPanelRef.current) {
            if (isMobile) {
              rightPanelRef.current.style.clipPath = `inset(0 0 ${100 - mvEased * 100}% 0)`;
            } else {
              rightPanelRef.current.style.clipPath = `inset(0 ${100 - mvEased * 100}% 0 0)`;
            }
            rightPanelRef.current.style.pointerEvents = mvProgress > 0.5 ? 'auto' : 'none';
          }

        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // WebGL Setup for Mission/Vision
  const initLeftWebGL = useCallback(() => {
    if (!leftCanvasRef.current) return;
    leftGlStateRef.current = setupWebGL(leftCanvasRef.current, missionImg, leftMouseRef, leftPrevMouseRef, leftVelocityRef);
  }, []);

  const initRightWebGL = useCallback(() => {
    if (!rightCanvasRef.current) return;
    rightGlStateRef.current = setupWebGL(rightCanvasRef.current, visionImg, rightMouseRef, rightPrevMouseRef, rightVelocityRef);
  }, []);

  useEffect(() => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;

    const handleResize = (entries: ResizeObserverEntry[], initFn: () => void, stateRef: React.MutableRefObject<any>, canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        if (stateRef.current) {
          stateRef.current.active = false;
          cancelAnimationFrame(stateRef.current.rafId);
          stateRef.current = null;
        }
        initFn();
      }
    };

    const leftRo = new ResizeObserver((entries) => handleResize(entries, initLeftWebGL, leftGlStateRef, leftCanvas));
    if (leftPanelRef.current) leftRo.observe(leftPanelRef.current);

    const rightRo = new ResizeObserver((entries) => handleResize(entries, initRightWebGL, rightGlStateRef, rightCanvas));
    if (rightPanelRef.current) rightRo.observe(rightPanelRef.current);

    const onLeftMove = (e: PointerEvent) => {
      if (!leftPanelRef.current) return;
      const rect = leftPanelRef.current.getBoundingClientRect();
      leftMouseRef.current[0] = (e.clientX - rect.left) / rect.width;
      leftMouseRef.current[1] = (e.clientY - rect.top) / rect.height;
    };

    const onRightMove = (e: PointerEvent) => {
      if (!rightPanelRef.current) return;
      const rect = rightPanelRef.current.getBoundingClientRect();
      rightMouseRef.current[0] = (e.clientX - rect.left) / rect.width;
      rightMouseRef.current[1] = (e.clientY - rect.top) / rect.height;
    };

    if (leftPanelRef.current) leftPanelRef.current.addEventListener('pointermove', onLeftMove as EventListener);
    if (rightPanelRef.current) rightPanelRef.current.addEventListener('pointermove', onRightMove as EventListener);

    return () => {
      leftRo.disconnect();
      rightRo.disconnect();
      if (leftPanelRef.current) leftPanelRef.current.removeEventListener('pointermove', onLeftMove as EventListener);
      if (rightPanelRef.current) rightPanelRef.current.removeEventListener('pointermove', onRightMove as EventListener);
      if (leftGlStateRef.current) {
        leftGlStateRef.current.active = false;
        cancelAnimationFrame(leftGlStateRef.current.rafId);
      }
      if (rightGlStateRef.current) {
        rightGlStateRef.current.active = false;
        cancelAnimationFrame(rightGlStateRef.current.rafId);
      }
    };
  }, [initLeftWebGL, initRightWebGL]);

  return (
    <section
      ref={sectionRef}
      className="relative z-20 bg-black text-white"
      // Height spans both the Story (length * 100vh) + Mission/Vision (100vh)
      style={{ height: `${(STEPS.length + 1) * 100}vh` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">

        {/* ── Background Images Layer (Story) ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={el => { imageLayersRef.current[i] = el; }}
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: i, clipPath: i === 0 ? 'inset(0 0% 0 0%)' : 'inset(0 100% 0 0%)', willChange: 'clip-path' }}
            >
              <img src={step.image} alt="Sorana Story" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* ── UI Overlay Layer (Story) ── */}
        <div className="relative z-10 w-full h-full flex flex-col pointer-events-none">
          {/* Top Half */}
          <div className="flex-1 relative">
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-white/80">Scroll to Explore</span>
              <ArrowDown size={16} className="text-white/80 animate-bounce" />
            </div>

            {/* Left side 01 label above the line */}
            <div className="absolute bottom-4 left-6 md:left-16 h-8 w-8">
              {STEPS.map((step, i) => (
                <span
                  key={`index-${i}`}
                  ref={el => { indexLayersRef.current[i] = el; }}
                  className="absolute bottom-0 left-0 text-sm font-bold text-white tracking-widest"
                >
                  {step.index}
                </span>
              ))}
            </div>
          </div>

          {/* Middle Load Bar */}
          <div className="w-full h-[1.5px] bg-white/20 relative shrink-0">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full h-full bg-white origin-center"
              style={{ transform: 'scaleX(0)', willChange: 'transform' }}
            />
          </div>

          {/* Bottom Half */}
          <div className="flex-1 relative flex flex-col justify-start pt-8 px-6 md:px-16">
            <div className="flex flex-col md:flex-row w-full gap-8 md:gap-16">
              <div className="w-full md:w-1/4">
                <h2 className="text-xl md:text-2xl font-display font-semibold tracking-wide text-white">Our Story</h2>
              </div>
              <div className="w-full md:w-1/2 relative min-h-[200px]">
                <div className="max-w-2xl mx-auto relative w-full">
                  {STEPS.map((step, i) => (
                    <p
                      key={`text-${i}`}
                      ref={el => { textLayersRef.current[i] = el; }}
                      className="absolute top-0 left-0 w-full text-center text-lg md:text-xl leading-relaxed text-white/90 font-light"
                    >
                      {step.text}
                    </p>
                  ))}
                </div>
              </div>
              <div className="hidden md:block md:w-1/4"></div>
            </div>
          </div>
        </div>

        {/* ── Mission/Vision Overlay Layer ── */}
        <div className="absolute inset-0 z-30 flex flex-col md:flex-row overflow-hidden pointer-events-none">

          {/* Left Panel: Mission */}
          <div
            ref={leftPanelRef}
            className="relative w-full h-1/2 md:w-1/2 md:h-full cursor-crosshair overflow-hidden"
            style={{ clipPath: typeof window !== 'undefined' && window.innerWidth < 768 ? 'inset(100% 0 0 0)' : 'inset(0 0 0 100%)', pointerEvents: 'none' }}
          >
            <canvas ref={leftCanvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-center items-center px-12 md:px-24 pointer-events-none text-center">
              <div className="text-white/90 max-w-lg">
                <p className="text-sm tracking-[0.2em] uppercase font-bold text-accent mb-4">Mission</p>
                <h3 className="text-2xl md:text-4xl font-display font-medium leading-tight text-white mb-6">
                  Driving architectural excellence through quality.
                </h3>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                  To provide high-quality glass products and services to construction and automotive industries through efficient production, reliable delivery and customer-focused solutions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Vision */}
          <div
            ref={rightPanelRef}
            className="relative w-full h-1/2 md:w-1/2 md:h-full cursor-crosshair overflow-hidden"
            style={{ clipPath: typeof window !== 'undefined' && window.innerWidth < 768 ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)', pointerEvents: 'none' }}
          >
            <canvas ref={rightCanvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-none" />

            <div className="absolute inset-0 flex flex-col justify-center items-center px-12 md:px-24 pointer-events-none text-center">
              <div className="text-white/90 max-w-lg">
                <p className="text-sm tracking-[0.2em] uppercase font-bold text-accent mb-4">Vision</p>
                <h3 className="text-2xl md:text-4xl font-display font-medium leading-tight text-white mb-6">
                  Shaping the skylines of tomorrow.
                </h3>
                <p className="text-white/80 leading-relaxed font-light text-lg">
                  To become one of the leading and most advanced glass processing companies in Africa — recognized for quality, innovation and reliability.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
