import React, { useState } from 'react';
import { Button, Typography, TextField, Box, Modal, Stack } from '@mui/material';

interface BetAreaProps {
    symbols: string[];
    onSpin: () => void;
    onBetPlaced: (betValue: number, selectedSymbols: string[]) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const BetArea: React.FC<BetAreaProps> = ({ symbols, onSpin, onBetPlaced }) => {
    const [betValue, setBetValue] = useState<number>(0);
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const toggleSymbolSelection = (symbol: string) => {
        setSelectedSymbols(prev => 
            prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol].slice(0, 10)
        );
    };

    const confirmBet = () => {
        if (betValue > 0 && selectedSymbols.length > 0) {
            onBetPlaced(betValue, selectedSymbols);
            onSpin();
        } else {
            alert('Por favor, selecione entre 1 e 10 símbolos e defina um valor de aposta antes de girar.');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5">Área de Aposta</Typography>
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => setBetValue(betValue - 1 > 0 ? betValue - 1 : 0)}>-</Button>
                <TextField
                    type="number"
                    value={betValue}
                    onChange={(e) => setBetValue(Math.max(0, parseInt(e.target.value)))}
                    InputProps={{ readOnly: true }}
                />
                <Button variant="outlined" onClick={() => setBetValue(betValue + 1)}>+</Button>
            </Stack>
            <Button variant="outlined" onClick={() => setModalOpen(true)}>Escolher Símbolos</Button>
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Selecione os Símbolos
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
                        {symbols.map((symbol) => (
                            <Button
                                key={symbol}
                                variant={selectedSymbols.includes(symbol) ? "contained" : "outlined"}
                                onClick={() => toggleSymbolSelection(symbol)}
                            >
                                {symbol}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Modal>
            <Typography>Símbolos escolhidos: {selectedSymbols.join(', ')}</Typography>
            <Button variant="contained" color="success" onClick={confirmBet} disabled={selectedSymbols.length === 0 || betValue === 0}>
                Confirmar Aposta e Girar
            </Button>
        </Box>
    );
};

export default BetArea;
