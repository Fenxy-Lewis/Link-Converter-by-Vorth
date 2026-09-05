import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
// Import Vanta side-effect to populate window.VANTA
import 'vanta/dist/vanta.net.min';

export default function AnimatedBackground() {
  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect && myRef.current && window.VANTA && window.VANTA.NET) {
      setVantaEffect(
        window.VANTA.NET({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xff3f81,           // vibrant pink/magenta
          backgroundColor: 0x23153c, // deep dark purple/indigo
          points: 12.00,             // Moderate amount of points
          maxDistance: 22.00,        // Low max distance
          spacing: 16.00,            // Small thin delicate lines/points
          showDots: true             // Standard small dots
        })
      );
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return (
    <div 
      ref={myRef} 
      className="fixed inset-0 -z-10 w-full h-full"
    />
  );
}
