import { CONFIG } from 'src/app/models/config';

export interface Player {
  id: string;
  name: string;
  timeRemaining: number;
  color: string;
  hasAnswer: boolean;
}

export const playerTemplate: Player = {
  id: '',
  name: '',
  timeRemaining: CONFIG.maxTimeToTalkInSeconds,
  color: '#fff',
  hasAnswer: false,
};

export const defaultPlayers: { [key: string]: Player } = {
  ['player1']: {
    id: 'player1',
    name: 'Maria',
    color: '#3f297e',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player2']: {
    id: 'player2',
    name: 'Juan',
    color: '#1d61ac',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player3']: {
    id: 'player3',
    name: 'Carlos',
    color: '#169ed8',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player4']: {
    id: 'player4',
    name: 'Ana',
    color: '#209b6c',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player5']: {
    id: 'player5',
    name: 'Diego',
    color: '#60b236',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player6']: {
    id: 'player6',
    name: 'Pedro',
    color: '#c6bf27',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player7']: {
    id: 'player7',
    name: 'Diego',
    color: '#f7a416',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player8']: {
    id: 'player8',
    name: 'Luis',
    color: '#e6471d',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player9']: {
    id: 'player9',
    name: 'Sofia',
    color: '#dc0936',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player10']: {
    id: 'player10',
    name: 'Fernando',
    color: '#e5177b',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player11']: {
    id: 'player11',
    name: 'Daniel',
    color: '#be107f',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
  ['player12']: {
    id: 'player12',
    name: 'Isabel',
    color: '#0bb736',
    timeRemaining: CONFIG.maxTimeToTalkInSeconds,
    hasAnswer: false,
  },
};
