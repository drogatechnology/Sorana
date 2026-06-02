import { useEffect, useRef } from 'react';

interface Props { 
  selector: string; 
  textWrapperSelector?: string; 
}

/* ── GLSL ─────────────────────────────────────────────────────────────────── */
const VERT = `
  precision highp float;
  #define PI 3.14159265358979

  attribute vec2 a_uv;          // 0..1
  uniform vec2  u_res;          // canvas size (px)
  uniform vec2  u_pos;          // top-left of element (px)
  uniform vec2  u_size;         // width, height (px)
  uniform float u_strength;     // scroll-bend amount

  varying vec2 v_uv;

  void main() {
    // Map a_uv (0..1) → pixel coords of the element
    vec2 px = u_pos + a_uv * u_size;

    // NDC: x ∈ [-1,1] left→right, y ∈ [1,-1] top→bottom
    vec2 ndc = (px / u_res) * 2.0 - 1.0;
    ndc.y = -ndc.y;

    // The whole page acts as a single continuous 3D surface!
    // 1. Global curve (bulges the center of the screen towards the camera)
    float globalCurve = cos(ndc.y * PI * 0.5) * u_strength;
    
    // 2. Global Tilt (Shear effect based on screen position)
    // -ndc.y means top of screen pushes away, bottom pulls closer (when scrolling down)
    float globalTilt = -ndc.y * u_strength * 1.5;

    // Total Z displacement
    float z = globalCurve + globalTilt;

    // Perspective divide (w)
    // D is the camera distance. 2.0 creates a nice moderate perspective.
    float D = 2.0;
    float w = 1.0 - (z / D);

    v_uv = a_uv;
    gl_Position = vec4(ndc.x, ndc.y, z, w);
  }
`;

const FRAG = `
  precision highp float;

  uniform sampler2D u_tex;
  uniform vec2      u_imgSize;   // natural size of the image
  uniform vec2      u_planeSize; // rendered size of the plane (px)

  varying vec2 v_uv;

  void main() {
    // object-fit: cover crop
    float imgAspect   = u_imgSize.x   / u_imgSize.y;
    float planeAspect = u_planeSize.x / u_planeSize.y;

    vec2 uv = v_uv;
    if (imgAspect > planeAspect) {
      // image is wider — clip sides
      float scale = planeAspect / imgAspect;
      uv.x = uv.x * scale + (1.0 - scale) * 0.5;
    } else {
      // image is taller — clip top/bottom
      float scale = imgAspect / planeAspect;
      uv.y = uv.y * scale + (1.0 - scale) * 0.5;
    }

    gl_FragColor = texture2D(u_tex, uv);
  }
`;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(s) ?? 'shader error');
  return s;
}

function buildProgram(gl: WebGLRenderingContext) {
  const p = gl.createProgram()!;
  gl.attachShader(p, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(p, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(p) ?? 'link error');
  return p;
}

/** Build a grid of triangles: (segs+1)×(segs+1) vertices, segs×segs quads */
function buildPlane(gl: WebGLRenderingContext, segs: number) {
  const verts: number[] = [];
  const idx: number[] = [];

  for (let row = 0; row <= segs; row++) {
    for (let col = 0; col <= segs; col++) {
      verts.push(col / segs, row / segs); // u, v
    }
  }
  const stride = segs + 1;
  for (let row = 0; row < segs; row++) {
    for (let col = 0; col < segs; col++) {
      const a = row * stride + col;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }

  const vbo = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  const ibo = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);

  return { vbo, ibo, count: idx.length };
}

function loadTexture(gl: WebGLRenderingContext, src: string) {
  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  
  // Set params IMMEDIATELY so placeholder is valid
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // 1×1 grey placeholder so the mesh renders immediately
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([180, 180, 180, 255]));

  const img = new Image();
  img.crossOrigin = 'anonymous';
  let naturalW = 1, naturalH = 1;
  img.onload = () => {
    naturalW = img.naturalWidth;
    naturalH = img.naturalHeight;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  };
  img.src = src;

  return {
    tex,
    getSize: () => [naturalW, naturalH] as [number, number],
  };
}

