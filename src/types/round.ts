/**
 * AIME Golf AI - Round Data Types
 * 
 * TypeScript interfaces for round, hole, shot, player, course, and club bag data
 */

export interface Course {
  id: string;
  name: string;
  location: string;
  holes: HoleInfo[];
  totalPar: number;
  totalYards?: number;
}

export interface HoleInfo {
  number: number;
  par: number;
  yards: number;
  handicap?: number;
}

export interface Player {
  id: string;
  name: string;
  scores: number[]; // Score per hole (index = hole number - 1)
  stats: PlayerStats;
}

export interface PlayerStats {
  fairwaysHit: number;
  greensInRegulation: number;
  totalPutts: number;
  penalties: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeysPlus: number;
}

export interface Shot {
  id: string;
  holeNumber: number;
  shotNumber: number; // 1st shot, 2nd shot, etc.
  club: string;
  distance: number; // yards
  condition: ShotCondition;
  result: ShotResult;
  gps?: {
    lat: number;
    lon: number;
  };
  timestamp: string;
  carry?: number; // yards
  total?: number; // yards
  remaining?: number; // yards to target
}

export type ShotCondition = 'Tee' | 'Fairway' | 'Rough' | 'Bunker' | 'Penalty' | 'Green';
export type ShotResult = 'Good' | 'Fair' | 'Poor' | 'Out of Bounds' | 'Water' | 'Hazard';

export interface Hole {
  number: number;
  par: number;
  score?: number;
  shots: Shot[];
  stats: HoleStats;
}

export interface HoleStats {
  fairwayHit: boolean;
  greenInRegulation: boolean;
  putts: number;
  penalties: number;
}

export interface ClubBag {
  clubs: Club[];
}

export interface Club {
  id: string;
  name: string;
  type: ClubType;
  averageDistance: number; // yards
  minDistance?: number;
  maxDistance?: number;
}

export type ClubType = 
  | 'Driver'
  | 'Fairway Wood'
  | 'Hybrid'
  | 'Iron'
  | 'Wedge'
  | 'Putter';

export interface RoundSettings {
  players: Player[];
  format: RoundFormat;
  gpsEnabled: boolean;
  puckEnabled: boolean;
  autoTrackShots?: boolean;
}

export type RoundFormat = 'Stroke Play' | 'Match Play' | 'Scramble' | 'Best Ball';

export interface Round {
  id: string;
  course: Course;
  settings: RoundSettings;
  startTime: string;
  endTime?: string;
  holes: Hole[];
  currentHole: number;
  statistics: RoundStatistics;
}

export interface RoundStatistics {
  totalScore: number;
  totalPar: number;
  scoreToPar: number; // e.g., +3, -2, E
  frontNineScore?: number;
  backNineScore?: number;
  fairwaysHit: number;
  fairwaysTotal: number;
  greensInRegulation: number;
  greensTotal: number;
  totalPutts: number;
  totalPenalties: number;
  birdies: number;
  pars: number;
  bogeys: number;
  doubleBogeysPlus: number;
}

