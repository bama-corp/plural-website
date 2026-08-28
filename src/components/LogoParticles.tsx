import React, { useEffect, useRef, useState } from 'react';
import pluralMark from '../assets/images/logos/plural-mark.png';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  opacity: number;
  color: string;
  speed: number;
  angle: number;
  distance: number;
}

const LogoParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Load image
    const img = new Image();
    img.src = pluralMark;
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (!imageLoaded || !imageRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const maxWidth = 800;
    const maxHeight = 800;
    let imgWidth = img.width;
    let imgHeight = img.height;

    // Scale image to fit
    const scale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
    imgWidth = imgWidth * scale;
    imgHeight = imgHeight * scale;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createParticles();
    };

    const createParticles = () => {
      if (!imageRef.current) return;

      // Create temporary canvas to analyze image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imgWidth;
      tempCanvas.height = imgHeight;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      tempCtx.drawImage(imageRef.current, 0, 0, imgWidth, imgHeight);
      const imageData = tempCtx.getImageData(0, 0, imgWidth, imgHeight);
      const data = imageData.data;

      const particles: Particle[] = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const offsetX = centerX - imgWidth / 2;
      const offsetY = centerY - imgHeight / 2;

      // Sample pixels to create particles
      const step = 4; // Sample every 4th pixel for performance
      for (let y = 0; y < imgHeight; y += step) {
        for (let x = 0; x < imgWidth; x += step) {
          const index = (y * imgWidth + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          // Only create particles for visible pixels (not transparent)
          if (a > 50) {
            const brightness = (r + g + b) / 3;
            const opacity = a / 255;

            // Create particle at target position
            const targetX = offsetX + x;
            const targetY = offsetY + y;

            // Start particles from random positions around center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 200 + 100;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;

            particles.push({
              x: startX,
              y: startY,
              targetX,
              targetY,
              size: Math.random() * 2 + 1.5,
              opacity: opacity * 0.8 + 0.2,
              color: `rgba(239, 68, 68, ${opacity})`,
              speed: Math.random() * 0.02 + 0.01,
              angle: Math.random() * Math.PI * 2,
              distance: Math.random() * 3 + 2,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Move particle towards target with easing
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          particle.x += dx * particle.speed;
          particle.y += dy * particle.speed;
        } else {
          // Particle reached target, add subtle floating animation
          particle.angle += 0.02;
          particle.x = particle.targetX + Math.cos(particle.angle) * particle.distance;
          particle.y = particle.targetY + Math.sin(particle.angle) * particle.distance;
        }

        // Pulsing opacity
        const pulse = Math.sin(Date.now() * 0.001 + index * 0.1) * 0.2 + 0.8;
        const currentOpacity = particle.opacity * pulse;

        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = currentOpacity;

        // Outer glow
        ctx.shadowColor = 'rgba(239, 68, 68, 0.8)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        ctx.shadowBlur = 0;
        ctx.globalAlpha = currentOpacity * 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation after a short delay to allow particles to form
    setTimeout(() => {
      animate();
    }, 100);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [imageLoaded]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-1"
      style={{ background: 'transparent' }}
    />
  );
};

export default LogoParticles;

