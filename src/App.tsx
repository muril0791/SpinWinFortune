import React, { useState, useCallback } from 'react';
import Board from './components/Board';
import Roulette from './components/Roulette';
import BetArea from './components/BetArea';
import { useGameLogic } from './hooks/useGameLogic';
import './App.css';

const App: React.FC = () => {
    const {
        playerBalance,
        board,
        onBetPlaced,
        onSpinComplete,
        symbols,
    } = useGameLogic();
    
    const [isSpinning, setIsSpinning] = useState(false);

    // Esta função é passada para BetArea e é chamada quando o usuário confirma a aposta
    const handleSpinClick = useCallback(() => {
        setIsSpinning(true);
        // Define um tempo para parar a roleta após 5 segundos
        setTimeout(() => {
            setIsSpinning(false);
        }, 5000);
    }, []);

    // Adapte a função onSpinComplete conforme necessário
    const handleSpinComplete = useCallback(() => {
        onSpinComplete();
        setIsSpinning(false); // Assegura que o estado de giro está desligado
    }, [onSpinComplete]);

    return (
        <div className="app">
            <div className="game-area">
                <Board board={board} />
                <Roulette startSpinning={isSpinning} onSpinComplete={handleSpinComplete} />
                <BetArea
                    symbols={symbols}
                    onSpinClick={handleSpinClick}
                    onBetPlaced={onBetPlaced}
                />
                <div>Saldo do Jogador: {playerBalance}</div>
            </div>
        </div>
    );
};

export default App;
