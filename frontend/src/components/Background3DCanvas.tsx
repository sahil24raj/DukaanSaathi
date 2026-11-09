import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    // Position camera for a cinematic, spacious background composition
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 2. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const emeraldLight = new THREE.DirectionalLight(0x10b981, 2.8);
    emeraldLight.position.set(5, 6, 4);
    scene.add(emeraldLight);

    const cyanRimLight = new THREE.DirectionalLight(0x06b6d4, 2.0);
    cyanRimLight.position.set(-6, -4, -3);
    scene.add(cyanRimLight);

    // Dynamic mouse-following point light for interactive specular reflections
    const mouseLight = new THREE.PointLight(0x34d399, 2.5, 12, 1.2);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    // 3. Central 3D Spatial Acoustic Sphere Group
    const sphereGroup = new THREE.Group();
    // Default position: positioned slightly towards right/center for hero balance on desktop
    sphereGroup.position.set(width > 1024 ? 2.2 : 0, 0, 0);
    scene.add(sphereGroup);

    // Inner Glowing Core Sphere
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 5);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.18,
      metalness: 0.9,
      emissive: 0x059669,
      emissiveIntensity: 0.55,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sphereGroup.add(coreMesh);

    // Outer Holographic Geodesic Cage
    const wireGeometry = new THREE.IcosahedronGeometry(2.15, 2);
    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.95,
      transparent: true,
      opacity: 0.38,
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    sphereGroup.add(wireMesh);

    // Orbital Frequency Gyro Ring 1
    const ring1Geometry = new THREE.TorusGeometry(2.6, 0.018, 16, 100);
    const ring1Material = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.5,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geometry, ring1Material);
    ring1Mesh.rotation.x = Math.PI / 3;
    sphereGroup.add(ring1Mesh);

    // Orbital Frequency Gyro Ring 2 (tilted counter-axis)
    const ring2Geometry = new THREE.TorusGeometry(2.9, 0.015, 16, 100);
    const ring2Material = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 6;
    sphereGroup.add(ring2Mesh);

    // 4. Large-Scale Deep Constellation Particle Field (500 particles across the universe)
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleOriginalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 20;
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
      color: 0x10b981,
      size: 0.045,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Global Interactive Mouse, Drag & Scroll Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let scrollYOffset = 0;

    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      // Normalized screen coordinates [-1, 1]
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Update interactive point light position in 3D world coordinates
      mouseLight.position.x = mouseX * 5;
      mouseLight.position.y = mouseY * 4;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;
        sphereGroup.rotation.y += dragVelocityX;
        sphereGroup.rotation.x += dragVelocityY;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        targetRotationY = mouseX * 0.45;
        targetRotationX = -mouseY * 0.35;
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      // If clicking directly on non-interactive background areas
      isDragging = true;
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('mousedown', handlePointerDown, { passive: true });
    window.addEventListener('mouseup', handlePointerUp, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Touch support for mobile 3D interaction
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseX = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(touch.clientY / window.innerHeight) * 2 + 1;
        targetRotationY = mouseX * 0.4;
        targetRotationX = -mouseY * 0.3;
      }
    };
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 6. Responsive Window Resize Handler
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      // Adjust sphere position according to screen width
      sphereGroup.position.x = width > 1024 ? 2.4 : 0;
      sphereGroup.position.y = width <= 768 ? 1.0 : 0;
    };

    window.addEventListener('resize', handleResize);

    // Initial position adjust
    handleResize();

    // 7. Render Loop with Inertia, Physics and Audio Pulse
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (!prefersReducedMotion) {
        // Continuous ambient rotation
        coreMesh.rotation.y += delta * 0.25;
        coreMesh.rotation.x += delta * 0.12;

        wireMesh.rotation.y -= delta * 0.18;
        wireMesh.rotation.z += delta * 0.08;

        ring1Mesh.rotation.z += delta * 0.3;
        ring2Mesh.rotation.z -= delta * 0.22;

        particleSystem.rotation.y += delta * 0.04;
        particleSystem.rotation.x += delta * 0.02;

        // Inertia damping after drag release
        if (!isDragging) {
          dragVelocityX *= 0.92;
          dragVelocityY *= 0.92;
          sphereGroup.rotation.y += dragVelocityX;
          sphereGroup.rotation.x += dragVelocityY;

          // Smooth lerp towards mouse parallax target
          sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y) * 0.04;
          sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x) * 0.04;
        }

        // Parallax depth shifting based on page scroll
        const scrollFactor = scrollYOffset * 0.0018;
        sphereGroup.position.y = (width <= 768 ? 1.0 : 0) - (scrollFactor % 4);
        camera.position.z = 7.5 + Math.sin(scrollFactor * 0.5) * 0.5;

        // Dynamic Acoustic Breathing Pulse
        const pulseFrequency = isListening ? 6.5 : 1.8;
        const pulseAmplitude = isListening ? 0.15 : 0.035;
        const scale = 1.0 + Math.sin(elapsedTime * pulseFrequency) * pulseAmplitude;
        coreMesh.scale.set(scale, scale, scale);

        const wireScale = 1.0 + Math.cos(elapsedTime * (pulseFrequency * 0.8)) * (pulseAmplitude * 1.6);
        wireMesh.scale.set(wireScale, wireScale, wireScale);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 8. Proper Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      ring1Geometry.dispose();
      ring1Material.dispose();
      ring2Geometry.dispose();
      ring2Material.dispose();
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
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};

