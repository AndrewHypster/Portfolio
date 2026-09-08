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

  // Можна:
  // 100
  // "50%"
  // "10vw"
  // "10vh"
  // "5rem"
  fontSize = 100,

  fontWeight = 700,

  color = "#ffffff",

  interactionRadius = 100,
  interactionStrength = 5,

  particleSize = 4,
  particleGap = 8,

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

    let resolvedColor = resolveCssColor(color, container, "#ffffff");

    const createParticles = () => {
      const textCanvas = document.createElement("canvas");
      const textCtx = textCanvas.getContext("2d");

      if (!textCtx) return;

      const parentFontSize =
        parseFloat(getComputedStyle(container).fontSize) || 100;

      const currentFontSize = resolveCssPixels(
        fontSize,
        container,
        parentFontSize,
        parentFontSize,
      );

      const currentParticleGap = resolveCssPixels(
        particleGap,
        container,
        currentFontSize,
        5,
      );

      const requestedParticleSize = resolveCssPixels(
        particleSize,
        container,
        currentFontSize,
        2,
      );

      // Keep each square proportional to the rendered letter height.
      const currentParticleSize = Math.min(
        requestedParticleSize,
        currentParticleGap * 0.8,
      );

      const safeParticleGap = Math.max(currentParticleGap, 0.5);

      textCtx.font = `${fontWeight} ${currentFontSize}px Arial, sans-serif`;

      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      const metrics = textCtx.measureText(text);

      const textWidth = Math.ceil(metrics.width);
      const textHeight = Math.ceil(currentFontSize);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      /*
       * Розмір ParticleText = розмір тексту
       */
      width = textWidth;
      height = textHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      textCanvas.width = width;
      textCanvas.height = height;

      textCtx.font = `${fontWeight} ${currentFontSize}px Arial, sans-serif`;

      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";

      textCtx.fillStyle = "#fff";

      textCtx.fillText(text, width / 2, height / 2);

      const imageData = textCtx.getImageData(0, 0, width, height);

      const particles = [];

      for (let y = 0; y < height; y += safeParticleGap) {
        for (let x = 0; x < width; x += safeParticleGap) {
          const sampleX = Math.min(
            Math.floor(x + safeParticleGap / 2),
            width - 1,
          );
          const sampleY = Math.min(
            Math.floor(y + safeParticleGap / 2),
            height - 1,
          );
          const index = (sampleY * width + sampleX) * 4;

          const alpha = imageData.data[index + 3];

          if (alpha > 100) {
            particles.push({
              x: x + (safeParticleGap - currentParticleSize) / 2,
              y: y + (safeParticleGap - currentParticleSize) / 2,

              originX: x + (safeParticleGap - currentParticleSize) / 2,
              originY: y + (safeParticleGap - currentParticleSize) / 2,

              vx: 0,
              vy: 0,

              size: currentParticleSize,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      mouseRef.current.x = event.clientX - rect.left;

      mouseRef.current.y = event.clientY - rect.top;

      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;

      for (const particle of particlesRef.current) {
        particle.vx *= 0.35;
        particle.vy *= 0.35;
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);

    canvas.addEventListener("pointerleave", handlePointerLeave);

    /*
     * ResizeObserver
     *
     * Тепер ми НЕ змінюємо
     * width / height контейнера.
     */
    const resizeObserver = new ResizeObserver(() => {
      createParticles();
    });

    resizeObserver.observe(container.parentElement);

    /*
     * Початкова генерація
     */
    createParticles();

    /*
     * Animation loop
     */
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      const mouse = mouseRef.current;

      for (const particle of particles) {
        /*
         * Взаємодія з курсором
         */
        if (mouse.active) {
          const dx = particle.x - mouse.x;

          const dy = particle.y - mouse.y;

          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius && distance > 0) {
            const force = Math.pow(
              (interactionRadius - distance) / interactionRadius,
              2,
            );

            const directionX = dx / distance;
            const directionY = dy / distance;

            particle.vx += directionX * force * interactionStrength;

            particle.vy += directionY * force * interactionStrength;
          }
        }

        // Повернення до початкової позиції
        const homeDx = particle.originX - particle.x;
        const homeDy = particle.originY - particle.y;

        particle.vx += homeDx * 0.035;
        particle.vy += homeDy * 0.035;

        // Тертя
        particle.vx *= 0.82;
        particle.vy *= 0.82;

        if (!mouse.active && Math.abs(homeDx) < 0.1 && Math.abs(homeDy) < 0.1) {
          particle.x = particle.originX;
          particle.y = particle.originY;
          particle.vx = 0;
          particle.vy = 0;
        }

        // Рух
        particle.x += particle.vx;
        particle.y += particle.vy;

        /*
         * Малювання
         */
        ctx.fillStyle = resolvedColor;

        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

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
      className={`relative inline-block flex-none ${className}`}
    >
      <canvas ref={canvasRef} className="block touch-none" />
    </div>
  );
}
