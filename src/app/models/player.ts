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
