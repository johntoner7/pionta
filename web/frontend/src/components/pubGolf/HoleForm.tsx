import React, { useState, useMemo } from 'react';
import { Box, Typography, TextField, Button, Autocomplete } from '@mui/material';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { Bar } from '../../types/bar';
import { PubGolfHole } from '../../types/pubGolf';
import styles from './HoleForm.module.scss';

interface PintsContextType {
  bars: Bar[];
  walkingDistances: { barId: number; distance: number }[];
}

interface HoleFormProps {
  onAddHole: (hole: PubGolfHole) => void;
  context: PintsContextType | undefined;
}

export const HoleForm: React.FC<HoleFormProps> = ({ onAddHole, context }) => {
  const [selectedPub, setSelectedPub] = useState<{ id: string; name: string } | null>(null);
  const [currentHole, setCurrentHole] = useState<Partial<PubGolfHole>>({});

  const sortedBars = useMemo(() => {
    if (!context?.bars || !context?.walkingDistances) return context?.bars || [];
    return [...context.bars].sort((a, b) => {
      const distanceA = context.walkingDistances.find(d => d.barId === a.id)?.distance || Infinity;
      const distanceB = context.walkingDistances.find(d => d.barId === b.id)?.distance || Infinity;
      return distanceA - distanceB;
    });
  }, [context?.bars, context?.walkingDistances]);

  const handleAddHole = () => {
    if (selectedPub && currentHole.drink && currentHole.par) {
      const newHole: PubGolfHole = {
        pubId: selectedPub.id,
        pubName: selectedPub.name,
        drink: currentHole.drink,
        par: currentHole.par,
        rules: currentHole.rules || '',
      };
      onAddHole(newHole);
      setCurrentHole({});
      setSelectedPub(null);
    }
  };

  return (
    <Box className={styles.holeForm}>
      <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
        <LocalBarIcon />
        Add Hole
      </Typography>

      <Autocomplete<Bar, false, false, true>
        options={sortedBars}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          const distance = context?.walkingDistances.find(d => d.barId === option.id)?.distance;
          return distance ? `${option.name} (${distance.toFixed(1)} km)` : option.name;
        }}
        value={selectedPub ? context?.bars.find(bar => bar.id.toString() === selectedPub.id) || null : null}
        onChange={(_, newValue) => {
          if (newValue && typeof newValue !== 'string') {
            setSelectedPub({ id: newValue.id.toString(), name: newValue.name });
          } else {
            setSelectedPub(null);
          }
        }}
        renderInput={(params) => <TextField {...params} label="Select Pub" />}
        className={styles.select}
        freeSolo
        renderOption={(props, option) => {
          if (typeof option === 'string') return null;
          return (
            <li {...props} key={option.id}>
              {option.name}
              {context?.walkingDistances.find(d => d.barId === option.id)?.distance && 
                ` (${context.walkingDistances.find(d => d.barId === option.id)?.distance.toFixed(1)} km)`}
            </li>
          );
        }}
      />

      {selectedPub && (
        <>
          <Autocomplete<string, false, false, true>
            options={context?.bars.find(bar => bar.id.toString() === selectedPub.id)?.pintPrices.map(pint => pint.name) || []}
            getOptionLabel={(option) => option}
            value={currentHole.drink || ''}
            onChange={(_, newValue) => {
              setCurrentHole({ ...currentHole, drink: newValue || '' });
            }}
            onInputChange={(_, newInputValue) => {
              setCurrentHole({ ...currentHole, drink: newInputValue });
            }}
            renderInput={(params) => <TextField {...params} label="Drink" />}
            freeSolo
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
          />

          <TextField
            fullWidth
            label="Par"
            type="number"
            value={currentHole.par || ''}
            onChange={(e) => setCurrentHole({ ...currentHole, par: parseInt(e.target.value) })}
          />

          <TextField
            fullWidth
            label="Special Rules (Optional)"
            value={currentHole.rules || ''}
            onChange={(e) => setCurrentHole({ ...currentHole, rules: e.target.value })}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddHole}
            className={styles.addButton}
            fullWidth
          >
            Add Hole
          </Button>
        </>
      )}
    </Box>
  );
}; 