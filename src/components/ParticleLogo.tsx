import React, { useEffect, useRef, useState } from 'react';
import pluralMark from '../assets/images/logos/plural-mark.png';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
}

const ParticleLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load image
    const img = new Image();
    img.src = pluralMark;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);

      // Set canvas size
      const resizeCanvas = () => {
        const maxWidth = Math.min(window.innerWidth * 0.8, 1200);
        const maxHeight = Math.min(window.innerHeight * 0.8, 1200);
        const aspectRatio = img.width / img.height;

        let width = maxWidth;
        let height = maxWidth / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = maxHeight * aspectRatio;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        createParticles();
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      // Create particles from image
      const createParticles = () => {
        if (!imageRef.current || !canvas) return;

        const particles: Particle[] = [];
        const img = imageRef.current;
        const pixelDensity = 8; // Espaçamento entre partículas (menor = mais partículas)
        const particleSize = 2;

        // Draw image temporarily to get pixel data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        tempCtx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;

        // Create particles from image pixels
        for (let y = 0; y < img.height; y += pixelDensity) {
          for (let x = 0; x < img.width; x += pixelDensity) {
            const index = (y * img.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            // Only create particle if pixel is not transparent
            if (a > 50) {
              const brightness = (r + g + b) / 3;
              const opacity = Math.min(a / 255, 0.8);

              // Map to canvas coordinates
              const targetX = (x / img.width) * canvas.width;
              const targetY = (y / img.height) * canvas.height;

              // Start particles from random positions
              const startX = Math.random() * canvas.width;
              const startY = Math.random() * canvas.height;

              particles.push({
                x: startX,
                y: startY,
                targetX,
                targetY,
                size: particleSize + Math.random() * 1,
                color: `rgba(${r}, ${g}, ${b}, ${opacity})`,
                opacity: opacity * 0.9,
                speed: Math.random() * 0.02 + 0.01,
              });
            }
          }
        }

        particlesRef.current = particles;
        animate();
      };

      // Animate particles
      let frameCount = 0;
      const animate = () => {
        if (!canvas || !ctx) return;

        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesRef.current.forEach((particle, index) => {
          // Move particle towards target
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > 1) {
            particle.x += dx * particle.speed;
            particle.y += dy * particle.speed;
          } else {
            particle.x = particle.targetX;
            particle.y = particle.targetY;
          }

          // Subtle floating animation even when in place
          const time = frameCount * 0.01;
          const floatX = Math.sin(time + index * 0.1) * 0.5;
          const floatY = Math.cos(time + index * 0.1) * 0.5;
          const pulse = Math.sin(time * 2 + index * 0.05) * 0.2 + 1;

          // Draw particle with glow
          ctx.save();
          
          // Pulsing opacity
          const pulseOpacity = particle.opacity * (0.8 + Math.sin(time * 3 + index * 0.1) * 0.2);
          ctx.globalAlpha = pulseOpacity;

          // Outer glow with pulsing effect
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10 * pulse;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(
            particle.x + floatX,
            particle.y + floatY,
            particle.size * pulse,
            0,
            Math.PI * 2
          );
          ctx.fill();

          // Inner bright core
          ctx.shadowBlur = 0;
          ctx.globalAlpha = pulseOpacity * 1.5;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(
            particle.x + floatX,
            particle.y + floatY,
            particle.size * 0.4 * pulse,
            0,
            Math.PI * 2
          );
          ctx.fill();

          ctx.restore();
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="logo-background-glow"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default ParticleLogo;

