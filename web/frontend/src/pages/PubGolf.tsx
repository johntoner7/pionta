import React, { useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, IconButton, Dialog, Autocomplete, Snackbar, Collapse, Slide } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import MapComponent from '../components/map/Map';
import styles from './PubGolf.module.scss';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Bar } from '../../../../shared/types/bar';
import { useNavigate } from 'react-router-dom';
import { CompactMap } from '../components/CompactMap';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FlagIcon from '@mui/icons-material/Flag';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { PubGolfHole, PubGolfCourse } from '../types/pubGolf';
import { usePubGolfGame } from '../hooks/usePubGolfGame';
import { GameHeader } from '../components/pubGolf/GameHeader';
import { CourseHeader } from '../components/pubGolf/CourseHeader';
import { HoleForm } from '../components/pubGolf/HoleForm';
import { CourseHolesList } from '../components/pubGolf/CourseHolesList';
import { usePintsContext } from '../PintsContext';


interface CourseHeaderProps {
  courseName: string;
  onCourseNameChange: (name: string) => void;
}



interface WalkingDistance {
  barId: number;
  distance: number;
}

interface PintPrice {
  name: string;
  price: number;
}

interface PintsContextType {
  bars: Bar[];
  walkingDistances: WalkingDistance[];
}



interface HoleCardContentProps {
  hole: PubGolfHole;
  getParColorClass: (par: number) => string;
}

const HoleCardContent = React.memo<HoleCardContentProps>(({ hole, getParColorClass }) => (
  <Box className={styles.holeCardContent}>
    <Typography className={styles.pubName}>
      <LocationOnIcon />
      {hole.pubName}
    </Typography>
    
    <Box className={styles.drinkInfo}>
      <LocalBarIcon />
      <Typography variant="body2">{hole.drink}</Typography>
    </Box>

    <Box sx={{ mt: 1 }}>
      <Typography 
        component="span" 
        className={`${styles.parValue} ${getParColorClass(hole.par)}`}
      >
        <FlagIcon />
        Par {hole.par}
      </Typography>
    </Box>

    {hole.rules && (
      <Box className={styles.rules}>
        <InfoIcon />
        <Typography variant="body2">
          {hole.rules}
        </Typography>
      </Box>
    )}
  </Box>
));

interface HoleCardProps {
  hole: PubGolfHole;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  isGameMode?: boolean;
  score?: number;
  onScoreChange?: (index: number, score: number) => void;
}

