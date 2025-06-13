import React from 'react';
import { Box, Typography } from '@mui/material';
import { PubGolfStats } from '../../types/pubGolf';
import styles from './GameHeader.module.scss';

interface GameHeaderProps {
  courseName: string;
  stats: PubGolfStats;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ courseName, stats }) => {
  return (
    <Box className={styles.gameHeader}>
      <Typography variant="h5" gutterBottom>
        {courseName}
      </Typography>
      <Box className={styles.scoreSummary}>
        <Typography variant="h6">
          Total Score: {stats.totalScore}
        </Typography>
        <Typography 
          variant="body1" 
          className={stats.scoreDifference > 0 ? styles.overPar : styles.underPar}
        >
          {stats.scoreDifference > 0 ? `+${stats.scoreDifference}` : stats.scoreDifference} vs Par
        </Typography>
      </Box>
      <Box className={styles.statsBreakdown}>
        <Typography variant="body2" color="text.secondary">
          {stats.holesUnderPar} under par • {stats.holesAtPar} at par • {stats.holesOverPar} over par
        </Typography>
      </Box>
    </Box>
  );
}; 