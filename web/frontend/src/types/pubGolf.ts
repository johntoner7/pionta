export interface PubGolfHole {
  pubId: string;
  pubName: string;
  drink: string;
  par: number;
  rules?: string;
}

export interface PubGolfCourse {
  name: string;
  holes: PubGolfHole[];
}

export interface PubGolfScore {
  holeIndex: number;
  score: number;
}

export interface PubGolfGameState {
  isGameMode: boolean;
  isViewMode: boolean;
  scores: { [key: string]: number };
  currentHoleIndex: number;
}

export interface PubGolfStats {
  totalScore: number;
  scoreDifference: number;
  holesUnderPar: number;
  holesAtPar: number;
  holesOverPar: number;
} 