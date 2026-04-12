import { Player, defaultPlayers } from 'src/app/models/player';
import { CONFIG } from 'src/app/models/config';
import {
  resetPlayersTimer,
  parsePlayers,
  addPlayer,
  removePlayer,
  updatePlayer,
  getRandomAvailablePlayer,
  getPlayersForNextRound,
  calcMaxAnswersPerQuestion,
} from './player.utils';

describe('player.utils', () => {
  const mockPlayer: Player = {
    id: 'test1',
    name: 'Test',
    timeRemaining: 300,
    color: '#fff',
    hasAnswer: true,
    avatar: '/assets/faces/1_0_0.png',
  };

  const mockPlayer2: Player = {
    id: 'test2',
    name: 'Test2',
    timeRemaining: 600,
    color: '#000',
    hasAnswer: false,
    avatar: '/assets/faces/1_0_1.png',
  };

  describe('resetPlayersTimer', () => {
    it('should reset timeRemaining and hasAnswer for all players', () => {
      const players: { [key: string]: Player } = { test1: { ...mockPlayer } };
      const result = resetPlayersTimer(players);

      expect(result['test1'].timeRemaining).toBe(CONFIG.maxTimeToTalkInSeconds);
      expect(result['test1'].hasAnswer).toBe(false);
    });

    it('should not mutate the original players object', () => {
      const players: { [key: string]: Player } = { test1: { ...mockPlayer } };
      resetPlayersTimer(players);
      expect(players['test1'].timeRemaining).toBe(300);
      expect(players['test1'].hasAnswer).toBe(true);
    });

    it('should handle empty players object', () => {
      const result = resetPlayersTimer({});
      expect(Object.keys(result).length).toBe(0);
    });
  });

  describe('parsePlayers', () => {
    it('should return default players when input is null', () => {
      const result = parsePlayers(null);
      expect(result).toEqual(defaultPlayers);
    });

    it('should return default players when input is undefined', () => {
      const result = parsePlayers(undefined);
      expect(result).toEqual(defaultPlayers);
    });

    it('should return default players when input is empty object', () => {
      const result = parsePlayers({});
      expect(result).toEqual(defaultPlayers);
    });

    it('should return input when valid players object', () => {
      const players: { [key: string]: Player } = { test1: mockPlayer };
      const result = parsePlayers(players);
      expect(result).toEqual(players);
    });

    it('should return default players when input is a string', () => {
      const result = parsePlayers('not an object');
      expect(result).toEqual(defaultPlayers);
    });
  });

  describe('addPlayer', () => {
    it('should add a player to the dictionary', () => {
      const players: { [key: string]: Player } = { test1: { ...mockPlayer } };
      const result = addPlayer(players, mockPlayer2);

      expect(result['test2']).toEqual(mockPlayer2);
      expect(result['test1']).toEqual(mockPlayer);
    });

    it('should not mutate the original dictionary', () => {
      const players: { [key: string]: Player } = { test1: { ...mockPlayer } };
      addPlayer(players, mockPlayer2);
      expect(Object.keys(players).length).toBe(1);
    });
  });

  describe('removePlayer', () => {
    it('should remove a player by id', () => {
      const players: { [key: string]: Player } = { test1: mockPlayer, test2: mockPlayer2 };
      const result = removePlayer(players, 'test1');

      expect(result['test1']).toBeUndefined();
      expect(result['test2']).toEqual(mockPlayer2);
    });

    it('should not mutate the original dictionary', () => {
      const players: { [key: string]: Player } = { test1: mockPlayer };
      removePlayer(players, 'test1');
      expect(players['test1']).toBeDefined();
    });

    it('should return same dictionary when id does not exist', () => {
      const players: { [key: string]: Player } = { test1: mockPlayer };
      const result = removePlayer(players, 'nonexistent');
      expect(result).toEqual(players);
    });
  });

  describe('updatePlayer', () => {
    it('should update an existing player', () => {
      const players: { [key: string]: Player } = { test1: { ...mockPlayer } };
      const updated = { ...mockPlayer, name: 'Updated' };
      const result = updatePlayer(players, updated);

      expect(result['test1'].name).toBe('Updated');
    });

    it('should not mutate the original dictionary', () => {
      const players: { [key: string]: Player } = { test1: { ...mockPlayer } };
      updatePlayer(players, { ...mockPlayer, name: 'Updated' });
      expect(players['test1'].name).toBe('Test');
    });
  });

  describe('getRandomAvailablePlayer', () => {
    it('should return a player when available players exist', () => {
      const available: Player = {
        id: 'avail',
        name: 'Available',
        timeRemaining: 600,
        color: '#fff',
        hasAnswer: false,
        avatar: '/assets/faces/1_0_0.png',
      };
      const answered: Player = {
        id: 'answered',
        name: 'Answered',
        timeRemaining: 0,
        color: '#000',
        hasAnswer: true,
        avatar: '/assets/faces/1_0_1.png',
      };
      const players: { [key: string]: Player } = { avail: available, answered: answered };
      const result = getRandomAvailablePlayer(players);

      expect(result).toEqual(available);
    });

    it('should return null when all players have answered', () => {
      const players: { [key: string]: Player } = {
        test1: { ...mockPlayer, hasAnswer: true, timeRemaining: 600 },
      };
      const result = getRandomAvailablePlayer(players);
      expect(result).toBeNull();
    });

    it('should return null when all players have no time remaining', () => {
      const players: { [key: string]: Player } = {
        test1: { ...mockPlayer, hasAnswer: false, timeRemaining: 0 },
      };
      const result = getRandomAvailablePlayer(players);
      expect(result).toBeNull();
    });

    it('should return null when no players exist', () => {
      const result = getRandomAvailablePlayer({});
      expect(result).toBeNull();
    });
  });

  describe('getPlayersForNextRound', () => {
    it('should return same players when not all have answered', () => {
      const players: { [key: string]: Player } = {
        test1: { ...mockPlayer, hasAnswer: true },
        test2: { ...mockPlayer2, hasAnswer: false },
      };
      const result = getPlayersForNextRound(players);
      expect(result).toEqual(players);
    });

    it('should reset hasAnswer when all players have answered', () => {
      const players: { [key: string]: Player } = {
        test1: { ...mockPlayer, hasAnswer: true, timeRemaining: 0 },
        test2: { ...mockPlayer2, hasAnswer: true, timeRemaining: 300 },
      };
      const result = getPlayersForNextRound(players);

      expect(result['test1'].hasAnswer).toBe(true);
      expect(result['test2'].hasAnswer).toBe(false);
    });
  });

  describe('calcMaxAnswersPerQuestion', () => {
    it('should return total players when <= 6', () => {
      expect(calcMaxAnswersPerQuestion(4)).toBe(4);
      expect(calcMaxAnswersPerQuestion(6)).toBe(6);
    });

    it('should cap at 6 when total players > 6', () => {
      expect(calcMaxAnswersPerQuestion(7)).toBe(6);
      expect(calcMaxAnswersPerQuestion(12)).toBe(6);
    });

    it('should handle 0 players', () => {
      expect(calcMaxAnswersPerQuestion(0)).toBe(0);
    });
  });
});