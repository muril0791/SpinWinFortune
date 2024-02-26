import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

interface BoardProps {
    board: string[][];
}

const Board: React.FC<BoardProps> = ({ board }) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const app = new PIXI.Application({
            width: 350,
            height: 350 ,
            backgroundColor: 0x1099bb,
        });

        ref.current?.appendChild(app.view as unknown as HTMLElement);

        board.forEach((row, rowIndex) => {
            row.forEach((symbol, colIndex) => {
                const cell = new PIXI.Graphics();
                cell.lineStyle(2, 0x000000).beginFill(0xFFFFFF).drawRect(colIndex * 70, rowIndex * 70, 70, 70).endFill();
                app.stage.addChild(cell);

                const textStyle = new PIXI.TextStyle({
                    fontFamily: 'Arial',
                    fontSize: 24,
                    fill: 'black',
                });
                const text = new PIXI.Text(symbol, textStyle);
                text.x = colIndex * 70 + 50 - text.width / 2;
                text.y = rowIndex * 70 + 50 - text.height / 2;
                app.stage.addChild(text);
            });
        });

        return () => app.destroy(true);
    }, [board]);

    return <div ref={ref} />;
}

export default Board;
