import { Injectable, OnInit } from '@angular/core';
import { defaultPlayers, Player } from 'src/app/models/player';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {
  resetPlayersTimer as resetPlayersTimerUtil,
  parsePlayers,
  addPlayer,
  removePlayer as removePlayerUtil,
  updatePlayer as updatePlayerUtil,
} from 'src/app/utils/player.utils';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  players: { [key: string]: Player } = defaultPlayers;

  constructor(private localStorageService: LocalStorageService) {
    this.loadPlayers();
  }

  addUser(user: Player) {
    this.players = addPlayer(this.players, user);
  }

  deleteUser(id: string) {
    this.players = removePlayerUtil(this.players, id);
  }

  updateUser(user: Player) {
    this.players = updatePlayerUtil(this.players, user);
  }

  loadPlayers() {
    const localPlayers = this.localStorageService.get('players');
    this.players = parsePlayers(localPlayers);
  }

  savePlayers() {
    this.localStorageService.set('players', this.players);
  }

  resetPlayersTimer() {
    this.players = resetPlayersTimerUtil(this.players);
    this.savePlayers();
  }
}