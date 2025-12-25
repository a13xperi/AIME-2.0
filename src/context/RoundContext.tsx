/**
 * AIME Golf AI - Round Context
 * 
 * Provides global state management for golf round data
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  Round,
  Course,
  Hole,
  Shot,
  Player,
  ClubBag,
  RoundSettings,
  RoundFormat,
} from '../types/round';

interface RoundContextType {
  // State
  currentRound: Round | null;
  currentHole: number;
  clubBag: ClubBag;
  selectedCourse: Course | null;

  // Actions
  startRound: (course: Course, settings: RoundSettings) => void;
  completeHole: (holeNumber: number, score: number, stats: Hole['stats']) => void;
  trackShot: (shot: Shot) => void;
  updateClubBag: (bag: ClubBag) => void;
  finishRound: () => void;
  setCurrentHole: (holeNumber: number) => void;
  selectCourse: (course: Course | null) => void;
}

const RoundContext = createContext<RoundContextType | undefined>(undefined);

interface RoundProviderProps {
  children: ReactNode;
}

export const RoundProvider: React.FC<RoundProviderProps> = ({ children }) => {
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [currentHole, setCurrentHole] = useState<number>(1);
  const [clubBag, setClubBag] = useState<ClubBag>({
    clubs: [
      { id: 'driver', name: 'Driver', type: 'Driver', averageDistance: 250 },
      { id: '3w', name: '3 Wood', type: 'Fairway Wood', averageDistance: 220 },
      { id: '5i', name: '5 Iron', type: 'Iron', averageDistance: 180 },
      { id: '6i', name: '6 Iron', type: 'Iron', averageDistance: 165 },
      { id: '7i', name: '7 Iron', type: 'Iron', averageDistance: 150 },
      { id: '8i', name: '8 Iron', type: 'Iron', averageDistance: 135 },
      { id: '9i', name: '9 Iron', type: 'Iron', averageDistance: 120 },
      { id: 'pw', name: 'Pitching Wedge', type: 'Wedge', averageDistance: 100 },
      { id: 'sw', name: 'Sand Wedge', type: 'Wedge', averageDistance: 80 },
      { id: 'putter', name: 'Putter', type: 'Putter', averageDistance: 0 },
    ],
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const startRound = useCallback((course: Course, settings: RoundSettings) => {
    const roundId = `round-${Date.now()}`;
    
    // Initialize holes array
    const holes: Hole[] = course.holes.map((holeInfo) => ({
      number: holeInfo.number,
      par: holeInfo.par,
      shots: [],
      stats: {
        fairwayHit: false,
        greenInRegulation: false,
        putts: 0,
        penalties: 0,
      },
    }));

    const newRound: Round = {
      id: roundId,
      course,
      settings,
      startTime: new Date().toISOString(),
      holes,
      currentHole: 1,
      statistics: {
        totalScore: 0,
        totalPar: course.totalPar,
        scoreToPar: 0,
        fairwaysHit: 0,
        fairwaysTotal: 0,
        greensInRegulation: 0,
        greensTotal: 0,
        totalPutts: 0,
        totalPenalties: 0,
        birdies: 0,
        pars: 0,
        bogeys: 0,
        doubleBogeysPlus: 0,
      },
    };

    setCurrentRound(newRound);
    setCurrentHole(1);
    setSelectedCourse(course);
  }, []);

  const completeHole = useCallback((holeNumber: number, score: number, stats: Hole['stats']) => {
    if (!currentRound) return;

    setCurrentRound((prevRound) => {
      if (!prevRound) return prevRound;

      const updatedHoles = prevRound.holes.map((hole) =>
        hole.number === holeNumber
          ? { ...hole, score, stats }
          : hole
      );

      // Update player scores
      const updatedSettings = {
        ...prevRound.settings,
        players: prevRound.settings.players.map((player) => {
          const updatedScores = [...player.scores];
          updatedScores[holeNumber - 1] = score;
          return {
            ...player,
            scores: updatedScores,
          };
        }),
      };

      // Recalculate statistics
      const totalScore = updatedHoles.reduce((sum, hole) => sum + (hole.score || 0), 0);
      const scoreToPar = totalScore - prevRound.course.totalPar;

      // Calculate front/back 9 scores
      const frontNine = updatedHoles.filter((h) => h.number <= 9);
      const backNine = updatedHoles.filter((h) => h.number > 9);
      const frontNineScore = frontNine.reduce((sum, hole) => sum + (hole.score || 0), 0);
      const backNineScore = backNine.reduce((sum, hole) => sum + (hole.score || 0), 0);

      // Aggregate stats
      const fairwaysHit = updatedHoles.filter((h) => h.stats.fairwayHit).length;
      const greensInRegulation = updatedHoles.filter((h) => h.stats.greenInRegulation).length;
      const totalPutts = updatedHoles.reduce((sum, hole) => sum + hole.stats.putts, 0);
      const totalPenalties = updatedHoles.reduce((sum, hole) => sum + hole.stats.penalties, 0);

      // Count score types
      let birdies = 0;
      let pars = 0;
      let bogeys = 0;
      let doubleBogeysPlus = 0;

      updatedHoles.forEach((hole) => {
        if (!hole.score) return;
        const diff = hole.score - hole.par;
        if (diff === -1) birdies++;
        else if (diff === 0) pars++;
        else if (diff === 1) bogeys++;
        else if (diff >= 2) doubleBogeysPlus++;
      });

      return {
        ...prevRound,
        holes: updatedHoles,
        settings: updatedSettings,
        currentHole: holeNumber < 18 ? holeNumber + 1 : 18,
        statistics: {
          totalScore,
          totalPar: prevRound.course.totalPar,
          scoreToPar,
          frontNineScore,
          backNineScore,
          fairwaysHit,
          fairwaysTotal: updatedHoles.length,
          greensInRegulation,
          greensTotal: updatedHoles.length,
          totalPutts,
          totalPenalties,
          birdies,
          pars,
          bogeys,
          doubleBogeysPlus,
        },
      };
    });

    // Move to next hole if not last
    if (holeNumber < 18) {
      setCurrentHole(holeNumber + 1);
    }
  }, [currentRound]);

  const trackShot = useCallback((shot: Shot) => {
    if (!currentRound) return;

    setCurrentRound((prevRound) => {
      if (!prevRound) return prevRound;

      const updatedHoles = prevRound.holes.map((hole) => {
        if (hole.number === shot.holeNumber) {
          return {
            ...hole,
            shots: [...hole.shots, shot],
          };
        }
        return hole;
      });

      return {
        ...prevRound,
        holes: updatedHoles,
      };
    });
  }, [currentRound]);

  const updateClubBag = useCallback((bag: ClubBag) => {
    setClubBag(bag);
  }, []);

  const finishRound = useCallback(() => {
    if (!currentRound) return;

    setCurrentRound((prevRound) => {
      if (!prevRound) return prevRound;
      return {
        ...prevRound,
        endTime: new Date().toISOString(),
      };
    });
  }, [currentRound]);

  const selectCourse = useCallback((course: Course | null) => {
    setSelectedCourse(course);
  }, []);

  const value: RoundContextType = {
    currentRound,
    currentHole,
    clubBag,
    selectedCourse,
    startRound,
    completeHole,
    trackShot,
    updateClubBag,
    finishRound,
    setCurrentHole,
    selectCourse,
  };

  return <RoundContext.Provider value={value}>{children}</RoundContext.Provider>;
};

export const useRound = (): RoundContextType => {
  const context = useContext(RoundContext);
  if (context === undefined) {
    throw new Error('useRound must be used within a RoundProvider');
  }
  return context;
};

