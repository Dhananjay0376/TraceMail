import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const MOBILE_BREAKPOINT = 768;

function BentoCard({ children, glowColor, particleCount, enableStars, enableTilt, enableMagnetism, clickEffect }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || window.innerWidth <= MOBILE_BREAKPOINT || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const particles = [];
    const clearParticles = () => {
      particles.splice(0).forEach((particle) => gsap.to(particle, { opacity: 0, scale: 0, duration: 0.2, onComplete: () => particle.remove() }));
    };
    const onMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const px = `${(x / rect.width) * 100}%`;
      const py = `${(y / rect.height) * 100}%`;
      card.style.setProperty('--glow-x', px);
      card.style.setProperty('--glow-y', py);
      if (enableTilt || enableMagnetism) {
        const dx = x / rect.width - 0.5;
        const dy = y / rect.height - 0.5;
        gsap.to(card, { rotateX: enableTilt ? -dy * 7 : 0, rotateY: enableTilt ? dx * 7 : 0, x: enableMagnetism ? dx * 5 : 0, y: enableMagnetism ? dy * 5 : 0, duration: 0.25, ease: 'power2.out', transformPerspective: 1000 });
      }
    };
    const onEnter = () => {
      card.classList.add('magic-bento-card--active');
      if (!enableStars) return;
      Array.from({ length: particleCount }).forEach((_, index) => {
        const particle = document.createElement('i');
        particle.className = 'magic-bento-particle';
        particle.style.setProperty('--particle-color', glowColor);
        particle.style.left = `${12 + Math.random() * 76}%`;
        particle.style.top = `${12 + Math.random() * 76}%`;
        card.appendChild(particle);
        particles.push(particle);
        gsap.fromTo(particle, { opacity: 0, scale: 0 }, { opacity: 0.9, scale: 1, delay: index * 0.045, duration: 0.25, ease: 'back.out(2)' });
        gsap.to(particle, { x: () => (Math.random() - 0.5) * 56, y: () => (Math.random() - 0.5) * 56, duration: 1.6 + Math.random(), repeat: -1, yoyo: true, ease: 'sine.inOut' });
      });
    };
    const onLeave = () => {
      card.classList.remove('magic-bento-card--active');
      clearParticles();
      gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.35, ease: 'power2.out' });
    };
    const onClick = (event) => {
      if (!clickEffect) return;
      const rect = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'magic-bento-ripple';
      ripple.style.setProperty('--ripple-color', glowColor);
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      card.appendChild(ripple);
      gsap.fromTo(ripple, { scale: 0, opacity: 0.75 }, { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() });
    };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('click', onClick);
    return () => { card.removeEventListener('pointermove', onMove); card.removeEventListener('pointerenter', onEnter); card.removeEventListener('pointerleave', onLeave); card.removeEventListener('click', onClick); clearParticles(); };
  }, [clickEffect, enableMagnetism, enableStars, enableTilt, glowColor, particleCount]);

  return <div ref={cardRef} className="magic-bento-card" style={{ '--glow-color': glowColor }}>{children}</div>;
}

export default function MagicBento({ children, className = '', enableStars = true, enableSpotlight = true, enableBorderGlow = true, enableTilt = true, enableMagnetism = true, clickEffect = true, particleCount = 8, spotlightRadius = 300, glowColor = '0, 227, 216' }) {
  const gridRef = useRef(null);
  const onMove = (event) => {
    if (!enableSpotlight || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    gridRef.current.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
    gridRef.current.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
  };
  return (
    <div ref={gridRef} onPointerMove={onMove} className={`magic-bento-grid ${enableSpotlight ? 'magic-bento-grid--spotlight' : ''} ${enableBorderGlow ? 'magic-bento-grid--border-glow' : ''} ${className}`} style={{ '--spotlight-radius': `${spotlightRadius}px`, '--glow-color': glowColor }}>
      {Array.isArray(children) ? children.map((child, index) => <BentoCard key={child?.key ?? index} {...{ glowColor, particleCount, enableStars, enableTilt, enableMagnetism, clickEffect }}>{child}</BentoCard>) : <BentoCard {...{ glowColor, particleCount, enableStars, enableTilt, enableMagnetism, clickEffect }}>{children}</BentoCard>}
    </div>
  );
}