const HoleCard = React.memo<HoleCardProps>(({ 
  hole, 
  index, 
  onEdit, 
  onDelete, 
  isGameMode = false,
  score,
  onScoreChange 
}) => {
  const [expanded, setExpanded] = useState(false);

  const getParColorClass = useCallback((par: number) => {
    if (par <= 3) return styles.par3;
    if (par <= 4) return styles.par4;
    return styles.par5;
  }, []);

  const handleExpandClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    setExpanded(prev => !prev);
  }, []);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(index);
  }, [onEdit, index]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(index);
  }, [onDelete, index]);

  const handleScoreChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value) || 0;
    onScoreChange?.(index, newScore);
  }, [index, onScoreChange]);

  return (
    <Paper className={styles.holeCard}>
      <Box 
        className={styles.holeCardHeader}
        onClick={handleExpandClick}
      >
        {isGameMode ? (
          <Box className={styles.gameModeHeader}>
            <Box className={styles.holeNumberCircle}>
              {index + 1}
            </Box>
            <TextField
              type="number"
              value={score || ''}
              onChange={handleScoreChange}
              className={styles.scoreInput}
              inputProps={{
                min: 0,
                className: styles.scoreInputField
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>
        ) : (
          <Box className={styles.holeHeaderContent}>
            <Box className={styles.holeNumberCircle}>
              {index + 1}
            </Box>
            <Typography className={styles.holeTitle}>
              {hole.pubName} - {hole.drink}
            </Typography>
          </Box>
        )}
        <IconButton 
          size="small"
          onClick={handleExpandClick}
          sx={{ 
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout={300}>
        <Box className={styles.holeCardContent}>
          <Typography className={styles.pubName}>
            <LocationOnIcon />
            {hole.pubName}
          </Typography>
          
          <Box className={styles.drinkInfo}>
            <LocalBarIcon />
            <Typography variant="body2">{hole.drink}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography 
              component="span" 
              className={`${styles.parValue} ${getParColorClass(hole.par)}`}
            >
              <FlagIcon />
              Par {hole.par}
            </Typography>
          </Box>

          {hole.rules && (
            <Box className={styles.rules}>
              <InfoIcon />
              <Typography variant="body2">
                {hole.rules}
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>

      {!isGameMode && (
        <Box className={styles.holeCardActions}>
          <IconButton 
            className={styles.actionButton}
            onClick={handleEdit}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            className={styles.actionButton}
            onClick={handleDelete}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
});

interface CompletedHoleItemProps {
  hole: PubGolfHole;
  index: number;
  score: number;
}

const CompletedHoleItem: React.FC<CompletedHoleItemProps> = ({ hole, index, score }) => (
  <Box className={styles.completedHoleItem}>
    <Box className={styles.completedHoleNumber}>
      {index + 1}
    </Box>
    <Box className={styles.completedHoleInfo}>
      <Typography variant="body1" className={styles.completedHoleName}>
        {hole.pubName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {hole.drink}
      </Typography>
    </Box>
    <Typography 
      variant="h6" 
      className={`${styles.completedHoleScore} ${score > hole.par ? styles.overPar : styles.underPar}`}
    >
      {score}
    </Typography>
  </Box>
);

interface CurrentHoleCardProps {
  hole: PubGolfHole;
  index: number;
  score: number;
  onScoreChange: (score: number) => void;
}

const CurrentHoleCard: React.FC<CurrentHoleCardProps> = ({ hole, index, score, onScoreChange }) => {
  const getParColorClass = useCallback((par: number) => {
    if (par <= 3) return styles.par3;
    if (par <= 4) return styles.par4;
    return styles.par5;
  }, []);

  return (
    <Paper className={styles.currentHoleCard}>
      <Box className={styles.currentHoleHeader}>
        <Box className={styles.currentHoleNumber}>
          Hole {index + 1}
        </Box>
        <Typography 
          component="span" 
          className={`${styles.parValue} ${getParColorClass(hole.par)}`}
        >
          <FlagIcon />
          Par {hole.par}
        </Typography>
      </Box>

      <Box className={styles.currentHoleContent}>
        <Typography className={styles.pubName}>
          <LocationOnIcon />
          {hole.pubName}
        </Typography>
        
        <Box className={styles.drinkInfo}>
          <LocalBarIcon />
          <Typography variant="body2">{hole.drink}</Typography>
        </Box>

        {hole.rules && (
          <Box className={styles.rules}>
            <InfoIcon />
            <Typography variant="body2">
              {hole.rules}
            </Typography>
          </Box>
        )}

        <Box className={styles.scoreInputContainer}>
          <Typography variant="h6" className={styles.scoreLabel}>
            Enter Your Score
          </Typography>
          <TextField
            type="number"
            value={score || ''}
            onChange={(e) => onScoreChange(parseInt(e.target.value) || 0)}
            className={styles.scoreInput}
            inputProps={{
              min: 0,
              className: styles.scoreInputField
            }}
            autoFocus
          />
        </Box>
      </Box>
    </Paper>
  );
};

interface GameCompleteViewProps {
  holes: PubGolfHole[];
  scores: number[];
  onNewGame: () => void;
  onResetGame: () => void;
}

const GameCompleteView: React.FC<GameCompleteViewProps> = ({ 
  holes, 
  scores, 
  onNewGame,
  onResetGame 
}) => {
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
  const scoreDifference = totalScore - totalPar;

  return (
    <Paper className={styles.gameCompleteCard}>
      <Box className={styles.gameCompleteHeader}>
        <Typography variant="h4" className={styles.gameCompleteTitle}>
          Game Complete!
        </Typography>
        <Typography variant="h5" className={styles.finalScore}>
          Final Score: {totalScore}
        </Typography>
        <Typography 
          variant="h6" 
          className={`${styles.scoreDifference} ${scoreDifference > 0 ? styles.overPar : styles.underPar}`}
        >
          {scoreDifference > 0 ? `+${scoreDifference}` : scoreDifference} vs Par
        </Typography>
      </Box>

      <Box className={styles.scoreBreakdown}>
        <Typography variant="h6" className={styles.breakdownTitle}>
          Hole by Hole
        </Typography>
        {holes.map((hole, index) => (
          <Box key={index} className={styles.holeBreakdown}>
            <Box className={styles.holeBreakdownInfo}>
              <Typography variant="body1" className={styles.holeBreakdownName}>
                Hole {index + 1}: {hole.pubName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hole.drink} (Par {hole.par})
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              className={`${styles.holeBreakdownScore} ${scores[index] > hole.par ? styles.overPar : styles.underPar}`}
            >
              {scores[index]}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box className={styles.gameCompleteActions}>
        <Button
          variant="contained"
          color="primary"
          onClick={onResetGame}
          startIcon={<GolfCourseIcon />}
        >
          Play Again
        </Button>
        <Button
          variant="outlined"
          onClick={onNewGame}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Back to Courses
        </Button>
      </Box>
    </Paper>
  );
};

interface MapDialogProps {
  open: boolean;
  onClose: () => void;
  onPubSelect: (pub: { id: string; name: string }) => void;
}

const MapDialog: React.FC<MapDialogProps> = ({ open, onClose, onPubSelect }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="lg"
    fullWidth
  >
    <Box sx={{ height: '80vh' }}>
      <MapComponent onPubSelect={(pub) => {
        onPubSelect(pub);
        onClose();
      }} />
    </Box>
  </Dialog>
);

// Helper to get scores as an array in hole order
function getScoresArray(holes: PubGolfHole[], scoresObj: { [key: string]: number }): number[] {
  return holes.map(hole => scoresObj[hole.pubId] ?? 0);
}

export const PubGolf: React.FC = () => {
  const context = usePintsContext();
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('');
  const [holes, setHoles] = useState<PubGolfHole[]>([]);
  const [showShareSnackbar, setShowShareSnackbar] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const {
    gameState,
    stats,
    startGame,
    resetGame,
    endGame,
    updateScore,
    getCurrentHole,
    getCompletedHoles,
    isGameComplete
  } = usePubGolfGame(holes);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseData = params.get('course');
    if (courseData) {
      try {
        const decoded = JSON.parse(atob(courseData)) as PubGolfCourse;
        setCourseName(decoded.name);
        setHoles(decoded.holes);
      } catch (e) {
        console.error('Failed to load course from URL:', e);
      }
    }
  }, []);

  const handleAddHole = (hole: PubGolfHole) => {
    setHoles(prevHoles => [...prevHoles, hole]);
  };

  const handleRemoveHole = (index: number) => {
    setHoles(prevHoles => prevHoles.filter((_, i) => i !== index));
  };

  const handleSaveCourse = () => {
    setShowShareDialog(true);
  };

  const handleShareCourse = () => {
    const courseData: PubGolfCourse = {
      name: courseName,
      holes: holes
    };
    const encoded = btoa(JSON.stringify(courseData));
    const shareUrl = `${window.location.origin}${window.location.pathname}?course=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    setShowShareSnackbar(true);
    setShowShareDialog(false);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>
        {gameState.isGameMode ? 'Playing Pub Golf' : gameState.isViewMode ? 'Pub Golf Course' : 'Create Pub Golf Course'}
      </Typography>
      
      {!gameState.isViewMode && !gameState.isGameMode && (
        <CourseHeader
          courseName={courseName}
          onCourseNameChange={setCourseName}
        />
      )}

      {context.bars && (
        <Box className={styles.mapContainer}>
          <CompactMap
            selectedPub={null}
            onPubSelect={() => {}}
            courseHoles={holes.map(hole => ({
              pubId: hole.pubId,
              pubName: hole.pubName
            }))}
            allBars={context.bars}
          />
        </Box>
      )}

      <Paper className={styles.formContainer}>
        {gameState.isGameMode ? (
          <>
            <GameHeader
              courseName={courseName}
              stats={stats}
            />
            <CourseHolesList 
              holes={holes}
              onRemoveHole={handleRemoveHole}
              isGameMode={true}
              scores={gameState.scores}
              onScoreChange={updateScore}
              onResetGame={resetGame}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={endGame}
              sx={{ mt: 2 }}
            >
              End Game
            </Button>
          </>
        ) : gameState.isViewMode ? (
          <>
            <Typography variant="h5" gutterBottom>
              {courseName}
            </Typography>
            <CourseHolesList 
              holes={holes} 
              onRemoveHole={handleRemoveHole} 
            />
            <Box className={styles.viewModeActions}>
              <Button
                variant="contained"
                color="primary"
                onClick={startGame}
                sx={{ mt: 2 }}
              >
                Start Game
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/pub-golf')}
                sx={{ mt: 2, ml: 2 }}
              >
                Create Your Own Course
              </Button>
            </Box>
          </>
        ) : (
          <>
            <HoleForm
              onAddHole={handleAddHole}
              context={context}
            />
            
            <CourseHolesList
              holes={holes}
              onRemoveHole={handleRemoveHole}
            />
          </>
        )}

        <Snackbar
          open={showShareSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowShareSnackbar(false)}
          message="Course link copied to clipboard!"
        />
      </Paper>

      {!gameState.isViewMode && !gameState.isGameMode && (
        <Box className={styles.actionButtons}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveCourse}
            disabled={!courseName || holes.length === 0}
            className={styles.saveButton}
          >
            Save Course
          </Button>
        </Box>
      )}

      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Share Your Course</DialogTitle>
        <DialogContent>
          <Typography>
            Your course has been saved! Would you like to share it with friends?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowShareDialog(false)}>Close</Button>
          <Button onClick={handleShareCourse} variant="contained" color="primary">
            Share Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 