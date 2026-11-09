import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Background3DCanvasProps {
  className?: string;
  isListening?: boolean;
}

export const Background3DCanvas: React.FC<Background3DCanvasProps> = ({
  className = '',
  isListening = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera & WebGL Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.022); // Subtle atmospheric depth

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. High-Tech Circular Particle & Node Glow Texture
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.2, 'rgba(110, 231, 183, 0.9)');
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.4)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const glowTexture = createGlowTexture();

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const emeraldKeyLight = new THREE.DirectionalLight(0x10b981, 3.2);
    emeraldKeyLight.position.set(6, 7, 5);
    scene.add(emeraldKeyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 2.4);
    cyanRimLight.position.set(-7, -4, -4);
    scene.add(cyanRimLight);

    // Dynamic mouse-following point light for specular reflections on the sphere
    const mouseLight = new THREE.PointLight(0x34d399, 3.2, 14, 1.1);
    mouseLight.position.set(0, 0, 4.5);
    scene.add(mouseLight);

    // 4. Master 3D Spatial Acoustic Sphere Group
    const sphereGroup = new THREE.Group();
    // Default desktop position: framed on the right side of hero content
    sphereGroup.position.set(width > 1024 ? 2.5 : 0, width <= 768 ? 1.0 : 0, 0);
    scene.add(sphereGroup);

    // 4A. Inner Radiant Core Sphere
    const coreGeometry = new THREE.IcosahedronGeometry(1.65, 5);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.16,
      metalness: 0.88,
      emissive: 0x059669,
      emissiveIntensity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sphereGroup.add(coreMesh);

    // 4B. Outer Holographic Geodesic Lattice Wireframe
    const wireGeometry = new THREE.IcosahedronGeometry(2.18, 2);
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0x10b981,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.48,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    sphereGroup.add(wireMesh);

    // 4C. Luminous Geodesic Vertex Nodes (Glowing Phoneme Sensor Nodes)
    const wirePositions = wireGeometry.attributes.position;
    const uniqueVertices: THREE.Vector3[] = [];
    const nodeTolerance = 0.01;

    for (let i = 0; i < wirePositions.count; i++) {
      const v = new THREE.Vector3(
        wirePositions.getX(i),
        wirePositions.getY(i),
        wirePositions.getZ(i)
      );
      const isDuplicate = uniqueVertices.some((u) => u.distanceTo(v) < nodeTolerance);
      if (!isDuplicate) {
        uniqueVertices.push(v);
      }
    }

    const nodePositions = new Float32Array(uniqueVertices.length * 3);
    uniqueVertices.forEach((v, idx) => {
      nodePositions[idx * 3] = v.x;
      nodePositions[idx * 3 + 1] = v.y;
      nodePositions[idx * 3 + 2] = v.z;
    });

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.28,
      map: glowTexture || undefined,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);
    sphereGroup.add(nodePoints);

    // 4D. Orbital Gyro Frequency Rings
    const ring1Geometry = new THREE.TorusGeometry(2.7, 0.018, 16, 120);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.65,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1Mesh.rotation.x = Math.PI / 3;
    sphereGroup.add(ring1Mesh);

    const ring2Geometry = new THREE.TorusGeometry(3.05, 0.015, 16, 120);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 6;
    sphereGroup.add(ring2Mesh);

    // 4E. Acoustic Wave Expansion Rings (Dynamic Voice Sonar Waves)
    const waveRings: { mesh: THREE.Mesh; scale: number; speed: number; baseOpacity: number }[] = [];
    const waveCount = 2;

    for (let w = 0; w < waveCount; w++) {
      const waveGeom = new THREE.TorusGeometry(2.3, 0.012, 16, 100);
      const waveMat = new THREE.MeshBasicMaterial({
        color: w % 2 === 0 ? 0x34d399 : 0x38bdf8,
        transparent: true,
        opacity: 0.5,
      });
      const waveMesh = new THREE.Mesh(waveGeom, waveMat);
      waveMesh.rotation.x = Math.PI / 2.2 + (w * 0.4);
      sphereGroup.add(waveMesh);
      waveRings.push({
        mesh: waveMesh,
        scale: 1.0 + w * 0.4,
        speed: 0.6 + w * 0.2,
        baseOpacity: 0.55,
      });
    }

    // 5. Deep Space Constellation Particles (650 particles across screen space)
    const particleCount = 650;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 18;

      particlePositions[i] = x;
      particlePositions[i + 1] = y;
      particlePositions[i + 2] = z;

      particleOriginalPositions[i] = x;
      particleOriginalPositions[i + 1] = y;
      particleOriginalPositions[i + 2] = z;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.12,
      map: glowTexture || undefined,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Interactive 360° Drag & Mouse Orbit Engine
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let scrollYOffset = 0;

    const isInteractiveElement = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return Boolean(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('.no-drag')
      );
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target;
      if (isInteractiveElement(target)) return;

      isDragging = true;
      setIsInteracting(true);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevPointerX = clientX;
      prevPointerY = clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseX = (clientX / window.innerWidth) * 2 - 1;
      mouseY = -(clientY / window.innerHeight) * 2 + 1;

      // Update interactive point light
      mouseLight.position.x = mouseX * 5.5;
      mouseLight.position.y = mouseY * 4.2;

      if (isDragging) {
        const deltaX = clientX - prevPointerX;
        const deltaY = clientY - prevPointerY;

        // High responsiveness 360 drag rotation
        velocityX = deltaX * 0.012;
        velocityY = deltaY * 0.012;

        sphereGroup.rotation.y += velocityX;
        sphereGroup.rotation.x += velocityY;

        prevPointerX = clientX;
        prevPointerY = clientY;
      } else {
        // Natural mouse parallax tilt
        targetTiltY = mouseX * 0.45;
        targetTiltX = -mouseY * 0.35;
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        isDragging = false;
        setTimeout(() => setIsInteracting(false), 800);
      }
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY || window.pageYOffset || 0;
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

      // Responsive positioning
      sphereGroup.position.x = width > 1024 ? 2.5 : 0;
      sphereGroup.position.y = width <= 768 ? 1.0 : 0;
    };

    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mouseup', handlePointerUp, { passive: true });
    window.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // Initial position adjust
    handleResize();

    // 7. Render Loop with Inertia, Pulse & Kinetic Physics
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (!prefersReducedMotion) {
        // Continuous ambient rotation
        coreMesh.rotation.y += delta * 0.3;
        coreMesh.rotation.x += delta * 0.15;

        wireMesh.rotation.y -= delta * 0.22;
        wireMesh.rotation.z += delta * 0.1;

        nodePoints.rotation.y -= delta * 0.22;
        nodePoints.rotation.z += delta * 0.1;

        ring1Mesh.rotation.z += delta * 0.35;
        ring2Mesh.rotation.z -= delta * 0.28;

        particleSystem.rotation.y += delta * 0.05;
        particleSystem.rotation.x += delta * 0.025;

        // Wave rings expansion & acoustic fade
        waveRings.forEach((wave) => {
          wave.scale += delta * wave.speed;
          if (wave.scale > 2.2) {
            wave.scale = 1.0;
          }
          wave.mesh.scale.set(wave.scale, wave.scale, wave.scale);
          const fadeProgress = (wave.scale - 1.0) / 1.2;
          (wave.mesh.material as THREE.MeshBasicMaterial).opacity =
            wave.baseOpacity * (1.0 - fadeProgress);
        });

        // 360 Inertia damping after drag release
        if (!isDragging) {
          velocityX *= 0.94;
          velocityY *= 0.94;
          sphereGroup.rotation.y += velocityX;
          sphereGroup.rotation.x += velocityY;

          // Smooth lerp towards mouse parallax target
          sphereGroup.rotation.y += (targetTiltY - (sphereGroup.rotation.y % (Math.PI * 2))) * 0.04;
          sphereGroup.rotation.x += (targetTiltX - (sphereGroup.rotation.x % (Math.PI * 2))) * 0.04;
        }

        // Parallax depth shifting based on page scroll
        const scrollFactor = scrollYOffset * 0.0015;
        sphereGroup.position.y = (width <= 768 ? 1.0 : 0) - (scrollFactor % 3.5);
        camera.position.z = 7.8 + Math.sin(scrollFactor * 0.4) * 0.4;

        // Dynamic Acoustic Breathing & Audio Reactive Pulse
        const pulseFrequency = isListening ? 7.0 : 1.8;
        const pulseAmplitude = isListening ? 0.16 : 0.04;
        const scale = 1.0 + Math.sin(elapsedTime * pulseFrequency) * pulseAmplitude;
        coreMesh.scale.set(scale, scale, scale);

        const wireScale = 1.0 + Math.cos(elapsedTime * (pulseFrequency * 0.8)) * (pulseAmplitude * 1.5);
        wireMesh.scale.set(wireScale, wireScale, wireScale);
        nodePoints.scale.set(wireScale, wireScale, wireScale);

        // Flaring emissive on voice activity
        coreMaterial.emissiveIntensity = isListening
          ? 0.95 + Math.sin(elapsedTime * 12) * 0.35
          : 0.65;
        nodeMaterial.size = isListening ? 0.36 : 0.28;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Disposal & Zero Memory Leaks Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
      waveRings.forEach((w) => {
        w.mesh.geometry.dispose();
        (w.mesh.material as THREE.Material).dispose();
      });
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (glowTexture) glowTexture.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isListening]);

  return (
    <>
      {/* Fixed Fullscreen 3D Background Canvas Layer */}
      <div
        ref={mountRef}
        className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
        aria-hidden="true"
      />

      {/* Floating 360° Interactive HUD Badge */}
      <div className="fixed bottom-4 right-4 z-40 hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-950/70 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono backdrop-blur-md shadow-lg pointer-events-none transition-all duration-300">
        <span
          className={`w-2 h-2 rounded-full ${
            isInteracting ? 'bg-emerald-400 scale-125' : 'bg-emerald-500 animate-pulse'
          }`}
        />
        <span>
          {isInteracting
            ? '360° 3D Core: Rotating...'
            : '🖱️ Drag anywhere to rotate 3D Sphere'}
        </span>
      </div>
    </>
  );
};
