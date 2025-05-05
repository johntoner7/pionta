import React, { useState, useContext, useMemo } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, IconButton, Dialog, Autocomplete, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MapComponent from '../components/map/Map';
import styles from './PubGolf.module.scss';
import { PintsContext } from '../PintsContext';

interface PubGolfHole {
  pubId: string;
  pubName: string;
  drink: string;
  par: number;
  rules: string;
}

export const PubGolf: React.FC = () => {
  const context = useContext(PintsContext);
  const [courseName, setCourseName] = useState('');
  const [holes, setHoles] = useState<PubGolfHole[]>([]);
  const [selectedPub, setSelectedPub] = useState<{ id: string; name: string } | null>(null);
  const [currentHole, setCurrentHole] = useState<Partial<PubGolfHole>>({});
  const [mapOpen, setMapOpen] = useState(false);
  const [customDrink, setCustomDrink] = useState(false);

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
      setHoles([...holes, newHole]);
      setCurrentHole({});
      setSelectedPub(null);
      setCustomDrink(false);
    }
  };

  const handleRemoveHole = (index: number) => {
    setHoles(holes.filter((_, i) => i !== index));
  };

  const handleSaveCourse = () => {
    // TODO: Implement saving to backend
    console.log('Saving course:', { courseName, holes });
  };

  const getUniqueDrinks = () => {
    const drinks = new Set<string>();
    context?.bars.forEach(bar => {
      bar.pintPrices.forEach(pint => {
        drinks.add(pint.name);
      });
    });
    return Array.from(drinks).sort();
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>
        Create Pub Golf Course
      </Typography>
      
      <Paper className={styles.formContainer}>
        <TextField
          fullWidth
          label="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          margin="normal"
        />

        <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
          Add Hole
        </Typography>

        <Box className={styles.holeForm}>
          <Autocomplete
            options={sortedBars}
            getOptionLabel={(option) => {
              const distance = context?.walkingDistances.find(d => d.barId === option.id)?.distance;
              return distance ? `${option.name} (${distance.toFixed(1)} km)` : option.name;
            }}
            value={selectedPub ? context?.bars.find(bar => bar.id.toString() === selectedPub.id) || null : null}
            onChange={(_, newValue) => {
              if (newValue) {
                setSelectedPub({ id: newValue.id.toString(), name: newValue.name });
              } else {
                setSelectedPub(null);
              }
            }}
            renderInput={(params) => <TextField {...params} label="Select Pub" />}
            className={styles.select}
          />

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setMapOpen(true)}
            className={styles.mapButton}
          >
            Open Map to Select Pub
          </Button>

          {selectedPub && (
            <>
              <TextField
                select
                fullWidth
                label="Drink"
                value={customDrink ? 'custom' : currentHole.drink || ''}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setCustomDrink(true);
                    setCurrentHole({ ...currentHole, drink: '' });
                  } else {
                    setCustomDrink(false);
                    setCurrentHole({ ...currentHole, drink: e.target.value });
                  }
                }}
                margin="normal"
              >
                {getUniqueDrinks().map((drink) => (
                  <MenuItem key={drink} value={drink}>
                    {drink}
                  </MenuItem>
                ))}
                <MenuItem value="custom">Enter Custom Drink</MenuItem>
              </TextField>

              {customDrink && (
                <TextField
                  fullWidth
                  label="Custom Drink"
                  value={currentHole.drink || ''}
                  onChange={(e) => setCurrentHole({ ...currentHole, drink: e.target.value })}
                  margin="normal"
                />
              )}

              <TextField
                fullWidth
                label="Par"
                type="number"
                value={currentHole.par || ''}
                onChange={(e) => setCurrentHole({ ...currentHole, par: parseInt(e.target.value) })}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Special Rules (Optional)"
                value={currentHole.rules || ''}
                onChange={(e) => setCurrentHole({ ...currentHole, rules: e.target.value })}
                margin="normal"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleAddHole}
                className={styles.addButton}
              >
                Add Hole
              </Button>
            </>
          )}
        </Box>

        <Dialog
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <Box sx={{ height: '80vh' }}>
            <MapComponent onPubSelect={(pub) => {
              setSelectedPub(pub);
              setMapOpen(false);
            }} />
          </Box>
        </Dialog>

        <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
          Course Holes
        </Typography>
        
        <List>
          {holes.map((hole, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveHole(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`Hole ${index + 1}: ${hole.pubName}`}
                secondary={`Drink: ${hole.drink} | Par: ${hole.par}${hole.rules ? ` | Rules: ${hole.rules}` : ''}`}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveCourse}
          disabled={!courseName || holes.length === 0}
          className={styles.saveButton}
        >
          Save Course
        </Button>
      </Paper>
    </Box>
  );
}; 