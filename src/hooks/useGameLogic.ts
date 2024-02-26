// useGameLogic.ts
import { useState, useCallback } from "react";

const symbols = ["6", "7", "8", "Q", "K", "J", "🍒", "🍀", "🔔", "💎"];

export const useGameLogic = () => {
  const [betValue, setBetValue] = useState<number>(0);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
  const [isSpinEnabled, setIsSpinEnabled] = useState<boolean>(false);
  const [board, setBoard] = useState<string[][]>(
    Array(5).fill(Array(5).fill(""))
  );
  const [playerBalance, setPlayerBalance] = useState<number>(100);

  const onBetPlaced = useCallback((value: number, symbols: string[]) => {
    setBetValue(value);
    setSelectedSymbols(symbols);
    setIsSpinEnabled(true);
  }, []);

  const checkForWin = (board: string[][]): void => {
    let win = false;

    // Verifica linhas
    for (let row = 0; row < board.length; row++) {
      let count = 1;
      for (let col = 1; col < board[row].length; col++) {
        if (
          board[row][col] === board[row][col - 1] &&
          selectedSymbols.includes(board[row][col])
        ) {
          count++;
          if (count >= 3) {
            win = true;
            break;
          }
        } else {
          count = 1;
        }
      }
      if (win) break;
    }

    // Verifica colunas se ainda não encontrou vitória
    if (!win) {
      for (let col = 0; col < board[0].length; col++) {
        let count = 1;
        for (let row = 1; row < board.length; row++) {
          if (
            board[row][col] === board[row - 1][col] &&
            selectedSymbols.includes(board[row][col])
          ) {
            count++;
            if (count >= 3) {
              win = true;
              break;
            }
          } else {
            count = 1;
          }
        }
        if (win) break;
      }
    }

    if (win) {
      console.log("Vitória! Sequência encontrada.");
      // Calcula o ganho. Exemplo: valor da aposta * número de símbolos * um multiplicador
      const winAmount = betValue * selectedSymbols.length * 2; // Supondo um multiplicador de 2 para o exemplo
      setPlayerBalance(playerBalance + winAmount); // Atualiza o saldo do jogador
    } else {
      console.log("Nenhuma sequência vencedora.");
      // Lógica para perda da aposta
      // Subtrai o valor apostado (dividido pelo número de símbolos escolhidos) do saldo do jogador
      setPlayerBalance(playerBalance - betValue);
    }
  };

  const onSpin = useCallback(() => {
    // Simula o preenchimento do tabuleiro com símbolos aleatórios após o giro
    const newBoard = Array.from({ length: 5 }, () =>
      Array.from(
        { length: 5 },
        () => symbols[Math.floor(Math.random() * symbols.length)]
      )
    );
    setBoard(newBoard);
    setIsSpinEnabled(false);
    // Aqui você pode invocar a lógica de verificação de sequências vencedoras
    checkForWin(newBoard);
  }, [symbols]);

  // Função para verificar sequências vencedoras será adicionada aqui

  return {
    symbols,
    betValue,
    selectedSymbols,
    isSpinEnabled,
    playerBalance, // Adiciona o saldo do jogador
    board,
    onBetPlaced,
    onSpin,
    setBetValue,
    setSelectedSymbols,
    setIsSpinEnabled,
    setBoard,
  };
};