/* ── Component ───────────────────────────────────────────────────────────── */
export function WebGLGallery({ selector, textWrapperSelector }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    /* 1 ── Context */
    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    /* 2 ── Shader program */
    const prog = buildProgram(gl);
    gl.useProgram(prog);

    const aUv       = gl.getAttribLocation(prog, 'a_uv');
    const uRes      = gl.getUniformLocation(prog, 'u_res');
    const uPos      = gl.getUniformLocation(prog, 'u_pos');
    const uSize     = gl.getUniformLocation(prog, 'u_size');
    const uStrength = gl.getUniformLocation(prog, 'u_strength');
    const uTex      = gl.getUniformLocation(prog, 'u_tex');
    const uImgSize  = gl.getUniformLocation(prog, 'u_imgSize');
    const uPlane    = gl.getUniformLocation(prog, 'u_planeSize');

    /* 3 ── Geometry (20 height segments for smooth bend) */
    const { vbo, ibo, count } = buildPlane(gl, 20);

    /* 4 ── Per-image textures */
    const imageEls = Array.from(document.querySelectorAll<HTMLImageElement>(selector));
    imageEls.forEach(el => { el.style.opacity = '0'; });

    const items = imageEls.map(el => ({
      el,
      ...loadTexture(gl, el.currentSrc || el.src),
    }));

    /* 5 ── Resize */
    let W = 0, H = 0;
    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    window.addEventListener('resize', resize);
    resize();

    /* 6 ── Render loop */
    let raf: number;
    let lastY  = window.scrollY;
    let vel    = 0;

    const draw = () => {
      const y     = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      vel  += (delta - vel) * 0.075;
      if (Math.abs(delta) < 0.5) vel *= 0.86;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Bind geometry once
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, W, H);

      // Scroll strength — tune the multiplier for more/less drama
      const strength = (vel / H) * 2.5;

      items.forEach(({ el, tex, getSize }) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > H) return; // skip off-screen

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(uTex, 0);

        const [iw, ih] = getSize();
        gl.uniform2f(uImgSize,  iw, ih);
        gl.uniform2f(uPlane,    r.width, r.height);
        gl.uniform2f(uPos,      r.left, r.top);
        gl.uniform2f(uSize,     r.width, r.height);
        gl.uniform1f(uStrength, strength);

        gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);

        if (textWrapperSelector) {
          const titleWrapper = el.parentElement?.previousElementSibling as HTMLElement;
          const descWrapper = el.parentElement?.nextElementSibling as HTMLElement;

          const applyTextTransform = (wrapper: HTMLElement, isTop: boolean) => {
            if (!wrapper || !wrapper.matches(textWrapperSelector)) return;
            const textEl = wrapper.firstElementChild as HTMLElement;
            if (!textEl) return;

            const textR = wrapper.getBoundingClientRect();
            const textCenterY = textR.top + textR.height / 2;
            
            const refY = isTop ? r.top : r.bottom;
            const ndcRefY = -((refY / H) * 2.0 - 1.0);
            
            const globalCurve = Math.cos(ndcRefY * Math.PI * 0.5) * strength;
            const globalTilt = -ndcRefY * strength * 1.5;
            const z = globalCurve + globalTilt;
            const w = 1.0 - (z / 2.0);

            const leftX = r.left;
            const ndcLeftX = (leftX / W) * 2.0 - 1.0;
            const projectedNdcLeftX = ndcLeftX / w;
            const newLeftX = (projectedNdcLeftX + 1.0) * 0.5 * W;
            const deltaX = newLeftX - leftX;

            const ndcTextY = -((textCenterY / H) * 2.0 - 1.0);
            const projectedNdcTextY = ndcTextY / w;
            const newTextY = (-projectedNdcTextY + 1.0) * 0.5 * H;
            const deltaY = newTextY - textCenterY;

            const scale = 1.0 / w;

            textEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
            textEl.style.transformOrigin = "left center";
          };

          applyTextTransform(titleWrapper, true);
          applyTextTransform(descWrapper, false);
        }
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      imageEls.forEach(el => { el.style.opacity = ''; });
    };
  }, [selector]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width:  '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  );
}
