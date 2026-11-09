import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Acoustic3DCanvasProps {
  isListening?: boolean;
  className?: string;
}

export const Acoustic3DCanvas: React.FC<Acoustic3DCanvasProps> = ({
  isListening = false,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    // 2. WebGL Renderer with High-DPI Clamping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x10b981, 2.5); // Emerald accent light
    dirLight1.position.set(4, 5, 4);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 1.8); // Deep Blue rim light
    dirLight2.position.set(-4, -3, -2);
    scene.add(dirLight2);

    // 4. Procedural 3D Geometric Objects
    // Inner Radiant Core Sphere
    const coreGeometry = new THREE.IcosahedronGeometry(1.0, 4);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: false,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // Outer Holographic Wireframe Cage
    const wireGeometry = new THREE.IcosahedronGeometry(1.35, 2);
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    scene.add(wireMesh);

    // Spatial Particle Constellation (Voice Phonemes)
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.8 + Math.random() * 0.8;

      particlePositions[i] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = r * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 5. Interactive Pointer Tracking (Mouse parallax)
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.6;
      targetRotationX = -mouseY * 0.6;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop with Physics & Reduced Motion Check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (!prefersReducedMotion) {
        // Continuous rotation
        coreMesh.rotation.y += delta * 0.4;
        coreMesh.rotation.x += delta * 0.2;

        wireMesh.rotation.y -= delta * 0.25;
        wireMesh.rotation.z += delta * 0.15;

        particles.rotation.y += delta * 0.1;

        // Smooth interactive parallax tilt
        coreMesh.rotation.x += (targetRotationX - coreMesh.rotation.x) * 0.05;
        coreMesh.rotation.y += (targetRotationY - coreMesh.rotation.y) * 0.05;

        // Dynamic Acoustic Breathing & Pulse
        const pulseRate = isListening ? 6 : 2;
        const amplitude = isListening ? 0.12 : 0.03;
        const scale = 1.0 + Math.sin(elapsedTime * pulseRate) * amplitude;
        coreMesh.scale.set(scale, scale, scale);

        const wireScale = 1.35 + Math.cos(elapsedTime * (pulseRate * 0.8)) * (amplitude * 1.5);
        wireMesh.scale.set(wireScale, wireScale, wireScale);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Cleanup & Disposal on Unmount (Zero VRAM leaks)
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [isListening]);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    />
  );
};
