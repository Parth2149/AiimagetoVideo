'use client';

import React, { useEffect, useRef, useState } from 'react';

const vertexShaderSource = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_resolution;

  // Modern satin wave simulation
  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.25;

    // Fluid domain warping for satin ripples
    float wave1 = sin(p.x * 2.2 + t * 0.8 + sin(p.y * 3.0 + t * 0.4));
    float wave2 = cos(p.y * 2.6 - t * 0.6 + cos(p.x * 2.5 - t * 0.5));
    float wave3 = sin((p.x + p.y) * 1.8 + t * 0.5);

    float satin = (wave1 + wave2 + wave3) / 3.0;
    float spec = pow(max(0.0, sin(p.y * 4.0 + satin * 3.14 + t * 0.6)), 3.0) * 0.45;

    // Palette:
    // Electric Blue: vec3(0.145, 0.388, 0.922)  (#2563EB)
    // Orchid:        vec3(0.851, 0.275, 0.937)  (#D946EF)
    // Peach:         vec3(0.984, 0.573, 0.235)  (#FB923C)
    // Warm Ivory:    vec3(0.984, 0.976, 0.961)  (#FAF8F5)

    vec3 blue = vec3(0.145, 0.388, 0.922);
    vec3 orchid = vec3(0.851, 0.275, 0.937);
    vec3 peach = vec3(0.984, 0.573, 0.235);
    vec3 ivory = vec3(0.984, 0.976, 0.961);

    // Dynamic blend across the canvas
    float factor1 = smoothstep(-0.8, 0.7, satin + p.x * 0.35);
    float factor2 = smoothstep(-0.6, 0.8, sin(p.y * 2.0 - t * 0.3) * 0.5 + 0.5);

    vec3 col = mix(blue, orchid, factor1);
    col = mix(col, peach, factor2 * 0.85);

    // Pearlescent satin highlights
    col += spec * vec3(1.0, 0.95, 0.98);

    // Soft feathered vignette edges toward ivory
    float dist = length(vUv - 0.5);
    float edgeMask = smoothstep(0.72, 0.25, dist);
    vec3 finalColor = mix(ivory, col, edgeMask * 0.92);

    gl_FragColor = vec4(finalColor, 0.95);
  }
`;

export default function SatinShader({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUseFallback(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', { antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      setUseFallback(true);
      return;
    }

    if (!gl) {
      setUseFallback(true);
      return;
    }

    // Compile helper
    const compile = (src: string, type: number) => {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.warn('Shader compile failed', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = compile(vertexShaderSource, gl.VERTEX_SHADER);
    const frag = compile(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vert || !frag) {
      setUseFallback(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setUseFallback(true);
      return;
    }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error', gl.getProgramInfoLog(program));
      setUseFallback(true);
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionLocation = gl.getAttribLocation(program, 'position');
    const uTimeLocation = gl.getUniformLocation(program, 'u_time');
    const uResolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    let animationFrameId: number;
    const startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl!.viewport(0, 0, width, height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const render = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      gl!.uniform1f(uTimeLocation, elapsed);
      gl!.uniform2f(uResolutionLocation, canvas.width, canvas.height);
      gl!.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(buffer);
      }
    };
  }, []);

  if (useFallback) {
    return (
      <div
        className={`absolute inset-0 pointer-events-none rounded-[36px] overflow-hidden ${className}`}
        style={{
          background: `
            radial-gradient(circle at 25% 20%, rgba(37, 99, 235, 0.45) 0%, transparent 65%),
            radial-gradient(circle at 75% 40%, rgba(217, 70, 239, 0.45) 0%, transparent 60%),
            radial-gradient(circle at 45% 85%, rgba(251, 146, 60, 0.5) 0%, transparent 70%),
            #FAF8F5
          `,
          filter: 'blur(32px)',
          opacity: 0.9,
        }}
      />
    );
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden rounded-[36px] ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover rounded-[36px]"
        style={{ filter: 'blur(16px)', opacity: 0.88 }}
      />
    </div>
  );
}

