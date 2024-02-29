import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const Roulette: React.FC = () => {
    const pixiContainer = useRef<HTMLDivElement>(null);
    const app = useRef<PIXI.Application>();
    const symbols = ['6', '7', '8', 'Q', 'K', 'J', '🍒', '🍀', '🔔', '💎'];
    let moveSpeed = 0;
    const symbolWidth = 80; // Largura do espaço ocupado por cada símbolo (incluindo margem)

    const spin = () => {
        moveSpeed = 25;
    };

    useEffect(() => {
        app.current = new PIXI.Application({
            width: 800,
            height: 150,
            backgroundColor: 0x0f0f0f,
        });

        if (pixiContainer.current && app.current) {
            pixiContainer.current.appendChild(app.current.view as unknown as Node);
            const container = new PIXI.Container();
            app.current.stage.addChild(container);
            container.y = (app.current.screen.height - 50) / 2;

            for (let i = 0; i < symbols.length * 2; i++) {
                const symbolIndex = i % symbols.length;
                const symbol = symbols[symbolIndex];

                // Quadrado branco de fundo
                const square = new PIXI.Graphics();
                square.beginFill(0xFFFFFF); // Branco
                square.drawRect(0, 0, 50, 50); // Tamanho do quadrado
                square.endFill();
                square.x = i * symbolWidth;
                square.y = 0;

                // Texto do símbolo com estilo aprimorado
                const text = new PIXI.Text(symbol, {
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: 0x0f0f0f, // Cor do texto
                    align: 'center'
                });

                text.x = square.x + (square.width - text.width) / 2;
                text.y = square.y + (square.height - text.height) / 2;

                container.addChild(square);
                container.addChild(text);
            }

            // Risco centralizado
            const line = new PIXI.Graphics();
            line.lineStyle(4, 0xFF0000, 1); // Linha vermelha para indicação
            line.moveTo(app.current.screen.width / 2, 0);
            line.lineTo(app.current.screen.width / 2, app.current.screen.height);
            app.current.stage.addChild(line);

            app.current.ticker.add(() => {
                if (moveSpeed > 0) {
                    container.children.forEach((child) => {
                        child.x -= moveSpeed;

                        // Reposiciona os símbolos para o início quando saem da tela
                        if (child.x + 50 < 0) {
                            child.x += symbolWidth * symbols.length * 2;
                        }
                    });

                    moveSpeed *= 0.99;
                    if (moveSpeed < 0.05) {
                        moveSpeed = 0;
                    }
                }
            });
        }

        return () => {
            app.current?.destroy(true, { children: true, texture: true, baseTexture: true });
        };
    }, []);

    return (
        <div>
            <button onClick={spin}>Spin</button>
            <div ref={pixiContainer} />
        </div>
    );
};

export default Roulette;
