import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// SPHERE VERTEX SHADER  –  enhanced waves, twinkling, pulse, aurora hue
// ─────────────────────────────────────────────────────────────────────────────
const sphereVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec2  uMouse;
  uniform float uPulse;

  attribute float aU;
  attribute float aV;
  attribute float aSize;
  attribute float aPhase;   // per-particle random phase for twinkling

  varying float vWave;
  varying float vDepth;
  varying float vHue;
  varying float vGlow;

  // 5-layer interference pattern for richer surface motion
  float waves(float u, float v, float t) {
    float w1 = sin(u * 10.0  - t * 2.0)  * cos(v * 6.0  + t * 1.3);
    float w2 = sin(u * 18.0  + t * 2.7)  * sin(v * 11.0 - t * 1.8);
    float w3 = cos(u * 7.0   - t * 1.1)  * sin(v * 15.0 + t * 2.3);
    float w4 = sin((u + v)   * 13.0 - t * 3.0);
    float w5 = cos(u * 4.0   + v * 9.0   + t * 1.6) * sin(v * 5.0 - t * 0.8);
    return w1*0.32 + w2*0.24 + w3*0.20 + w4*0.14 + w5*0.10;
  }

  void main() {
    float sp = uScroll;

    // ── 1. Sphere position (uniform area distribution) ────────
    float theta = aU * 6.28318;
    float phi   = acos(1.0 - 2.0 * aV);
    float R = 6.0;
    vec3  spherePos = vec3(
      R * sin(phi) * cos(theta),
      R * cos(phi),
      R * sin(phi) * sin(theta)
    );
    vec3 sphereNorm = normalize(spherePos);

    // ── 2. Flat-plane position ────────────────────────────────
    float px = (aU - 0.5) * 28.0;
    float pz = (aV - 0.5) * 18.0;
    vec3  planePos  = vec3(px, 0.0, pz);
    vec3  planeNorm = vec3(0.0, 1.0, 0.0);

    // ── 3. Morph sphere → plane ───────────────────────────────
    float morph   = smoothstep(0.0, 1.0, sp);
    vec3  basePos  = mix(spherePos,  planePos,  morph);
    vec3  baseNorm = normalize(mix(sphereNorm, planeNorm, morph));

    // ── 4. Wave displacement ──────────────────────────────────
    float waveVal = waves(aU, aV, uTime);
    // Keep the sphere perfectly uniform (amplitude 0) and only add waves as it morphs to a plane
    float waveAmp = mix(0.0, 1.8, morph);

    // Concentric pulse rings radiating from sphere center
    float dist      = length(spherePos) / 6.0;
    // Only apply pulse wave distortion after morphing starts to keep the sphere flawless
    float pulseWave = mix(0.0, sin(dist * 10.0 - uTime * 6.0) * uPulse * 0.6, morph);

    vec3 pos = basePos + baseNorm * (waveVal * waveAmp + pulseWave);

    // Tilt plane for 3-D perspective read
    if (morph > 0.05) {
      float tiltAngle = mix(0.0, -0.45, morph);
      float cy = cos(tiltAngle), sy = sin(tiltAngle);
      float ny = pos.y * cy - pos.z * sy;
      float nz = pos.y * sy + pos.z * cy;
      pos.y = ny; pos.z = nz;
    }

    // ── 5. Mouse tilt (sphere only) ───────────────────────────
    float mFactor = 1.0 - morph;
    float rx = -uMouse.y * 0.35 * mFactor;
    float ry =  uMouse.x * 0.45 * mFactor;
    float cosX = cos(rx), sinX = sin(rx);
    float ty = pos.y * cosX - pos.z * sinX;
    float tz = pos.y * sinX + pos.z * cosX;
    pos.y = ty; pos.z = tz;
    float cosY = cos(ry), sinY = sin(ry);
    float tx = pos.x * cosY + pos.z * sinY;
    tz       = -pos.x * sinY + pos.z * cosY;
    pos.x = tx; pos.z = tz;

    // ── 6. Fragment outputs ───────────────────────────────────
    vWave  = clamp(waveVal * 0.5 + 0.5, 0.0, 1.0);
    vHue   = fract(aU * 0.6 + aV * 0.4 + uTime * 0.04);
    vGlow  = clamp(abs(waveVal) + pulseWave * 0.5, 0.0, 1.0);

    vec4  mvPos = modelViewMatrix * vec4(pos, 1.0);
    float depth = length(mvPos.xyz);
    vDepth = 1.0 - clamp((depth - 6.0) / 22.0, 0.0, 1.0);

    // Per-particle twinkle
    float twinkle = 0.75 + sin(uTime * 3.5 + aPhase * 6.28318) * 0.25;
    float sz = (aSize + abs(waveVal) * 0.7) * (520.0 / depth) * twinkle;
    gl_PointSize = clamp(sz, 1.6, 14.0);
    gl_Position  = projectionMatrix * mvPos;
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// SPHERE FRAGMENT SHADER  –  gold ↔ blue ↔ aurora rainbow
// ─────────────────────────────────────────────────────────────────────────────
const sphereFragmentShader = `
  varying float vWave;
  varying float vDepth;
  varying float vHue;
  varying float vGlow;

  // HSL to RGB – used for aurora tint
  vec3 hsl2rgb(float h, float s, float l) {
    float c = (1.0 - abs(2.0*l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c*0.5;
    vec3 rgb;
    if      (h < 0.1667) rgb = vec3(c, x, 0.0);
    else if (h < 0.3333) rgb = vec3(x, c, 0.0);
    else if (h < 0.5000) rgb = vec3(0.0, c, x);
    else if (h < 0.6667) rgb = vec3(0.0, x, c);
    else if (h < 0.8333) rgb = vec3(x, 0.0, c);
    else                 rgb = vec3(c, 0.0, x);
    return rgb + m;
  }

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float r  = length(uv) * 2.0;
    if (r > 1.0) discard;

    float core  = 1.0 - smoothstep(0.0, 0.40, r);
    float halo  = 1.0 - smoothstep(0.20, 1.0, r);
    float shape = core * 0.85 + halo * 0.30;

    // Gold ↔ electric blue colour ramp
    vec3 goldDeep   = vec3(0.70, 0.48, 0.03);
    vec3 goldBright = vec3(1.00, 0.88, 0.32);
    vec3 goldShine  = vec3(1.00, 0.98, 0.78);
    vec3 blueMid    = vec3(0.04, 0.52, 1.00);
    vec3 blueGlow   = vec3(0.35, 0.82, 1.00);

    float t    = smoothstep(0.30, 0.72, vWave);
    float tSq  = t * t;
    vec3  gold = mix(goldDeep, mix(goldBright, goldShine, vDepth), vDepth * 1.2);
    vec3  blue = mix(blueMid, blueGlow, vDepth);
    vec3  col  = mix(gold, blue, tSq);

    // Aurora rainbow overlay driven by position + time
    vec3 aurora = hsl2rgb(vHue, 0.90, 0.65);
    col = mix(col, aurora, vGlow * 0.28);

    // Hot-spot electric flash on wave peaks
    col += vec3(0.25, 0.60, 1.00) * vGlow * 0.45;

    float shine = vDepth * (0.85 + vWave * 0.55);
    col *= 0.65 + shine * 0.72;

    float alpha = shape * clamp(vDepth * 1.4, 0.38, 1.0);
    gl_FragColor = vec4(col, alpha * 0.45);  // Reduced from 0.93 to 0.45 to reduce neon blowout
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// ENERGY RING VERTEX SHADER  –  3 tilted rings orbiting the sphere
// ─────────────────────────────────────────────────────────────────────────────
const ringVertexShader = `
  uniform float uTime;
  uniform float uScroll;

  attribute float aAngle;
  attribute float aRingIdx;
  attribute float aSize;

  varying float vBright;
  varying float vRingId;

  void main() {
    float sp    = clamp(uScroll, 0.0, 1.0);
    float fade  = 1.0 - smoothstep(0.0, 0.6, sp);   // fade away as we scroll

    float ringF  = aRingIdx / 2.0;
    float speed  = 0.25 + aRingIdx * 0.18;
    float radius = 7.8 + aRingIdx * 1.1;
    float tiltX  = 0.55 + aRingIdx * 0.65;
    float tiltZ  = 0.30 + aRingIdx * 0.45;

    float a = aAngle + uTime * speed;
    // Elliptical orbit gives natural 3-D feel
    vec3 pos = vec3(
      cos(a) * radius,
      sin(a) * radius * sin(tiltX),
      sin(a) * radius * cos(tiltZ)
    );

    // Slow precession rotation per ring
    float ry = uTime * (0.07 + aRingIdx * 0.03) + aRingIdx * 2.1;
    float cy = cos(ry), sy = sin(ry);
    float nx =  pos.x * cy + pos.z * sy;
    float nz = -pos.x * sy + pos.z * cy;
    pos.x = nx; pos.z = nz;

    vBright = clamp(0.45 + sin(a * 6.0 + uTime * 4.0) * 0.55, 0.0, 1.0);
    vRingId = aRingIdx;

    vec4  mvPos = modelViewMatrix * vec4(pos, 1.0);
    float depth = length(mvPos.xyz);
    gl_PointSize = clamp(aSize * vBright * 350.0 / depth, 0.8, 9.0) * fade;
    gl_Position  = projectionMatrix * mvPos;
  }
`
const ringFragmentShader = `
  varying float vBright;
  varying float vRingId;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float r  = length(uv) * 2.0;
    if (r > 1.0) discard;
    float alpha = (1.0 - smoothstep(0.0, 1.0, r)) * vBright;

    // Ring 0 = cyan-blue, Ring 1 = violet, Ring 2 = gold
    vec3 c0 = vec3(0.20, 0.80, 1.00);
    vec3 c1 = vec3(0.75, 0.30, 1.00);
    vec3 c2 = vec3(1.00, 0.80, 0.20);
    float id = vRingId;
    vec3 col = id < 0.5 ? c0 : (id < 1.5 ? c1 : c2);

    gl_FragColor = vec4(col, alpha * 0.80);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// STARFIELD VERTEX SHADER  –  2000 distant twinkling stars
// ─────────────────────────────────────────────────────────────────────────────
const starVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  varying float vBright;
  varying float vColor;

  void main() {
    // Each star twinkles at its own random frequency
    float freq  = 0.8 + aPhase * 2.5;
    vBright = clamp(0.35 + sin(uTime * freq + aPhase * 6.28318) * 0.65, 0.0, 1.0);
    vColor  = aPhase;   // used to tint some stars warm/cool

    vec4  mvPos = modelViewMatrix * vec4(position, 1.0);
    float depth = length(mvPos.xyz);
    gl_PointSize = clamp(aSize * vBright * 220.0 / depth, 0.4, 3.8);
    gl_Position  = projectionMatrix * mvPos;
  }
`
const starFragmentShader = `
  varying float vBright;
  varying float vColor;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float r  = length(uv) * 2.0;
    if (r > 1.0) discard;
    float alpha = (1.0 - smoothstep(0.0, 0.85, r)) * vBright;

    // Slightly warm or cool tint per star
    vec3 warm = vec3(1.00, 0.92, 0.75);
    vec3 cool = vec3(0.75, 0.88, 1.00);
    vec3 col  = mix(warm, cool, vColor);

    gl_FragColor = vec4(col, alpha * 0.85);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// NEBULA DUST  –  large soft blobs of coloured fog in the background
// ─────────────────────────────────────────────────────────────────────────────
const nebulaVertexShader = `
  uniform float uTime;
  attribute float aSize;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vAlpha = 0.03 + abs(sin(uTime * 0.2 + aPhase * 6.28)) * 0.04;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    float depth = length(mvPos.xyz);
    gl_PointSize = clamp(aSize * 1800.0 / depth, 20.0, 280.0);
    gl_Position  = projectionMatrix * mvPos;
  }
`
const nebulaFragmentShader = `
  uniform float uTime;
  attribute float aPhase;
  varying float vAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float r  = length(uv) * 2.0;
    if (r > 1.0) discard;
    float a = (1.0 - smoothstep(0.0, 1.0, r)) * vAlpha;
    // Alternating blue / violet / teal nebula clouds
    vec3 col = mix(vec3(0.05, 0.15, 0.55), vec3(0.40, 0.05, 0.65), gl_PointCoord.x);
    gl_FragColor = vec4(col, a);
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// STAR FIELD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function StarField() {
  const { geometry, material } = useMemo(() => {
    const COUNT = 2200
    const pos    = new Float32Array(COUNT * 3)
    const sizes  = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 42 + Math.random() * 28
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = r * Math.cos(phi)
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta)
      sizes[i]   = 0.25 + Math.random() * 0.75
      phases[i]  = Math.random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos,    3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,  1))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader:   starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame(({ clock }) => { material.uniforms.uTime.value = clock.elapsedTime })
  return <points geometry={geometry} material={material} />
}

// ─────────────────────────────────────────────────────────────────────────────
// NEBULA DUST COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function NebulaDust() {
  const { geometry, material } = useMemo(() => {
    const COUNT = 30
    const pos    = new Float32Array(COUNT * 3)
    const sizes  = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      pos[i*3]   = (Math.random() - 0.5) * 50
      pos[i*3+1] = (Math.random() - 0.5) * 32
      pos[i*3+2] = -12 - Math.random() * 18
      sizes[i]   = 1.5 + Math.random() * 3.0
      phases[i]  = Math.random()
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos,    3))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,  1))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader:   nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame(({ clock }) => { material.uniforms.uTime.value = clock.elapsedTime })
  return <points geometry={geometry} material={material} />
}

// ─────────────────────────────────────────────────────────────────────────────
// ENERGY RINGS COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function EnergyRings() {
  const scrollRef = useRef(0)
  const { geometry, material } = useMemo(() => {
    const RINGS = 3, PER = 500
    const count    = RINGS * PER
    const angles   = new Float32Array(count)
    const ringIdxs = new Float32Array(count)
    const sizes    = new Float32Array(count)
    const pos      = new Float32Array(count * 3)

    for (let r = 0; r < RINGS; r++) {
      for (let p = 0; p < PER; p++) {
        const idx = r * PER + p
        angles[idx]   = (p / PER) * Math.PI * 2
        ringIdxs[idx] = r
        sizes[idx]    = 0.35 + Math.random() * 0.65
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos,      3))
    geo.setAttribute('aAngle',   new THREE.BufferAttribute(angles,   1))
    geo.setAttribute('aRingIdx', new THREE.BufferAttribute(ringIdxs, 1))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,    1))

    const mat = new THREE.ShaderMaterial({
      vertexShader:   ringVertexShader,
      fragmentShader: ringFragmentShader,
      uniforms: {
        uTime:   { value: 0 },
        uScroll: { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    return { geometry: geo, material: mat }
  }, [])

  useFrame(({ clock }) => {
    const maxS = document.documentElement.scrollHeight - window.innerHeight
    const raw  = maxS > 0 ? window.scrollY / maxS : 0
    scrollRef.current += (raw - scrollRef.current) * 0.05
    material.uniforms.uTime.value   = clock.elapsedTime
    material.uniforms.uScroll.value = scrollRef.current
  })

  return <points geometry={geometry} material={material} />
}

// ─────────────────────────────────────────────────────────────────────────────
// WAVE SPHERE COMPONENT  –  main particle sphere + plane morph
// ─────────────────────────────────────────────────────────────────────────────
function WaveSphere() {
  const meshRef   = useRef()
  const scrollRef = useRef(0)
  const mouseRef  = useRef(new THREE.Vector2())

  const { geometry, material } = useMemo(() => {
    const U = 220, V = 130
    const count = U * V
    const pos   = new Float32Array(count * 3)
    const uArr  = new Float32Array(count)
    const vArr  = new Float32Array(count)
    const size  = new Float32Array(count)
    const phase = new Float32Array(count)

    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const idx = i * V + j
        const u   = i / (U - 1)
        const v   = j / (V - 1)
        const theta = u * Math.PI * 2
        const phi   = Math.acos(1 - 2 * v)   // uniform spherical distribution
        pos[idx*3]   = 6 * Math.sin(phi) * Math.cos(theta)
        pos[idx*3+1] = 6 * Math.cos(phi)
        pos[idx*3+2] = 6 * Math.sin(phi) * Math.sin(theta)
        uArr[idx]  = u
        vArr[idx]  = v
        size[idx]  = 1.1 + Math.random() * 1.4
        phase[idx] = Math.random()
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos,   3))
    geo.setAttribute('aU',       new THREE.BufferAttribute(uArr,  1))
    geo.setAttribute('aV',       new THREE.BufferAttribute(vArr,  1))
    geo.setAttribute('aSize',    new THREE.BufferAttribute(size,  1))
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phase, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader:   sphereVertexShader,
      fragmentShader: sphereFragmentShader,
      uniforms: {
        uTime:   { value: 0 },
        uScroll: { value: 0 },
        uMouse:  { value: new THREE.Vector2() },
        uPulse:  { value: 0 },
      },
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    })
    return { geometry: geo, material: mat }
  }, [])

  useEffect(() => {
    const onMove = e => {
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const maxS = document.documentElement.scrollHeight - window.innerHeight
    const raw  = maxS > 0 ? window.scrollY / maxS : 0
    scrollRef.current += (raw - scrollRef.current) * 0.05

    material.uniforms.uMouse.value.x += (mouseRef.current.x - material.uniforms.uMouse.value.x) * 0.04
    material.uniforms.uMouse.value.y += (mouseRef.current.y - material.uniforms.uMouse.value.y) * 0.04
    material.uniforms.uTime.value    = t
    material.uniforms.uScroll.value  = scrollRef.current
    // Pulse intensity breathes in and out
    material.uniforms.uPulse.value   = (Math.sin(t * 1.8) * 0.5 + 0.5) * 0.35

    if (meshRef.current) {
      const sp = scrollRef.current
      meshRef.current.rotation.y = t * 0.06 * (1 - sp)
      meshRef.current.rotation.z = Math.sin(t * 0.07) * 0.04 * (1 - sp)
      meshRef.current.position.y = sp * -1.0
    }
  })

  return <points ref={meshRef} geometry={geometry} material={material} />
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function QuantumBackground() {
  return (
    <>
      {/* ── WebGL canvas ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: '#020109',
      }}>
        <Canvas
          camera={{ position: [0, 0, 16], fov: 52 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={['#020109']} />
          <fog attach="fog" args={['#020109', 22, 65]} />
          <NebulaDust />
          <StarField />
          <WaveSphere />
          <EnergyRings />
        </Canvas>
      </div>

      {/* ── Deep-space radial vignette & dark overlay ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `radial-gradient(ellipse 135% 135% at 50% 50%,
          rgba(2, 4, 18, 0.45) 15%,
          rgba(2, 8, 45, 0.70) 66%,
          rgba(1, 4, 22, 0.95) 100%)`,
      }} />

      {/* ── Warm gold pulse at center ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 52% 52% at 50% 48%, rgba(55,28,6,0.06) 0%, transparent 70%)',
      }} />

      {/* ── Electric blue top-edge glow ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '28vh',
        zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(15,55,140,0.06) 0%, transparent 100%)',
      }} />

      {/* ── Bottom fade to deep space ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: '22vh',
        zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(1,3,18,0.80) 0%, transparent 100%)',
      }} />

      {/* ── Film grain ── */}
      <div className="grain-overlay" style={{
        position: 'fixed', top: '-10%', left: '-10%',
        width: '120vw', height: '120vh',
        zIndex: 2, pointerEvents: 'none',
        opacity: 0.038, mixBlendMode: 'overlay',
      }} />
    </>
  )
}
