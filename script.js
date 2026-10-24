/* ═══════════════════════════════════════════════════════════════
   TANISH SHRIYAN — EMOTION AGENCY MASTER SCRIPT
   - Preloader with Audio Gate (Enter with audio / silent)
   - Real-time 3D Twilight Landscape & Sculptural Particle Monolith
   - Scroll-driven Storytelling Camera Choreography
   - Web Audio API Sound Synthesizer & Waveform Canvas
   - Project Telemetry Canvases & Certificate 3D Carousel
   - Settings Modal & Mobile Nav Dock
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Helpers & Feature Detection ───────────────────────────
const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const lerp = (a, b, t) => a + (b - a) * t;

const HAS_WEBGL = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  } catch { return false; }
})();

const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isAudioEnabled = false;
let audioCtx = null;
let ambientOsc1 = null, ambientOsc2 = null, ambientGain = null;

// ─── 1. PRELOADER & ENTRANCE GATE ──────────────────────────
const pageLoader = $('#pageLoader');
const loaderBarFill = $('#loaderBarFill');
const loaderPercent = $('#loaderPercent');
const loaderActions = $('#loaderActions');
const loaderProgressWrap = $('#loaderProgressWrap');

let loadProgress = 0;
const loadStartTime = performance.now();

function simulateLoader() {
  const elapsed = performance.now() - loadStartTime;
  // Progress curve that feels natural and hits 100% in ~1.8 seconds
  if (loadProgress < 100) {
    loadProgress = Math.min(100, Math.floor(elapsed / 18));
    if (loaderBarFill) loaderBarFill.style.transform = `scaleX(${loadProgress / 100})`;
    if (loaderPercent) loaderPercent.textContent = `${String(loadProgress).padStart(3, '0')}%`;
    requestAnimationFrame(simulateLoader);
  } else {
    // Show Enter Actions when 100% is reached
    if (loaderProgressWrap) loaderProgressWrap.style.display = 'none';
    if (loaderActions) loaderActions.classList.add('is-visible');
  }
}
simulateLoader();

function enterSite(withAudio = false) {
  if (withAudio) {
    enableAudio();
  }
  if (pageLoader) {
    pageLoader.classList.add('is-hidden');
    document.body.setAttribute('aria-busy', 'false');
    setTimeout(() => {
      pageLoader.remove();
      initSpeechBubble();
    }, 800);
  }
}

$('#enterWithAudioBtn')?.addEventListener('click', () => enterSite(true));
$('#enterSilentBtn')?.addEventListener('click', () => enterSite(false));

// ─── 2. WEB AUDIO API SYNTHESIZER & WAVEFORM CANVAS ───────
function initAudioContext() {
  if (audioCtx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioCtx = new AudioContext();

  // Create ethereal ambient chords (Twilight frequencies: 108Hz & 162Hz)
  ambientGain = audioCtx.createGain();
  ambientGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  ambientGain.connect(audioCtx.destination);

  ambientOsc1 = audioCtx.createOscillator();
  ambientOsc1.type = 'sine';
  ambientOsc1.frequency.setValueAtTime(108, audioCtx.currentTime);
  ambientOsc1.connect(ambientGain);
  ambientOsc1.start();

  ambientOsc2 = audioCtx.createOscillator();
  ambientOsc2.type = 'triangle';
  ambientOsc2.frequency.setValueAtTime(162, audioCtx.currentTime);
  ambientOsc2.connect(ambientGain);
  ambientOsc2.start();
}

function enableAudio() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  isAudioEnabled = true;
  if (ambientGain && audioCtx) {
    ambientGain.gain.exponentialRampToValueAtTime(0.04, audioCtx.currentTime + 1.2);
  }
  updateAudioUi(true);
}

function disableAudio() {
  isAudioEnabled = false;
  if (ambientGain && audioCtx) {
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
  }
  updateAudioUi(false);
}

function toggleAudio() {
  if (isAudioEnabled) disableAudio();
  else enableAudio();
}

function playUiChime(freq = 520, duration = 0.18) {
  if (!isAudioEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch {}
}

function updateAudioUi(enabled) {
  const btn = $('#soundVizBtn');
  const icon = $('#soundVizIcon');
  const toggle = $('#soundToggle');
  const mobileToggle = $('#mobileSoundToggle');

  if (btn) btn.setAttribute('aria-pressed', String(enabled));
  if (icon) icon.textContent = enabled ? '🔊' : '🔇';
  if (toggle) toggle.textContent = enabled ? 'ON' : 'OFF';
  if (mobileToggle) mobileToggle.textContent = enabled ? 'ON' : 'OFF';
}

$('#soundVizBtn')?.addEventListener('click', toggleAudio);
$('#soundToggle')?.addEventListener('click', toggleAudio);
$('#mobileSoundToggle')?.addEventListener('click', toggleAudio);

// Sound Waveform Canvas Animation
const soundCanvas = $('#soundVizCanvas');
if (soundCanvas) {
  const sCtx = soundCanvas.getContext('2d');
  soundCanvas.width = 56;
  soundCanvas.height = 28;

  let wavePhase = 0;
  function drawSoundWave() {
    requestAnimationFrame(drawSoundWave);
    sCtx.clearRect(0, 0, soundCanvas.width, soundCanvas.height);

    const bars = 4;
    const barW = 3;
    const gap = 4;
    const startX = (soundCanvas.width - (bars * barW + (bars - 1) * gap)) / 2;

    for (let i = 0; i < bars; i++) {
      let h = 4;
      if (isAudioEnabled) {
        h = 5 + Math.sin(wavePhase + i * 1.2) * 8 + Math.cos(wavePhase * 1.5 + i) * 4;
        h = clamp(h, 3, 20);
      }
      const x = startX + i * (barW + gap);
      const y = (soundCanvas.height - h) / 2;
      sCtx.fillStyle = isAudioEnabled ? '#9047ff' : '#64698b';
      sCtx.beginPath();
      sCtx.roundRect(x, y, barW, h, 2);
      sCtx.fill();
    }
    wavePhase += 0.1;
  }
  drawSoundWave();
}

// ─── 3. MAGNETIC DESKTOP CURSOR ───────────────────────────
const cursorRing = $('#cursorRing');
const cursorDot = $('#cursorDot');
let mouseX = -100, mouseY = -100;
let ringX = -100, ringY = -100;

if (cursorRing && cursorDot && window.innerWidth > 1024) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
  }, { passive: true });

  (function renderCursor() {
    ringX = lerp(ringX, mouseX, 0.14);
    ringY = lerp(ringY, mouseY, 0.14);
    cursorRing.style.transform = `translate(calc(-50% + ${ringX}px), calc(-50% + ${ringY}px))`;
    requestAnimationFrame(renderCursor);
  })();
}

// Sound chime on clickable links
$$('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => playUiChime(640, 0.08));
});

// ─── 4. THREE.JS 3D TWILIGHT SCENE (Exact Emotion Agency Match) ──
let scene, camera, renderer;
let particleMonolith, waterMesh, mountainGroup, hillsGroup, floatingMotes, pebbleGroup;
let grassBlades = [];
let targetCameraY = 1.2, targetCameraX = 0, targetCameraZ = 6.2;
let targetLookAtY = 1.0;
let currentScrollProgress = 0;

function initThreeScene() {
  const canvas = $('#webglCanvas');
  if (!canvas || !HAS_WEBGL || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();

  // Dynamic Canvas Sky Gradient matching Emotion Agency (#9b76bd top to #dcbbf2 horizon)
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 16;
  skyCanvas.height = 512;
  const skyCtx = skyCanvas.getContext('2d');
  const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
  skyGrad.addColorStop(0.0, '#9b76bd'); // sampled lilac purple at top
  skyGrad.addColorStop(0.38, '#c5a0e0'); // sampled mid-sky lavender
  skyGrad.addColorStop(0.72, '#dcbbf2'); // warm glowing twilight horizon
  skyGrad.addColorStop(1.0, '#5c1f7a'); // purple lake reflection
  skyCtx.fillStyle = skyGrad;
  skyCtx.fillRect(0, 0, 16, 512);
  const skyTexture = new THREE.CanvasTexture(skyCanvas);
  scene.background = skyTexture;
  scene.fog = new THREE.Fog(0xdcbbf2, 22, 60);

  const w = window.innerWidth;
  const h = window.innerHeight;

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.set(0, 1.25, 6.4);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  // ─── Lighting ───
  // Soft ambient twilight
  const ambientLight = new THREE.AmbientLight(0xcba4e7, 1.25);
  scene.add(ambientLight);

  // Directional twilight sun rim light
  const sunLight = new THREE.DirectionalLight(0xffe8fa, 1.5);
  sunLight.position.set(3, 8, -4);
  scene.add(sunLight);

  // Glowing center point light inside the particle sculpture
  const corePointLight = new THREE.PointLight(0xffb8ff, 3.2, 14);
  corePointLight.position.set(0, 2.35, 0);
  scene.add(corePointLight);

  // ─── Reflective Mirror Lake Surface (Calm velvety twilight lake #38154e) ───
  const waterGeo = new THREE.PlaneGeometry(80, 50, 64, 48);
  const waterMat = new THREE.MeshBasicMaterial({
    color: 0x38154e,
    transparent: true,
    opacity: 0.94
  });
  waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2;
  waterMesh.position.set(0, -1.05, -12);
  scene.add(waterMesh);

  // ─── Distant Low-Poly Mountain / Bluff Silhouette ───
  mountainGroup = new THREE.Group();
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x4e2068,
    roughness: 0.88,
    metalness: 0.12,
    flatShading: true
  });

  // Faceted rock bluffs and mesas across the lake horizon in distance
  for (let i = -18; i <= 18; i++) {
    const rRadiusTop = 0.8 + Math.random() * 0.8;
    const rRadiusBottom = 1.2 + Math.random() * 1.0;
    const rHeight = 1.2 + Math.abs(Math.sin(i * 0.45)) * 1.6 + Math.random() * 0.6;
    const rSegments = 5 + Math.floor(Math.random() * 3);
    const rGeo = new THREE.CylinderGeometry(rRadiusTop, rRadiusBottom, rHeight, rSegments);
    
    // Jitter vertices for natural faceted rock bluff appearance
    const pos = rGeo.attributes.position;
    for (let p = 0; p < pos.count; p++) {
      pos.setX(p, pos.getX(p) + (Math.random() - 0.5) * 0.22);
      pos.setZ(p, pos.getZ(p) + (Math.random() - 0.5) * 0.22);
    }
    rGeo.computeVertexNormals();

    const rMesh = new THREE.Mesh(rGeo, rockMat);
    const rx = i * 1.8 + (Math.random() - 0.5) * 0.9;
    const rz = -22 + (Math.random() - 0.5) * 6;
    rMesh.position.set(rx, -1.05 + rHeight / 2 - 0.15, rz);
    rMesh.rotation.y = Math.random() * Math.PI;
    rMesh.rotation.z = (Math.random() - 0.5) * 0.1;
    mountainGroup.add(rMesh);
  }
  scene.add(mountainGroup);

  // ─── Foreground Meadow with Dense Grass Blades (Exact Emotion Agency Match) ───
  hillsGroup = new THREE.Group();
  grassBlades = [];

  // 1200 individual violet grass blades swaying along the foreground!
  const grassPalette = [0x651087, 0x7e1ca7, 0x9328c2, 0x560b73, 0xa838dc];
  const grassCount = 1200;
  const bladeGeo = new THREE.ConeGeometry(0.045, 0.85, 3);
  bladeGeo.translate(0, 0.425, 0); // Pivot at blade base

  for (let b = 0; b < grassCount; b++) {
    const col = grassPalette[Math.floor(Math.random() * grassPalette.length)];
    const bladeMat = new THREE.MeshBasicMaterial({ color: col });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);

    const bx = (Math.random() - 0.5) * 22;
    const bz = 4.2 + Math.random() * 1.8;
    const by = -0.65 + (bz - 4.2) * 0.22 + (Math.random() - 0.5) * 0.08;
    const initRotZ = (Math.random() - 0.5) * 0.45;
    const initRotX = (Math.random() - 0.5) * 0.25;

    blade.position.set(bx, by, bz);
    blade.rotation.set(initRotX, Math.random() * Math.PI, initRotZ);
    blade.userData = { initRotZ, speed: 1.8 + Math.random() * 1.5, offset: bx * 0.8 + bz };

    hillsGroup.add(blade);
    grassBlades.push(blade);
  }
  scene.add(hillsGroup);

  // ─── Monumental Central Floating Particle Monolith (Exact Emotion Symbol) ───
  // 1200 glowing spheres forming the sculpted organic mark above the water
  const pCount = 1200;
  const pGeo = new THREE.SphereGeometry(0.044, 8, 8);
  const pPalette = [0xffffff, 0xffd9fa, 0xec4899, 0xd946ef, 0xa855f7, 0x9333ea];

  particleMonolith = new THREE.Group();
  particleMonolith.userData = {
    initialPositions: [],
    speeds: [],
    chapter3Positions: [],
    chapter5Positions: []
  };

  for (let i = 0; i < pCount; i++) {
    const cVal = pPalette[Math.floor(Math.random() * pPalette.length)];
    const pMat = new THREE.MeshBasicMaterial({ color: cVal, transparent: true, opacity: 0.92 });
    const pMesh = new THREE.Mesh(pGeo, pMat);

    // Toroidal / open-loop spiral distribution matching Emotion Agency's sculpted mark
    const t = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const ringR = 1.05 + (Math.random() - 0.5) * 0.2;
    const tubeR = 0.38 * (0.6 + Math.random() * 0.7);

    let px, py, pz;
    if (i % 5 === 0) {
      px = (Math.random() - 0.5) * 0.85;
      py = 0.05 + (Math.random() - 0.5) * 0.25;
      pz = (Math.random() - 0.5) * 0.35;
    } else {
      px = (ringR + tubeR * Math.cos(phi)) * Math.cos(t) * 0.88;
      py = (ringR + tubeR * Math.cos(phi)) * Math.sin(t) * 1.18;
      pz = tubeR * Math.sin(phi) * 0.82;
    }

    pMesh.position.set(px, py, pz);
    particleMonolith.userData.initialPositions.push(new THREE.Vector3(px, py, pz));
    particleMonolith.userData.speeds.push(1.0 + Math.random() * 1.2);

    // Chapter 3 positions: expansive sky canopy (scroll_3_y5000.png)
    const skyAngle = Math.random() * Math.PI * 2;
    const skyDist = Math.random() * 3.8;
    const c3x = Math.cos(skyAngle) * skyDist;
    const c3y = 2.4 + Math.sin(skyAngle) * (skyDist * 0.45) + (Math.random() - 0.5) * 0.8;
    const c3z = (Math.random() - 0.5) * 2.5;
    particleMonolith.userData.chapter3Positions.push(new THREE.Vector3(c3x, c3y, c3z));

    // Chapter 5 positions: concentrated starlight core (scroll_5_y11000.png)
    const c5u = Math.random() * Math.PI * 2;
    const c5v = Math.acos(2 * Math.random() - 1);
    const c5r = 0.85 * Math.cbrt(Math.random());
    const c5x = c5r * Math.sin(c5v) * Math.cos(c5u);
    const c5y = c5r * Math.sin(c5v) * Math.sin(c5u);
    const c5z = c5r * Math.cos(c5v);
    particleMonolith.userData.chapter5Positions.push(new THREE.Vector3(c5x, c5y, c5z));

    particleMonolith.add(pMesh);
  }

  particleMonolith.position.set(0, 2.2, 0);
  particleMonolith.scale.set(0.82, 0.82, 0.82);
  scene.add(particleMonolith);

  // ─── Floating Dark Pebbles & Embers (Exact Emotion Agency Match) ───
  const pebbleMat = new THREE.MeshStandardMaterial({
    color: 0x3a154d,
    roughness: 0.9,
    metalness: 0.1,
    flatShading: true
  });
  pebbleGroup = new THREE.Group();
  for (let k = 0; k < 40; k++) {
    const pebbleGeo = new THREE.DodecahedronGeometry(0.045 + Math.random() * 0.04, 0);
    const pebble = new THREE.Mesh(pebbleGeo, pebbleMat);
    pebble.position.set(
      (Math.random() - 0.5) * 16,
      0.2 + Math.random() * 2.0,
      -4 + (Math.random() - 0.5) * 6
    );
    pebble.userData = {
      rotSpdX: (Math.random() - 0.5) * 0.02,
      rotSpdY: (Math.random() - 0.5) * 0.02,
      floatOffset: Math.random() * Math.PI * 2
    };
    pebbleGroup.add(pebble);
  }
  scene.add(pebbleGroup);

  // ─── Floating Atmospheric Dust Motes ───
  const moteCount = 180;
  const moteGeo = new THREE.BufferGeometry();
  const motePos = new Float32Array(moteCount * 3);
  for (let m = 0; m < moteCount * 3; m += 3) {
    motePos[m] = (Math.random() - 0.5) * 18;
    motePos[m + 1] = 0.2 + Math.random() * 6;
    motePos[m + 2] = (Math.random() - 0.5) * 12;
  }
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  const moteMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.045,
    transparent: true,
    opacity: 0.65
  });
  floatingMotes = new THREE.Points(moteGeo, moteMat);
  scene.add(floatingMotes);

  // ─── Responsive Resize ───
  window.addEventListener('resize', () => {
    const nw = window.innerWidth;
    const nh = window.innerHeight;
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  }, { passive: true });

  // ─── Mouse Tilt Parallax ───
  let targetTiltX = 0, targetTiltY = 0;
  window.addEventListener('mousemove', (e) => {
    targetTiltX = ((e.clientX / window.innerWidth) - 0.5) * 0.45;
    targetTiltY = ((e.clientY / window.innerHeight) - 0.5) * 0.25;
  }, { passive: true });

  // ─── Render Loop ───
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.014;

    if (!PREFERS_REDUCED_MOTION) {
      // Wind swaying on foreground grass blades
      for (let b = 0; b < grassBlades.length; b++) {
        const blade = grassBlades[b];
        blade.rotation.z = blade.userData.initRotZ + Math.sin(time * blade.userData.speed + blade.userData.offset) * 0.09;
      }

      // Tumbling pebbles
      if (pebbleGroup) {
        for (let k = 0; k < pebbleGroup.children.length; k++) {
          const p = pebbleGroup.children[k];
          p.rotation.x += p.userData.rotSpdX;
          p.rotation.y += p.userData.rotSpdY;
          p.position.y += Math.sin(time * 1.5 + p.userData.floatOffset) * 0.002;
        }
      }

      // Sculptural Monolith Organic Breathing & Rotation
      particleMonolith.rotation.y = time * 0.09 + targetTiltX * 0.3;
      particleMonolith.rotation.x = Math.sin(time * 0.22) * 0.06 - targetTiltY * 0.2;

      // Particle morph based on scrollProgress
      const children = particleMonolith.children;
      for (let i = 0; i < children.length; i++) {
        const init = particleMonolith.userData.initialPositions[i];
        const c3 = particleMonolith.userData.chapter3Positions[i];
        const c5 = particleMonolith.userData.chapter5Positions[i];
        const spd = particleMonolith.userData.speeds[i];
        const pulse = 1 + Math.sin(time * spd * 1.4 + i * 0.15) * 0.08;

        let tx = init.x * pulse;
        let ty = init.y * pulse;
        let tz = init.z * pulse;

        // Smoothly blend to Chapter 3 (canopy) or Chapter 5 (core) if in scroll range
        if (currentScrollProgress > 0.35 && currentScrollProgress < 0.75) {
          const factor = Math.sin((currentScrollProgress - 0.35) / 0.4 * Math.PI);
          tx = lerp(tx, c3.x, factor * 0.85);
          ty = lerp(ty, c3.y, factor * 0.85);
          tz = lerp(tz, c3.z, factor * 0.85);
        } else if (currentScrollProgress >= 0.75) {
          const factor = Math.min(1, (currentScrollProgress - 0.75) / 0.25);
          tx = lerp(tx, c5.x * pulse, factor * 0.9);
          ty = lerp(ty, c5.y * pulse, factor * 0.9);
          tz = lerp(tz, c5.z * pulse, factor * 0.9);
        }

        children[i].position.set(tx, ty, tz);
      }

      // Gentle Water Ripples
      if (waterMesh) {
        waterMesh.rotation.z = Math.sin(time * 0.25) * 0.008;
      }

      // Floating Motes Drift
      if (floatingMotes) {
        floatingMotes.rotation.y = time * 0.02;
      }
    }

    // Smooth Camera Choreography to Target Coordinates
    camera.position.x = lerp(camera.position.x, targetCameraX + targetTiltX * 0.6, 0.05);
    camera.position.y = lerp(camera.position.y, targetCameraY - targetTiltY * 0.4, 0.05);
    camera.position.z = lerp(camera.position.z, targetCameraZ, 0.05);
    camera.lookAt(0, targetLookAtY, 0);

    renderer.render(scene, camera);
  }
  animate();
}

// ─── 5. SCROLL-DRIVEN STORYTELLING CAMERA CHOREOGRAPHY ─────
const heroStorytelling = $('#heroStorytelling');
const heroScreens = $$('.hero-screen');

function updateStorytellingCamera(scrollProgress) {
  currentScrollProgress = scrollProgress;
  // scrollProgress ranges from 0.0 to 1.0 throughout the 5 storytelling chapters
  // 5 Chapter Cutoffs: 0.0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0
  let activeIndex = 0;
  if (scrollProgress >= 0.8) activeIndex = 4;
  else if (scrollProgress >= 0.6) activeIndex = 3;
  else if (scrollProgress >= 0.4) activeIndex = 2;
  else if (scrollProgress >= 0.2) activeIndex = 1;

  heroScreens.forEach((screen, i) => {
    screen.classList.toggle('active', i === activeIndex);
  });

  // Choreograph 3D Camera & Sculptural Monolith by chapter
  if (scrollProgress < 0.25) {
    // Chapter 1: Eye-level vista, particle monolith centered
    targetCameraX = 0;
    targetCameraY = 1.2;
    targetCameraZ = 6.2;
    targetLookAtY = 1.0;
    if (particleMonolith) particleMonolith.position.x = lerp(particleMonolith.position.x, 0, 0.06);
  } else if (scrollProgress < 0.48) {
    // Chapter 2: Camera shifts left, particle monolith shifts right (scroll_2_y2500.png)
    targetCameraX = -1.2;
    targetCameraY = 1.4;
    targetCameraZ = 5.8;
    targetLookAtY = 1.2;
    if (particleMonolith) particleMonolith.position.x = lerp(particleMonolith.position.x, 1.8, 0.06);
  } else if (scrollProgress < 0.72) {
    // Chapter 3: Camera lowers into violet grass, looks up as monolith expands into sky (scroll_3_y5000.png)
    targetCameraX = 0;
    targetCameraY = 0.35;
    targetCameraZ = 5.0;
    targetLookAtY = 2.4;
    if (particleMonolith) particleMonolith.position.x = lerp(particleMonolith.position.x, 0, 0.06);
  } else if (scrollProgress < 0.88) {
    // Chapter 4: Camera glides along water edge
    targetCameraX = 1.4;
    targetCameraY = 1.3;
    targetCameraZ = 5.5;
    targetLookAtY = 1.2;
    if (particleMonolith) particleMonolith.position.x = lerp(particleMonolith.position.x, -1.6, 0.06);
  } else {
    // Chapter 5: Grand pulls back vista (scroll_5_y11000.png)
    targetCameraX = 0;
    targetCameraY = 1.6;
    targetCameraZ = 6.8;
    targetLookAtY = 1.1;
    if (particleMonolith) particleMonolith.position.x = lerp(particleMonolith.position.x, 0, 0.06);
  }

  // Fade out 3D canvas when entering the white/lavender editorial content
  const gl = $('#gl');
  if (gl) {
    gl.style.opacity = scrollProgress > 0.98 ? String(Math.max(0, 1 - (scrollProgress - 0.98) * 12)) : '1';
  }
}

// ─── 6. SCROLL LISTENER & HEADER COMPACTING ────────────────
const siteHeader = $('#siteHeader');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Header compact/glass state
  if (siteHeader) {
    siteHeader.classList.toggle('is-scrolled', scrollY > 80);
  }

  // Storytelling scroll progress
  if (heroStorytelling) {
    const rect = heroStorytelling.getBoundingClientRect();
    const totalScroll = heroStorytelling.offsetHeight - window.innerHeight;
    const currentScroll = Math.max(0, -rect.top);
    const progress = clamp(currentScroll / totalScroll, 0, 1);
    updateStorytellingCamera(progress);
  }
}, { passive: true });

// ─── 7. INTERACTIVE PROJECT CANVASES ───────────────────────
// Telemetry Scanner for Ransomware System
function initRansomwareVisualizer() {
  const canvas = $('#ransomwareCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 440;

  const barCount = 36;
  const bars = Array.from({ length: barCount }, () => Math.random() * 0.5 + 0.1);
  let phase = 0;

  function render() {
    requestAnimationFrame(render);
    ctx.fillStyle = '#0d0b18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(144, 71, 255, 0.12)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Telemetry Activity Bars
    const bw = 10;
    const gap = 6;
    const startX = (canvas.width - (barCount * (bw + gap))) / 2;

    bars.forEach((val, i) => {
      const isSpike = (i > 14 && i < 22 && Math.sin(phase * 2) > 0.3);
      const h = (val * 160) + (isSpike ? 80 + Math.sin(phase * 4 + i) * 35 : Math.sin(phase + i * 0.4) * 20);
      const bx = startX + i * (bw + gap);
      const by = canvas.height - 80 - h;

      ctx.fillStyle = isSpike ? '#ff3b30' : (i % 2 === 0 ? '#9047ff' : '#caa6ff');
      ctx.shadowColor = isSpike ? '#ff3b30' : '#9047ff';
      ctx.shadowBlur = isSpike ? 14 : 6;
      ctx.beginPath();
      ctx.roundRect(bx, by, bw, h, 3);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Telemetry Status HUD
    ctx.font = '10px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#caa6ff';
    ctx.fillText('STATUS: MONITORING ENCRYPTION VELOCITY', 30, 40);
    ctx.fillStyle = '#ff3b30';
    ctx.fillText('ANOMALY THRESHOLD: ZERO-DAY DETECTED', 30, 60);

    phase += 0.04;
  }
  render();
}

// Radar Classifier for Phishing System
function initPhishingVisualizer() {
  const canvas = $('#phishingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 640;
  canvas.height = 440;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  let angle = 0;

  function render() {
    requestAnimationFrame(render);
    ctx.fillStyle = '#0d0b18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Concentric Radar Rings
    for (let r = 50; r <= 180; r += 40) {
      ctx.strokeStyle = 'rgba(144, 71, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rotating Radar Sweep
    const rx = cx + Math.cos(angle) * 180;
    const ry = cy + Math.sin(angle) * 180;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
    grad.addColorStop(0, 'rgba(144, 71, 255, 0.35)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 180, angle - 0.45, angle);
    ctx.fill();

    // Classification Points (Tokens)
    const points = [
      { a: 0.8, d: 90, label: 'entropy: high', alert: true },
      { a: 2.1, d: 130, label: 'tokens: @-redirect', alert: true },
      { a: 3.6, d: 75, label: 'tld: suspicious', alert: true },
      { a: 4.8, d: 140, label: 'domain_age: 2d', alert: false },
      { a: 5.7, d: 100, label: 'length: 148', alert: true }
    ];

    points.forEach(pt => {
      const px = cx + Math.cos(pt.a) * pt.d;
      const py = cy + Math.sin(pt.a) * pt.d;
      ctx.fillStyle = pt.alert ? '#ff3b30' : '#319f43';
      ctx.shadowColor = pt.alert ? '#ff3b30' : '#319f43';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(pt.label, px + 8, py + 3);
    });

    // Center Core
    ctx.fillStyle = '#9047ff';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    angle += 0.025;
  }
  render();
}

// ─── 8. INTERACTIVE FLUID GRADIENTS FOR BUTTONS ───────────
function initButtonGradients() {
  $$('.button__gradient').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    canvas.width = 160;
    canvas.height = 60;
    let p = Math.random() * 10;

    function draw() {
      requestAnimationFrame(draw);
      p += 0.02;
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const r1 = Math.sin(p) * 0.5 + 0.5;
      g.addColorStop(0, `rgba(144, 71, 255, 0.95)`);
      g.addColorStop(r1, `rgba(113, 20, 255, 0.85)`);
      g.addColorStop(1, `rgba(175, 90, 255, 0.95)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    draw();
  });
}

// ─── 9. CERTIFICATE 3D CAROUSEL ───────────────────────────
function initCertificateCarousel() {
  const track = $('#certTrack');
  const dotsWrap = $('#certDots');
  const prevBtn = $('#certPrev');
  const nextBtn = $('#certNext');
  if (!track || !dotsWrap) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let activeIndex = 0;

  // Build Dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'cert-dot';
    dot.setAttribute('aria-label', `Certificate ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function render() {
    cards.forEach((card, i) => {
      let offset = i - activeIndex;
      if (offset > total / 2) offset -= total;
      if (offset < -total / 2) offset += total;

      let pos = 'hidden';
      if (offset === 0) pos = 'center';
      else if (offset === -1) pos = 'left1';
      else if (offset === 1) pos = 'right1';
      else if (offset === -2) pos = 'left2';
      else if (offset === 2) pos = 'right2';

      card.dataset.pos = pos;
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeIndex);
    });
  }

  function goTo(idx) {
    activeIndex = ((idx % total) + total) % total;
    render();
    playUiChime(720, 0.05);
  }

  prevBtn?.addEventListener('click', () => goTo(activeIndex - 1));
  nextBtn?.addEventListener('click', () => goTo(activeIndex + 1));

  // Touch Swipe on Stage
  const stage = $('#certStage');
  let startX = null;
  stage?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  stage?.addEventListener('touchend', e => {
    if (startX === null) return;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) goTo(activeIndex + (delta < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  render();
}

// ─── 10. SETTINGS MODAL & 12-COL GRID CONTROLLER ───────────
const settingsTrigger = $('#settingsTrigger');
const settingsContent = $('#settingsContent');
const gridToggle = $('#gridToggle');
const appGrid = $('#appGrid');
const themeToggle = $('#themeToggle');
const mobileThemeToggle = $('#mobileThemeToggle');

settingsTrigger?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = settingsContent.classList.toggle('is-open');
  settingsTrigger.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (e) => {
  if (settingsContent && !settingsContent.contains(e.target) && !settingsTrigger?.contains(e.target)) {
    settingsContent.classList.remove('is-open');
    settingsTrigger?.setAttribute('aria-expanded', 'false');
  }
});

// Grid Overlay Toggle
gridToggle?.addEventListener('click', () => {
  const isVisible = appGrid?.classList.toggle('is-visible');
  gridToggle.textContent = isVisible ? 'SHOW' : 'HIDE';
});

// Theme Mode Toggle (Light / Dark)
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  if (themeToggle) themeToggle.textContent = next.toUpperCase();
  if (mobileThemeToggle) mobileThemeToggle.textContent = next.toUpperCase();
}
themeToggle?.addEventListener('click', toggleTheme);
mobileThemeToggle?.addEventListener('click', toggleTheme);

// ─── 11. MOBILE NAV DOCK CONTROLLER ───────────────────────
const mobileNav = $('#mobileNav');
const mobileNavBurger = $('#mobileNavBurger');
const mobileNavOverlay = $('#mobileNavOverlay');

function toggleMobileNav() {
  const isExpanded = mobileNav?.classList.toggle('is-expanded');
  mobileNavBurger?.setAttribute('aria-expanded', String(isExpanded));
}

mobileNavBurger?.addEventListener('click', toggleMobileNav);
mobileNavOverlay?.addEventListener('click', toggleMobileNav);
$$('.mobile-nav__link').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav?.classList.remove('is-expanded');
    mobileNavBurger?.setAttribute('aria-expanded', 'false');
  });
});

// ─── 12. SPEECH BUBBLE & ASSISTANT CONTROLLER ──────────────
const aiBubble = $('#aiBubble');
const desktopAiBtn = $('#desktopAiBtn');
const mobileAiBtn = $('#mobileAiBtn');

const assistantMessages = [
  "HI! I'M TANISH'S DIGITAL ASSISTANT. SCROLL TO EXPLORE THE PORTFOLIO.",
  "SPECIALIZING IN REAL-TIME AI-POWERED THREAT DETECTION & CLOUD DEFENSE.",
  "CHECK OUT THE RANSOMWARE SENTINEL SYSTEM IN THE WORK SECTION.",
  "HAVE A PROJECT IN MIND? LET'S TALK VIA EMAIL OR LINKEDIN."
];
let msgIndex = 0;

function cycleAssistantMessage() {
  msgIndex = (msgIndex + 1) % assistantMessages.length;
  if (aiBubble) {
    const textEl = aiBubble.querySelector('.ai-bubble__text');
    if (textEl) textEl.textContent = assistantMessages[msgIndex];
    aiBubble.classList.remove('is-hidden');
  }
  playUiChime(800, 0.08);
}

function initSpeechBubble() {
  setTimeout(() => {
    if (aiBubble) aiBubble.classList.remove('is-hidden');
  }, 2200);
}

desktopAiBtn?.addEventListener('click', cycleAssistantMessage);
mobileAiBtn?.addEventListener('click', cycleAssistantMessage);

// ─── 13. MASTER INITIALIZATION ON LOAD ─────────────────────
window.addEventListener('load', () => {
  initThreeScene();
  initRansomwareVisualizer();
  initPhishingVisualizer();
  initButtonGradients();
  initCertificateCarousel();
});
