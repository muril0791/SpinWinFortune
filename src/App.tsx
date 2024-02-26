// App.tsx
import React from 'react';
import Board from './components/Board';
import Roulette from './components/Roulette';
import BetArea from './components/BetArea';
import { useGameLogic } from './hooks/useGameLogic'; // Ajuste o caminho conforme necessário
import './App.css';

const App: React.FC = () => {
    const {
        symbols,
        board,
        onBetPlaced,
        onSpin,
    } = useGameLogic();

    return (
        <div className="app">
            <div className="game-area">
                <Board board={board} />
                <Roulette  />
                <BetArea 
                    symbols={symbols} 
                    onSpin={onSpin} 
                    onBetPlaced={onBetPlaced}  />
            </div>
        </div>
    );
};

export default App;
