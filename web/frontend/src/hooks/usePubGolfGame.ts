import { useState, useCallback, useMemo } from 'react';
import { PubGolfHole, PubGolfGameState, PubGolfStats } from '../types/pubGolf';

export const usePubGolfGame = (holes: PubGolfHole[]) => {
  const [gameState, setGameState] = useState<PubGolfGameState>({
    isGameMode: false,
    isViewMode: false,
    scores: {},
    currentHoleIndex: 0
  });

  const startGame = useCallback(() => {
    setGameState({
      isGameMode: true,
      isViewMode: false,
      scores: {},
      currentHoleIndex: 0
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      isGameMode: true,
      isViewMode: false,
      scores: {},
      currentHoleIndex: 0
    });
  }, []);

  const endGame = useCallback(() => {
    setGameState({
      isGameMode: false,
      isViewMode: true,
      scores: gameState.scores,
      currentHoleIndex: 0
    });
  }, [gameState.scores]);

  const updateScore = useCallback((holeIndex: number, score: number) => {
    const hole = holes[holeIndex];
    if (!hole) return;

    setGameState(prev => ({
      ...prev,
      scores: {
        ...prev.scores,
        [hole.pubId]: score
      }
    }));
  }, [holes]);

  const getCurrentHole = useCallback(() => {
    return holes[gameState.currentHoleIndex];
  }, [holes, gameState.currentHoleIndex]);

  const getCompletedHoles = useCallback(() => {
    return holes.filter(hole => gameState.scores[hole.pubId] !== undefined);
  }, [holes, gameState.scores]);

  const isGameComplete = useCallback(() => {
    return holes.every(hole => gameState.scores[hole.pubId] !== undefined);
  }, [holes, gameState.scores]);

  const stats = useMemo<PubGolfStats>(() => {
    const totalScore = Object.values(gameState.scores).reduce((sum, score) => sum + score, 0);
    const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
    const scoreDifference = totalScore - totalPar;

    const holesUnderPar = holes.filter(hole => {
      const score = gameState.scores[hole.pubId];
      return score !== undefined && score < hole.par;
    }).length;

    const holesAtPar = holes.filter(hole => {
      const score = gameState.scores[hole.pubId];
      return score !== undefined && score === hole.par;
    }).length;

    const holesOverPar = holes.filter(hole => {
      const score = gameState.scores[hole.pubId];
      return score !== undefined && score > hole.par;
    }).length;

    return {
      totalScore,
      scoreDifference,
      holesUnderPar,
      holesAtPar,
      holesOverPar
    };
  }, [holes, gameState.scores]);

  return {
    gameState,
    stats,
    startGame,
    resetGame,
    endGame,
    updateScore,
    getCurrentHole,
    getCompletedHoles,
    isGameComplete
  };
}; 