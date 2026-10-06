// src/components/3d/HeroVisual.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Languages, FileText, Compass, HeartPulse, Stethoscope } from 'lucide-react';

export const HeroVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 3D sphere points
    const numPoints = prefersReducedMotion ? 40 : 85;
    const radius = Math.min(width, height) * 0.32;
    const points: { x: number; y: number; z: number; origX: number; origY: number; origZ: number }[] = [];

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      points.push({ x, y, z, origX: x, origY: y, origZ: z });
    }

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Rotation angles
      if (!prefersReducedMotion) {
        angleX += 0.003;
        angleY += 0.005;
      }

      // Mouse influence
      const targetAngleY = angleY + mousePos.x * 0.0003;
      const targetAngleX = angleX - mousePos.y * 0.0003;

      const cosX = Math.cos(targetAngleX);
      const sinX = Math.sin(targetAngleX);
      const cosY = Math.cos(targetAngleY);
      const sinY = Math.sin(targetAngleY);

      // Transform points in 3D
      const projectedPoints = points.map(p => {
        // Rotate Y
        let x1 = p.origX * cosY - p.origZ * sinY;
        let z1 = p.origZ * cosY + p.origX * sinY;
        // Rotate X
        let y2 = p.origY * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.origY * sinX;

        // Perspective projection
        const fov = 350;
        const scale = fov / (fov + z2);
        const x2d = centerX + x1 * scale;
        const y2d = centerY + y2 * scale;

        return { x: x2d, y: y2d, z: z2, scale, alpha: (z2 + radius) / (2 * radius) };
      });

      // Draw neural connections
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projectedPoints.length; i++) {
        for (let j = i + 1; j < projectedPoints.length; j++) {
          const p1 = projectedPoints[i];
          const p2 = projectedPoints[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.25 * Math.min(p1.alpha, p2.alpha);
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw glowing nodes
      projectedPoints.forEach(p => {
        const size = Math.max(1.2, p.scale * 2.8);
        const alpha = Math.max(0.15, p.alpha * 0.85);

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2.5);
        grad.addColorStop(0, `rgba(6, 182, 212, ${alpha})`);
        grad.addColorStop(0.5, `rgba(59, 130, 246, ${alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // Center glowing core (pulse)
      const pulse = Math.sin(Date.now() * 0.003) * 8;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 60 + pulse);
      coreGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
      coreGrad.addColorStop(0.4, 'rgba(139, 92, 246, 0.15)');
      coreGrad.addColorStop(1, 'rgba(7, 11, 20, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Subtle medical cross in center
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // vertical
      ctx.moveTo(centerX, centerY - 14);
      ctx.lineTo(centerX, centerY + 14);
      // horizontal
      ctx.moveTo(centerX - 14, centerY);
      ctx.lineTo(centerX + 14, centerY);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center select-none"
    >
      {/* 3D Canvas Sphere */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Center Medical Card Hologram */}
      <div className="relative z-10 w-64 p-4 rounded-2xl bg-surface-glass/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.25)] text-center transition-transform duration-300 hover:scale-105">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <HeartPulse className="h-4 w-4 animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-widest text-cyan-300 uppercase">CARE-PASS SECURE</span>
        </div>
        <p className="text-sm font-semibold text-white">Digital Health Passport</p>
        <p className="text-[11px] text-slate-400 mt-1">Structured Non-Diagnostic Summary</p>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            AI Organizer
          </span>
          <span className="font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
            Tamil + English
          </span>
        </div>
      </div>

      {/* Floating Animated Badges required by Requirement 5 */}
      {/* 1. Multilingual */}
      <div className="absolute top-8 left-4 sm:left-8 z-20 animate-float bg-surface-elevated/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-glass flex items-center gap-2 text-xs font-semibold text-cyan-300">
        <Languages className="h-4 w-4 text-cyan-400" />
        <span>Multilingual</span>
      </div>

      {/* 2. AI-assisted */}
      <div className="absolute top-12 right-4 sm:right-8 z-20 animate-float [animation-delay:1.5s] bg-surface-elevated/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-glass flex items-center gap-2 text-xs font-semibold text-violet-300">
        <Sparkles className="h-4 w-4 text-violet-400" />
        <span>AI-assisted</span>
      </div>

      {/* 3. Patient Summary */}
      <div className="absolute bottom-20 left-4 sm:left-12 z-20 animate-float [animation-delay:2.5s] bg-surface-elevated/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-glass flex items-center gap-2 text-xs font-semibold text-blue-300">
        <FileText className="h-4 w-4 text-blue-400" />
        <span>Patient Summary</span>
      </div>

      {/* 4. Care Navigation */}
      <div className="absolute bottom-24 right-4 sm:right-10 z-20 animate-float [animation-delay:3.5s] bg-surface-elevated/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-glass flex items-center gap-2 text-xs font-semibold text-emerald-300">
        <Compass className="h-4 w-4 text-emerald-400" />
        <span>Care Navigation</span>
      </div>

      {/* 5. Privacy First */}
      <div className="absolute bottom-4 z-20 animate-float [animation-delay:4.5s] bg-surface-elevated/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 shadow-glass flex items-center gap-2 text-xs font-semibold text-rose-300">
        <Shield className="h-4 w-4 text-rose-400" />
        <span>Privacy First</span>
      </div>
    </div>
  );
};
