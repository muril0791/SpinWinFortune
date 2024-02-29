import { useState, useCallback } from 'react';

// Tipo para apostas
type Bet = {
    symbol: string;
    amount: number;
};
interface SymbolMultipliers {
  [key: string]: {
    3: number;
    4: number;
    5: number;
  };
}
// Multiplicadores para cada símbolo com base na sequência
const symbolMultipliers: SymbolMultipliers = {
  "🍒": { 3: 1.5, 4: 2, 5: 2.5 },
  "🍀": { 3: 1.2, 4: 1.8, 5: 2.2 },
  "🔔": { 3: 1.3, 4: 1.9, 5: 2.3 },
  "💎": { 3: 1.4, 4: 2.0, 5: 2.4 },
  // Adicione outros símbolos conforme necessário
};
const symbols = ["6", "7", "8", "Q", "K", "J", "🍒", "🍀", "🔔", "💎"];
export const useGameLogic = () => {
    const [playerBalance, setPlayerBalance] = useState<number>(100);
    const [bets, setBets] = useState<Bet[]>([]);
    const [isSpinEnabled, setIsSpinEnabled] = useState<boolean>(false);
    const [board, setBoard] = useState<string[][]>(Array(5).fill(Array(5).fill(""))); // Tabuleiro 5x5 inicial

    const onBetPlaced = useCallback((newBets: Bet[]) => {
        setBets(newBets);
        const totalBetAmount = newBets.reduce((acc, bet) => acc + bet.amount, 0);
        setPlayerBalance((balance) => balance - totalBetAmount);
        setIsSpinEnabled(true); // Habilita o giro da roleta
    }, []);

    const onSpinComplete = useCallback(() => {
        const newBoard = generateRandomBoard();
        setBoard(newBoard);
        const winAmount = calculateWinAmount(newBoard, bets);
        setPlayerBalance((balance) => balance + winAmount);
        setIsSpinEnabled(false); // Desabilita o giro após a conclusão
    }, [bets]);

    // Gera um tabuleiro com símbolos aleatórios
    const generateRandomBoard = (): string[][] => {
        return Array.from({ length: 5 }, () =>
            Array.from({ length: 5 }, () => Object.keys(symbolMultipliers)[Math.floor(Math.random() * Object.keys(symbolMultipliers).length)])
        );
    };

    // Calcula o ganho com base no tabuleiro e nas apostas
    const calculateWinAmount = (board: string[][], bets: Bet[]): number => {
        let winAmount = 0;
        bets.forEach((bet) => {
            const sequences = findSequences(board, bet.symbol);
            sequences.forEach(seq => {
              winAmount += bet.amount * (symbolMultipliers[bet.symbol][seq as 3 | 4 | 5] || 0);
            });
        });
        return winAmount;
    };

    // Encontra sequências de um dado símbolo no tabuleiro
    const findSequences = (board: string[][], symbol: string): number[] => {
        let sequences = [];

        // Verifica sequências horizontais e verticais
        for (let i = 0; i < 5; i++) {
            let horizontalCount = 0;
            let verticalCount = 0;
            for (let j = 0; j < 5; j++) {
                // Horizontal
                if (board[i][j] === symbol) {
                    horizontalCount++;
                } else {
                    if (horizontalCount >= 3) sequences.push(horizontalCount);
                    horizontalCount = 0;
                }

                // Vertical
                if (board[j][i] === symbol) {
                    verticalCount++;
                } else {
                    if (verticalCount >= 3) sequences.push(verticalCount);
                    verticalCount = 0;
                }
            }
            // Verifica se há sequências no final da linha/coluna
            if (horizontalCount >= 3) sequences.push(horizontalCount);
            if (verticalCount >= 3) sequences.push(verticalCount);
        }

        // Adicione lógica para diagonais se necessário

        return sequences;
    };

    return {
        playerBalance,
        bets,
        isSpinEnabled,
        board,
        onBetPlaced,
        onSpinComplete,
        symbols
    };
};
