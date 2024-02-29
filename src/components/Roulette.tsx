import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';

interface RouletteProps {
  startSpinning: boolean;
  onSpinComplete: () => void;
}

const Roulette: React.FC<RouletteProps> = ({ startSpinning, onSpinComplete }) => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const pixiApp = useRef<PIXI.Application>();
  const symbolWidth = 80; // Largura de cada símbolo

  useEffect(() => {
    pixiApp.current = new PIXI.Application({
        width: 800,
        height: 150,
        backgroundColor: 0x0f0f0f,
    });

    pixiContainer.current?.appendChild(pixiApp.current.view as unknown as Node);

    // Criação dos símbolos
    const symbols = ['6', '7', '8', 'Q', 'K', 'J', '🍒', '🍀', '🔔', '💎'];
    symbols.forEach((symbol, index) => {
      const text = new PIXI.Text(symbol, {
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
      });
      text.x = index * symbolWidth;
      pixiApp.current?.stage.addChild(text);
    });

    return () => {
      pixiApp.current?.destroy();
    };
  }, [symbolWidth]);

  useEffect(() => {
    if (startSpinning && pixiApp.current) {
      gsap.to(pixiApp.current.stage.children, {
        x: `+=${symbolWidth * 10}`,
        duration: 0.25,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % (symbolWidth * 10)),
        },
      });
    }
  
    if (!startSpinning && pixiApp.current) {
      const children = pixiApp.current.stage.children;
      if (children) {
        gsap.killTweensOf(children);
      }
      onSpinComplete();
    }
  }, [startSpinning, onSpinComplete, symbolWidth]);
  

  return <div ref={pixiContainer} style={{ width: '100%', overflow: 'hidden', backgroundColor: '#000' }} />;
};

export default Roulette;
