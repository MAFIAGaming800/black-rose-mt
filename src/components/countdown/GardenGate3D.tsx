import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GardenGate3DProps {
  isOpening: boolean;
  onGateOpened?: () => void;
  className?: string;
}

export const GardenGate3D: React.FC<GardenGate3DProps> = ({
  isOpening,
  onGateOpened,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const onGateOpenedRef = useRef(onGateOpened);
  const isOpeningRef = useRef(isOpening);

  useEffect(() => {
    onGateOpenedRef.current = onGateOpened;
  }, [onGateOpened]);

  useEffect(() => {
    isOpeningRef.current = isOpening;
  }, [isOpening]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let hasNotifiedOpen = false;

    // Respect reduced-motion preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;

      // 1. Scene setup with soft blush-pink fairytale fog
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xfff0f5);
      scene.fog = new THREE.FogExp2(0xfff0f5, 0.09);

      // 2. Camera setup
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
      camera.position.set(0, 1.3, 4.4);
      camera.lookAt(0, 1.2, 0);

      // 3. WebGL Renderer with proper antialiasing & color space
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      // 4. Cinematic Lighting
      const ambientLight = new THREE.AmbientLight(0xffe4ec, 1.4);
      scene.add(ambientLight);

      // Warm Rose-Gold Sun Keylight
      const dirLight = new THREE.DirectionalLight(0xfffaea, 1.6);
      dirLight.position.set(4, 7, 5);
      scene.add(dirLight);

      // Soft Blush Rim Light
      const rimLight = new THREE.DirectionalLight(0xf8c8dc, 1.2);
      rimLight.position.set(-4, 3, -3);
      scene.add(rimLight);

      // Fairy Lantern Point Lights
      const lanternLeft = new THREE.PointLight(0xf7e7ce, 1.8, 4.5);
      lanternLeft.position.set(-1.6, 2.2, 0.3);
      scene.add(lanternLeft);

      const lanternRight = new THREE.PointLight(0xf7e7ce, 1.8, 4.5);
      lanternRight.position.set(1.6, 2.2, 0.3);
      scene.add(lanternRight);

      // 5. Materials Library (Rose Gold, Champagne, Marble, Petals)
      const roseGoldMat = new THREE.MeshStandardMaterial({
        color: 0xc49a88,
        metalness: 0.78,
        roughness: 0.28,
      });

      const goldTrimMat = new THREE.MeshStandardMaterial({
        color: 0xe6ca65,
        metalness: 0.85,
        roughness: 0.22,
      });

      const marbleMat = new THREE.MeshStandardMaterial({
        color: 0xfff6f8,
        roughness: 0.6,
        metalness: 0.1,
      });

      const rosePetalMat = new THREE.MeshStandardMaterial({
        color: 0xf8a5c2,
        roughness: 0.45,
        metalness: 0.05,
        side: THREE.DoubleSide,
      });

      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x4a7c59,
        roughness: 0.55,
        metalness: 0.1,
      });

      const lanternGlassMat = new THREE.MeshStandardMaterial({
        color: 0xfff3d6,
        emissive: 0xffe29a,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.85,
        roughness: 0.1,
      });

      // 6. Archway Architecture & Columns
      const gateRoot = new THREE.Group();
      scene.add(gateRoot);

      // Columns (Left and Right)
      const columnGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.2, 16);
      const columnBaseGeo = new THREE.BoxGeometry(0.55, 0.35, 0.55);
      const columnCapGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.2, 16);

      // Left Pillar
      const leftColGroup = new THREE.Group();
      leftColGroup.position.set(-1.65, 1.4, 0);
      const leftColMesh = new THREE.Mesh(columnGeo, marbleMat);
      const leftBaseMesh = new THREE.Mesh(columnBaseGeo, roseGoldMat);
      leftBaseMesh.position.y = -1.45;
      const leftCapMesh = new THREE.Mesh(columnCapGeo, roseGoldMat);
      leftCapMesh.position.y = 1.6;
      leftColGroup.add(leftColMesh, leftBaseMesh, leftCapMesh);
      gateRoot.add(leftColGroup);

      // Right Pillar
      const rightColGroup = new THREE.Group();
      rightColGroup.position.set(1.65, 1.4, 0);
      const rightColMesh = new THREE.Mesh(columnGeo, marbleMat);
      const rightBaseMesh = new THREE.Mesh(columnBaseGeo, roseGoldMat);
      rightBaseMesh.position.y = -1.45;
      const rightCapMesh = new THREE.Mesh(columnCapGeo, roseGoldMat);
      rightCapMesh.position.y = 1.6;
      rightColGroup.add(rightColMesh, rightBaseMesh, rightCapMesh);
      gateRoot.add(rightColGroup);

      // Overhead Crown Arch
      const archCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.65, 3.0, 0),
        new THREE.Vector3(-1.1, 3.65, 0),
        new THREE.Vector3(0, 3.9, 0),
        new THREE.Vector3(1.1, 3.65, 0),
        new THREE.Vector3(1.65, 3.0, 0),
      ]);
      const archGeo = new THREE.TubeGeometry(archCurve, 32, 0.08, 12, false);
      const archMesh = new THREE.Mesh(archGeo, roseGoldMat);
      gateRoot.add(archMesh);

      // Arch Crown Center Crest
      const crownGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const crownMesh = new THREE.Mesh(crownGeo, goldTrimMat);
      crownMesh.position.set(0, 4.02, 0);
      gateRoot.add(crownMesh);

      // Hanging Lanterns
      const lanternGeo = new THREE.CylinderGeometry(0.09, 0.13, 0.32, 8);
      const lanternLeftMesh = new THREE.Mesh(lanternGeo, lanternGlassMat);
      lanternLeftMesh.position.set(-1.65, 2.2, 0.25);
      const lanternRightMesh = new THREE.Mesh(lanternGeo, lanternGlassMat);
      lanternRightMesh.position.set(1.65, 2.2, 0.25);
      gateRoot.add(lanternLeftMesh, lanternRightMesh);

      // 7. Climbing Rose Vines on Pillars
      const flowerGeo = new THREE.DodecahedronGeometry(0.09, 1);
      const leafGeo = new THREE.BoxGeometry(0.07, 0.03, 0.12);

      const vinePositions = [
        [-1.65, 0.4, 0.16], [-1.55, 0.9, 0.18], [-1.7, 1.4, 0.16], [-1.58, 1.9, 0.18], [-1.65, 2.5, 0.15],
        [1.65, 0.4, 0.16], [1.55, 0.9, 0.18], [1.7, 1.4, 0.16], [1.58, 1.9, 0.18], [1.65, 2.5, 0.15],
        [-0.8, 3.5, 0.1], [0.8, 3.5, 0.1], [0.0, 3.8, 0.1],
      ];

      vinePositions.forEach(([vx, vy, vz], idx) => {
        const flower = new THREE.Mesh(flowerGeo, rosePetalMat);
        flower.position.set(vx, vy, vz);
        flower.scale.setScalar(0.8 + (idx % 3) * 0.25);
        gateRoot.add(flower);

        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(vx + 0.08, vy - 0.04, vz);
        leaf.rotation.set(0.3, 0.5, (idx % 2) * 0.8);
        gateRoot.add(leaf);
      });

      // 8. 3D Gate Doors with Realistic Hinge Groups
      const doorWidth = 1.45;
      const doorHeight = 2.4;
      const barCount = 7;

      const outerFrameHGeo = new THREE.BoxGeometry(doorWidth, 0.07, 0.06);
      const outerFrameVGeo = new THREE.BoxGeometry(0.07, doorHeight, 0.06);
      const barGeo = new THREE.CylinderGeometry(0.02, 0.02, doorHeight * 0.95, 8);
      const tipGeo = new THREE.ConeGeometry(0.045, 0.14, 8);
      const ringGeo = new THREE.TorusGeometry(0.24, 0.025, 12, 24);

      function createGateLeaf(isLeft: boolean): THREE.Group {
        const leafGroup = new THREE.Group();

        // Outer Frame
        const frameMat = roseGoldMat;

        const bottomRail = new THREE.Mesh(outerFrameHGeo, frameMat);
        bottomRail.position.set(isLeft ? doorWidth / 2 : -doorWidth / 2, 0.1, 0);

        const midRail = new THREE.Mesh(outerFrameHGeo, frameMat);
        midRail.position.set(isLeft ? doorWidth / 2 : -doorWidth / 2, doorHeight * 0.52, 0);

        const topRail = new THREE.Mesh(outerFrameHGeo, frameMat);
        topRail.position.set(isLeft ? doorWidth / 2 : -doorWidth / 2, doorHeight, 0);

        const outerStile = new THREE.Mesh(outerFrameVGeo, frameMat);
        outerStile.position.set(isLeft ? doorWidth : -doorWidth, doorHeight / 2, 0);

        const innerStile = new THREE.Mesh(outerFrameVGeo, frameMat);
        innerStile.position.set(0, doorHeight / 2, 0);

        leafGroup.add(bottomRail, midRail, topRail, outerStile, innerStile);

        for (let i = 1; i <= barCount; i++) {
          const barX = (isLeft ? 1 : -1) * (i * (doorWidth / (barCount + 1)));
          const bar = new THREE.Mesh(barGeo, roseGoldMat);
          bar.position.set(barX, doorHeight / 2, 0);

          const tip = new THREE.Mesh(tipGeo, goldTrimMat);
          tip.position.set(barX, doorHeight + 0.06, 0);

          leafGroup.add(bar, tip);
        }

        // Central Ornate Ring / Medallion
        const ringMesh = new THREE.Mesh(ringGeo, goldTrimMat);
        ringMesh.position.set(isLeft ? doorWidth / 2 : -doorWidth / 2, doorHeight * 0.52, 0.02);
        leafGroup.add(ringMesh);

        // Medallion Center Flower
        const centerFlower = new THREE.Mesh(flowerGeo, rosePetalMat);
        centerFlower.position.set(isLeft ? doorWidth / 2 : -doorWidth / 2, doorHeight * 0.52, 0.04);
        centerFlower.scale.setScalar(1.2);
        leafGroup.add(centerFlower);

        return leafGroup;
      }

      // Left Gate Hinge Pivot Group (Pivoting at post x = -1.5)
      const leftHinge = new THREE.Group();
      leftHinge.position.set(-1.48, 0, 0);
      const leftDoor = createGateLeaf(true);
      leftHinge.add(leftDoor);
      gateRoot.add(leftHinge);

      // Right Gate Hinge Pivot Group (Pivoting at post x = +1.5)
      const rightHinge = new THREE.Group();
      rightHinge.position.set(1.48, 0, 0);
      const rightDoor = createGateLeaf(false);
      rightHinge.add(rightDoor);
      gateRoot.add(rightHinge);

      // 9. Fluttering 3D Butterflies (3 unique graceful butterflies)
      interface Butterfly {
        group: THREE.Group;
        wingLeft: THREE.Mesh;
        wingRight: THREE.Mesh;
        baseY: number;
        radius: number;
        speed: number;
        offset: number;
      }

      const butterflies: Butterfly[] = [];
      const wingGeo = new THREE.BufferGeometry();
      // Triangular wing shape with rounded depth
      const wingVertices = new Float32Array([
        0, 0, 0,
        0.18, 0.16, 0.02,
        0.14, -0.12, 0,
      ]);
      wingGeo.setAttribute('position', new THREE.BufferAttribute(wingVertices, 3));
      wingGeo.computeVertexNormals();

      const butterflyColors = [0xffb7c5, 0xfce4ec, 0xf5d061];

      for (let b = 0; b < 3; b++) {
        const bGroup = new THREE.Group();
        const bMat = new THREE.MeshStandardMaterial({
          color: butterflyColors[b],
          side: THREE.DoubleSide,
          metalness: 0.1,
          roughness: 0.3,
        });

        // Body
        const bodyGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 6);
        const bodyMesh = new THREE.Mesh(bodyGeo, roseGoldMat);
        bodyMesh.rotation.x = Math.PI / 2;
        bGroup.add(bodyMesh);

        // Left Wing
        const wingL = new THREE.Mesh(wingGeo, bMat);
        wingL.position.set(0, 0, 0);
        bGroup.add(wingL);

        // Right Wing (mirrored)
        const wingRGeo = wingGeo.clone();
        wingRGeo.scale(-1, 1, 1);
        const wingR = new THREE.Mesh(wingRGeo, bMat);
        wingR.position.set(0, 0, 0);
        bGroup.add(wingR);

        bGroup.position.set(
          Math.sin(b * 2) * 1.5,
          1.8 + b * 0.4,
          Math.cos(b * 2) * 1.2
        );
        scene.add(bGroup);

        butterflies.push({
          group: bGroup,
          wingLeft: wingL,
          wingRight: wingR,
          baseY: 1.6 + b * 0.5,
          radius: 1.2 + b * 0.4,
          speed: 0.8 + b * 0.3,
          offset: b * 2.1,
        });
      }

      // 10. Floating Rose Petals
      const petalCount = 45;
      const petalGeo = new THREE.PlaneGeometry(0.07, 0.1, 3, 3);
      // Soft curvature
      const posAttr = petalGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        posAttr.setZ(i, (u * u + v * v) * 0.5);
      }
      petalGeo.computeVertexNormals();

      const petalsGroup = new THREE.Group();
      scene.add(petalsGroup);

      const petalParticles: {
        mesh: THREE.Mesh;
        vy: number;
        rx: number;
        ry: number;
        rz: number;
      }[] = [];

      for (let p = 0; p < petalCount; p++) {
        const pMesh = new THREE.Mesh(petalGeo, rosePetalMat);
        pMesh.position.set(
          (Math.random() - 0.5) * 5.0,
          Math.random() * 4.5,
          (Math.random() - 0.5) * 3.5
        );
        pMesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        petalsGroup.add(pMesh);

        petalParticles.push({
          mesh: pMesh,
          vy: 0.005 + Math.random() * 0.008,
          rx: (Math.random() - 0.5) * 0.02,
          ry: (Math.random() - 0.5) * 0.02,
          rz: (Math.random() - 0.5) * 0.02,
        });
      }

      // 11. Subtle Magical Sparkles
      const sparkleGeo = new THREE.BufferGeometry();
      const sparkleCount = 60;
      const sparklePositions = new Float32Array(sparkleCount * 3);
      for (let s = 0; s < sparkleCount * 3; s += 3) {
        sparklePositions[s] = (Math.random() - 0.5) * 4.5;
        sparklePositions[s + 1] = Math.random() * 4.0;
        sparklePositions[s + 2] = (Math.random() - 0.5) * 3.5;
      }
      sparkleGeo.setAttribute('position', new THREE.BufferAttribute(sparklePositions, 3));
      const sparkleMat = new THREE.PointsMaterial({
        color: 0xffe29a,
        size: 0.04,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
      scene.add(sparkles);

      // 12. Animation Loop & Gate Opening State Kinematics
      let openProgress = 0; // 0 = fully closed, 1 = fully open
      const clock = new THREE.Clock();

      /**
       * Organic Heavy Gate Easing Function
       * Models the physical mass, initial inertia, and stately elastic overshoot / settling
       * of grand wrought-iron garden doors swinging inward.
       */
      const organicHeavyGateEasing = (t: number): number => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;

        // Tuned elastic overshoot coefficient (~4.5% natural momentum overshoot)
        const s = 1.12;
        const p = t - 1;
        const backOut = 1 + (s + 1) * Math.pow(p, 3) + s * Math.pow(p, 2);

        // Soft initial inertia ramp to simulate overcoming static hinge friction
        const smoothStart = Math.min(1, t / 0.22);
        const startInertia = smoothStart * smoothStart * (3 - 2 * smoothStart);

        return backOut * (0.3 + 0.7 * startInertia) + (1 - (0.3 + 0.7 * startInertia)) * (t * t * 2);
      };

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        // A. Gate Opening Animation with Organic Elastic Overshoot
        if (isOpeningRef.current) {
          if (prefersReducedMotion) {
            openProgress = 1.0;
          } else {
            // Smooth pacing (~2.6s) to convey grandness and physical presence
            openProgress = Math.min(1.0, openProgress + delta * 0.38);
          }

          // Calculate organic elastic overshoot curves with subtle natural leaf phase offset
          const leftEase = organicHeavyGateEasing(openProgress);
          const rightProgress = Math.max(0, openProgress - 0.02) / 0.98;
          const rightEase = organicHeavyGateEasing(rightProgress);

          const maxOpenAngle = Math.PI * 0.48; // ~86 degrees inward

          // Left door pivots inward (-Z) with organic elastic overshoot
          leftHinge.rotation.y = -leftEase * maxOpenAngle;
          // Right door pivots inward (-Z) with organic elastic overshoot
          rightHinge.rotation.y = rightEase * maxOpenAngle;

          // Camera smoothly glides forward into the garden on an elegant ease-out curve
          const camEase = 1 - Math.pow(1 - openProgress, 3);
          camera.position.z = THREE.MathUtils.lerp(4.4, 2.5, camEase);
          camera.position.y = THREE.MathUtils.lerp(1.3, 1.4, camEase);

          if (openProgress >= 0.99 && !hasNotifiedOpen) {
            hasNotifiedOpen = true;
            onGateOpenedRef.current?.();
          }
        } else {
          leftHinge.rotation.y = 0;
          rightHinge.rotation.y = 0;
          camera.position.set(0, 1.3, 4.4);
        }

        // B. Fluttering Butterflies
        butterflies.forEach((b) => {
          const t = elapsed * b.speed + b.offset;
          // Wing flap (rapid sinusoidal cycle)
          const flap = Math.sin(elapsed * 16 + b.offset) * 0.7;
          b.wingLeft.rotation.y = flap;
          b.wingRight.rotation.y = -flap;

          // Figure-8 flight trajectory around gate
          b.group.position.x = Math.sin(t) * b.radius;
          b.group.position.y = b.baseY + Math.sin(t * 2) * 0.35;
          b.group.position.z = Math.cos(t) * (b.radius * 0.6) + (isOpeningRef.current ? -openProgress * 1.5 : 0);

          // Rotate butterfly facing travel direction
          b.group.rotation.y = Math.atan2(
            Math.cos(t) * b.radius,
            -Math.sin(t) * (b.radius * 0.6)
          ) + Math.PI / 2;
        });

        // C. Falling & Swirling Rose Petals
        petalParticles.forEach((p) => {
          p.mesh.position.y -= p.vy;
          p.mesh.position.x += Math.sin(elapsed + p.mesh.position.y) * 0.003;
          p.mesh.rotation.x += p.rx;
          p.mesh.rotation.y += p.ry;
          p.mesh.rotation.z += p.rz;

          // Reset when fallen below ground
          if (p.mesh.position.y < -0.2) {
            p.mesh.position.y = 4.2;
            p.mesh.position.x = (Math.random() - 0.5) * 4.5;
            p.mesh.position.z = (Math.random() - 0.5) * 3.0;
          }
        });

        // D. Gentle Lantern Glow flicker
        lanternLeft.intensity = 1.8 + Math.sin(elapsed * 4) * 0.15;
        lanternRight.intensity = 1.8 + Math.cos(elapsed * 3.5) * 0.15;

        // E. Magic Sparkles subtle rotation
        sparkles.rotation.y = elapsed * 0.04;

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();

      // 13. Responsive Window Resize Handler
      const handleResize = () => {
        if (!mount || !renderer) return;
        const newWidth = mount.clientWidth;
        const newHeight = mount.clientHeight;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);

        // Dispose geometries
        columnGeo.dispose();
        columnBaseGeo.dispose();
        columnCapGeo.dispose();
        archGeo.dispose();
        crownGeo.dispose();
        lanternGeo.dispose();
        flowerGeo.dispose();
        leafGeo.dispose();
        outerFrameHGeo.dispose();
        outerFrameVGeo.dispose();
        barGeo.dispose();
        tipGeo.dispose();
        ringGeo.dispose();
        wingGeo.dispose();
        petalGeo.dispose();
        sparkleGeo.dispose();

        // Dispose materials
        roseGoldMat.dispose();
        goldTrimMat.dispose();
        marbleMat.dispose();
        rosePetalMat.dispose();
        leafMat.dispose();
        lanternGlassMat.dispose();
        sparkleMat.dispose();

        if (renderer) {
          renderer.dispose();
          if (renderer.domElement && mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement);
          }
        }
      };
    } catch (err) {
      console.warn('Three.js 3D Garden Gate initialization fallback:', err);
      // If WebGL fails, gracefully notify after brief duration so user is never blocked
      if (isOpening) {
        onGateOpenedRef.current?.();
      }
    }
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
