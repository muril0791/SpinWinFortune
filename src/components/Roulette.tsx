import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { gsap } from "gsap";

interface RouletteProps {
  startSpinning: boolean;
  onSpinComplete: () => void;
}

const Roulette: React.FC<RouletteProps> = ({
  startSpinning,
  onSpinComplete,
}) => {
  const pixiContainer = useRef<HTMLDivElement>(null);
  const pixiApp = useRef<PIXI.Application | null>(null);
  const symbolWidth = 100; // Largura de cada símbolo
  const symbolHeight = 100; // Altura de cada símbolo

  useEffect(() => {
    // Cria uma nova instância do PIXI.Application e atribui a pixiApp.current
    pixiApp.current = new PIXI.Application({
      width: symbolWidth * 10,
      height: symbolHeight,
      backgroundColor: 0x0f0f0f,
    });

    // Adiciona a view do aplicativo PIXI ao container
    pixiContainer.current?.appendChild(
      pixiApp.current.view as unknown as HTMLElement
    );

    // Caminhos para as imagens dos símbolos
    const symbolPaths = [
      "src/assets/bell.png",
      "src/assets/cherry.png",
      "src/assets/clover.png",
      "src/assets/diamond.png",
      "src/assets/letter-k.png",
      "src/assets/letter-j.png",
      "src/assets/letter-q.png",
      "src/assets/number-10.png",
      "src/assets/number-7.png",
      "src/assets/number-8.png",
      // ... outros caminhos para suas imagens
    ];

    // Criação dos sprites dos símbolos
    symbolPaths.forEach((path, index) => {
      if (pixiApp.current) {
        const texture = PIXI.Texture.from(path);
        const sprite = new PIXI.Sprite(texture);
        sprite.width = symbolWidth;
        sprite.height = symbolHeight;
        sprite.x = index * symbolWidth;
        sprite.y = 0;
        pixiApp.current.stage.addChild(sprite);
      }
    });

    return () => {
      // Destroi a aplicação quando o componente é desmontado
      if (pixiApp.current) {
        pixiApp.current.destroy();
      }
    };
  }, [symbolWidth, symbolHeight]);

  useEffect(() => {
    // Certifique-se de que o PIXI.Application está definido antes de usar
    if (startSpinning && pixiApp.current) {
      gsap.to(pixiApp.current.stage.children, {
        x: `+=${1000}`,
        duration: 0.25,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((x) => parseFloat(x) % (symbolWidth * 10)),
        },
      });
    } else if (!startSpinning && pixiApp.current) {
      gsap.killTweensOf(pixiApp.current.stage.children);
      onSpinComplete();
    }
  }, [startSpinning, onSpinComplete, symbolWidth]);

  return (
    <div
      ref={pixiContainer}
      style={{ width: "100%", overflow: "hidden", backgroundColor: "#000" }}
    />
  );
};

export default Roulette;
