import { Player, defaultPlayers } from 'src/app/models/player';
import { CONFIG } from 'src/app/models/config';

export function resetPlayersTimer(
  players: { [key: string]: Player }
): { [key: string]: Player } {
  const newPlayers: { [key: string]: Player } = {};
  Object.values(players).forEach((player) => {
    newPlayers[player.id] = {
      ...player,
      timeRemaining: CONFIG.maxTimeToTalkInSeconds,
      hasAnswer: false,
    };
  });
  return newPlayers;
}

export function parsePlayers(
  rawData: any
): { [key: string]: Player } {
  if (!rawData || typeof rawData !== 'object' || Object.keys(rawData).length === 0) {
    return { ...defaultPlayers };
  }
  return rawData;
}

export function addPlayer(
  players: { [key: string]: Player },
  player: Player
): { [key: string]: Player } {
  return { ...players, [player.id]: player };
}

export function removePlayer(
  players: { [key: string]: Player },
  id: string
): { [key: string]: Player } {
  const { [id]: _, ...rest } = players;
  return rest;
}

export function updatePlayer(
  players: { [key: string]: Player },
  player: Player
): { [key: string]: Player } {
  return { ...players, [player.id]: player };
}

export function getRandomAvailablePlayer(
  players: { [key: string]: Player }
): Player | null {
  const available = Object.values(players).filter(
    (p) => !p.hasAnswer && p.timeRemaining > 0
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

export function getPlayersForNextRound(
  players: { [key: string]: Player }
): { [key: string]: Player } {
  const allAnswered = Object.values(players).every((p) => p.hasAnswer);

  if (!allAnswered) return players;

  return Object.values(players).reduce(
    (acc, player) => ({
      ...acc,
      [player.id]: {
        ...player,
        hasAnswer: !(player.timeRemaining > 0),
      },
    }),
    {} as { [key: string]: Player }
  );
}

export function calcMaxAnswersPerQuestion(totalPlayers: number): number {
  return totalPlayers > 6 ? 6 : totalPlayers;
}