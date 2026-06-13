import { useRef, useEffect, useCallback } from 'react';

// ── WebGL shaders (identical to before) ──────────────────────────────────────
const VERT_SRC = `
  attribute vec2 aPos;
  varying vec2 vUv;
  void main() {
    vUv = aPos * 0.5 + 0.5;
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
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    imgLoaded = true;
  };
  img.src = imageSrc;

  const state = { ping: 0, rafId: 0, active: true };

  const draw = () => {
    if (!state.active) return;

    const rawVx = mouseRef.current[0] - prevMouseRef.current[0];
    const rawVy = mouseRef.current[1] - prevMouseRef.current[1];
    velocityRef.current[0] = velocityRef.current[0] * 0.82 + rawVx * 0.18 * 60;
    velocityRef.current[1] = velocityRef.current[1] * 0.82 + rawVy * 0.18 * 60;
    prevMouseRef.current[0] = mouseRef.current[0];
    prevMouseRef.current[1] = mouseRef.current[1];

    const aspect = W / H;
    const pong = 1 - state.ping;

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
    if (imgLoaded) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    state.ping = pong;
    state.rafId = requestAnimationFrame(draw);
  };

  state.rafId = requestAnimationFrame(draw);
  return state;
}

export function MissionVisionSection() {
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

  const missionImg = "https://images.pexels.com/photos/8276215/pexels-photo-8276215.jpeg";
  const visionImg = "https://images.pexels.com/photos/1208074/pexels-photo-1208074.jpeg";

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

    const handleResize = (
      entries: ResizeObserverEntry[],
      initFn: () => void,
      stateRef: React.MutableRefObject<any>,
      canvas: HTMLCanvasElement | null
    ) => {
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

    leftPanelRef.current?.addEventListener('pointermove', onLeftMove as EventListener);
    rightPanelRef.current?.addEventListener('pointermove', onRightMove as EventListener);

    return () => {
      leftRo.disconnect();
      rightRo.disconnect();
      leftPanelRef.current?.removeEventListener('pointermove', onLeftMove as EventListener);
      rightPanelRef.current?.removeEventListener('pointermove', onRightMove as EventListener);
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
    <section className="relative z-20 bg-black text-white h-screen flex flex-col md:flex-row overflow-hidden">

      {/* Left Panel: Mission */}
      <div
        ref={leftPanelRef}
        className="relative w-full h-1/2 md:w-1/2 md:h-full cursor-crosshair overflow-hidden"
      >
        <canvas ref={leftCanvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-center items-center px-12 md:px-24 text-center">
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
      >
        <canvas ref={rightCanvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col justify-center items-center px-12 md:px-24 text-center">
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

    </section>
  );
}