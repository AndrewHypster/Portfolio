"use client";

import { useEffect, useRef } from "react";
import randomColor from "./rndm-collor";

function resolveCssPixels(value, container, reference, fallback) {
  if (typeof value === "number") return value;

  if (typeof value !== "string") return fallback;

  const percentage = value.trim().match(/^([\d.]+)%$/);

  if (percentage) {
    return (Number(percentage[1]) / 100) * reference;
  }

  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.fontSize = value;
  probe.style.width = `${reference}px`;
  container.appendChild(probe);

  const pixels = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();

  return Number.isFinite(pixels) ? pixels : fallback;
}

function resolveCssColor(value, container, fallback) {
  if (value === "currentColor") {
    return getComputedStyle(container).color || fallback;
  }

  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.color = value;
  container.appendChild(probe);

  const resolvedColor = getComputedStyle(probe).color;
  probe.remove();

  return resolvedColor || fallback;
}

export default function ParticleText({
  text,
  fontSize = 100,
  fontWeight = 700,
  color = "#ffffff",
  interactionRadius = 100,
  interactionStrength = 3,
  particleSize = 2,
  particleGap = 5,
  className = "",
  inline = false,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const animationRef = useRef(null);

  const particlesRef = useRef([]);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    const resolvedColor = resolveCssColor(color, container, "#ffffff");

    const createParticles = () => {
      // Тимчасовий canvas для визначення пікселів тексту
      const textCanvas = document.createElement("canvas");

      const textCtx = textCanvas.getContext("2d");

      if (!textCtx) return;

      const currentFontSize = resolveCssPixels(fontSize, container, 16, 100);
      const currentParticleGap = resolveCssPixels(
        particleGap,
        container,
        currentFontSize,
        5,
      );
      const currentParticleSize = resolveCssPixels(
        particleSize,
        container,
        currentFontSize,
        2,
      );

      const safeParticleGap = Math.max(currentParticleGap, 0.1);

      textCtx.font = `${fontWeight} ${currentFontSize}px Arial, sans-serif`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      const textWidth = Math.ceil(textCtx.measureText(text).width);
      width = textWidth + currentParticleSize;
      height = Math.ceil(currentFontSize);

      textCanvas.width = width;
      textCanvas.height = height;

      textCtx.font = `${fontWeight} ${currentFontSize}px Arial, sans-serif`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      textCtx.fillStyle = "#ffffff";

      textCtx.fillText(text, width / 2, height / 2);

      const imageData = textCtx.getImageData(0, 0, width, height);

      const particles = [];

      for (let y = 0; y < height; y += safeParticleGap) {
        for (let x = 0; x < width; x += safeParticleGap) {
          const index = (y * width + x) * 4;

          const alpha = imageData.data[index + 3];

          if (alpha > 100) {
            particles.push({
              x,
              y,

              originX: x,
              originY: y,

              vx: 0,
              vy: 0,

              size: currentParticleSize,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    const setup = () => {
      createParticles();
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("pointermove", handlePointerMove);

    canvas.addEventListener("pointerleave", handlePointerLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const particle of particles) {
        // -------------------------
        // Взаємодія з курсором
        // -------------------------

        if (mouse.active) {
          const dx = particle.x - mouse.x;
          const dy = particle.y - mouse.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius && distance > 0) {
            const force = (interactionRadius - distance) / interactionRadius;

            const directionX = dx / distance;
            const directionY = dy / distance;

            particle.vx += directionX * force * interactionStrength;

            particle.vy += directionY * force * interactionStrength;
          }
        }

        // -------------------------
        // Повернення до початкової
        // позиції
        // -------------------------

        const homeDx = particle.originX - particle.x;

        const homeDy = particle.originY - particle.y;

        particle.vx += homeDx * 0.015;
        particle.vy += homeDy * 0.015;

        // -------------------------
        // Тертя
        // -------------------------

        particle.vx *= 0.88;
        particle.vy *= 0.88;

        // -------------------------
        // Рух
        // -------------------------

        particle.x += particle.vx;
        particle.y += particle.vy;

        // -------------------------
        // Малювання
        // -------------------------

        ctx.fillStyle = resolvedColor;

        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      setup();
    });

    resizeObserver.observe(container);

    setup();
    animate();

    return () => {
      resizeObserver.disconnect();

      canvas.removeEventListener("pointermove", handlePointerMove);

      canvas.removeEventListener("pointerleave", handlePointerLeave);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    text,
    fontSize,
    fontWeight,
    color,
    interactionRadius,
    interactionStrength,
    particleSize,
    particleGap,
  ]);

  return (
    <div
      ref={containerRef}
      className={`inline-block h-[1em] flex-none overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block touch-none" />
    </div>
  );
}
