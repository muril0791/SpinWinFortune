import React, { useState } from 'react';
import { Button, Typography, TextField, Box, Modal } from '@mui/material';

interface BetAreaProps {
    symbols: string[];
    onSpinClick: () => void; // Inicia o spin
    onBetPlaced: (bets: { symbol: string; amount: number }[]) => void;
}

const BetArea: React.FC<BetAreaProps> = ({ symbols, onSpinClick, onBetPlaced }) => {
    const [betValues, setBetValues] = useState<{ [key: string]: number }>({});
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const toggleSymbolSelection = (symbol: string) => {
        setSelectedSymbols(prev =>
            prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
        );
        if (!betValues[symbol]) {
            setBetValues({ ...betValues, [symbol]: 0 });
        }
    };

    const updateBetValue = (symbol: string, value: string) => {
        const numValue = value === '' ? 0 : Math.max(0, parseInt(value, 10));
        setBetValues({ ...betValues, [symbol]: numValue });
    };

    const confirmBet = () => {
        const bets = selectedSymbols.map(symbol => ({
            symbol,
            amount: betValues[symbol] || 0,
        })).filter(bet => bet.amount > 0);

        if (bets.length > 0) {
            onBetPlaced(bets);
            onSpinClick(); // Inicia o spin quando a aposta é confirmada
        } else {
            alert('Por favor, selecione símbolos e defina valores de aposta.');
        }
    };

    // Estilos e JSX podem ser adaptados conforme necessário
    // A seguir está um exemplo simplificado e você deve integrar com seu design e estrutura
    return (
        <Box>
            <Typography variant="h5">Área de Aposta</Typography>
            <Button onClick={() => setModalOpen(true)}>Escolher Símbolos</Button>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box>
                    <Typography variant="h6">Selecione os Símbolos</Typography>
                    {symbols.map(symbol => (
                        <div key={symbol}>
                            <Button onClick={() => toggleSymbolSelection(symbol)}>
                                {symbol}
                            </Button>
                            {selectedSymbols.includes(symbol) && (
                                <TextField
                                    type="number"
                                    value={betValues[symbol]}
                                    onChange={(e) => updateBetValue(symbol, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                </Box>
            </Modal>
            <Typography>Símbolos escolhidos: {selectedSymbols.join(', ')}</Typography>
            <Button onClick={confirmBet}>Confirmar Aposta</Button>
        </Box>
    );
};

export default BetArea;
