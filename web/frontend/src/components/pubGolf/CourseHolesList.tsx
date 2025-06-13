import React from 'react';
import { Box, Typography, IconButton, Paper, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import { PubGolfHole } from '../../types/pubGolf';
import styles from './CourseHolesList.module.scss';

interface CourseHolesListProps {
  holes: PubGolfHole[];
  onRemoveHole: (index: number) => void;
  isGameMode?: boolean;
  scores?: { [key: string]: number };
  onScoreChange?: (holeIndex: number, score: number) => void;
  onResetGame?: () => void;
}

export const CourseHolesList: React.FC<CourseHolesListProps> = ({
  holes,
  onRemoveHole,
  isGameMode = false,
  scores = {},
  onScoreChange,
  onResetGame
}) => {
  const calculateTotalScore = () => {
    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  };

  const calculateTotalPar = () => {
    return holes.reduce((sum, hole) => sum + hole.par, 0);
  };

  return (
    <Box className={styles.holesList}>
      <Typography variant="h6" gutterBottom className={styles.sectionTitle}>
        <LocalBarIcon />
        {isGameMode ? 'Scorecard' : 'Course Holes'}
      </Typography>

      {holes.map((hole, index) => (
        <Paper key={index} className={styles.holeCard}>
          <Box className={styles.holeHeader}>
            <Typography variant="h6" className={styles.holeNumber}>
              Hole {index + 1}
            </Typography>
            {!isGameMode && (
              <IconButton
                onClick={() => onRemoveHole(index)}
                className={styles.deleteButton}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Box className={styles.holeDetails}>
            <Typography variant="subtitle1" className={styles.pubName}>
              {hole.pubName}
            </Typography>
            <Typography variant="body2" className={styles.drink}>
              {hole.drink}
            </Typography>
            <Typography variant="body2" className={styles.par}>
              Par {hole.par}
            </Typography>
            {hole.rules && (
              <Typography variant="body2" className={styles.rules}>
                {hole.rules}
              </Typography>
            )}
          </Box>

          {isGameMode && (
            <Box className={styles.scoreInput}>
              <TextField
                type="number"
                label="Score"
                value={scores[hole.pubId] || ''}
                onChange={(e) => onScoreChange?.(index, parseInt(e.target.value) || 0)}
                inputProps={{ min: 1 }}
                size="small"
                fullWidth
              />
            </Box>
          )}
        </Paper>
      ))}

      {isGameMode && holes.length > 0 && (
        <Box className={styles.scoreSummary}>
          <Typography variant="h6">
            Total Score: {calculateTotalScore()}
          </Typography>
          <Typography variant="body1">
            Total Par: {calculateTotalPar()}
          </Typography>
          <Typography
            variant="body1"
            className={calculateTotalScore() > calculateTotalPar() ? styles.overPar : styles.underPar}
          >
            {calculateTotalScore() > calculateTotalPar()
              ? `+${calculateTotalScore() - calculateTotalPar()} over par`
              : `${calculateTotalPar() - calculateTotalScore()} under par`}
          </Typography>
          {onResetGame && (
            <IconButton
              onClick={onResetGame}
              className={styles.resetButton}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
}; 