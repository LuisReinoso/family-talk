import { Injectable } from '@angular/core';
import { defaultPlayers, Player } from 'src/app/models/player';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import {
  resetPlayersTimer as resetPlayersTimerUtil,
  parsePlayers,
  addPlayer as addPlayerUtil,
  removePlayer as removePlayerUtil,
  updatePlayer as updatePlayerUtil,
} from 'src/app/utils/player.utils';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private playersSubject = new BehaviorSubject<{ [key: string]: Player }>(defaultPlayers);
  players$ = this.playersSubject.asObservable();

  private localStorageKey = 'players';

  constructor(private localStorageService: LocalStorageService) {
    this.loadPlayers();
  }

  get players(): { [key: string]: Player } {
    return this.playersSubject.getValue();
  }

  set players(value: { [key: string]: Player }) {
    this.playersSubject.next(value);
  }

  addUser(user: Player) {
    const updated = addPlayerUtil(this.players, user);
    this.playersSubject.next(updated);
    this.savePlayers();
  }

  deleteUser(id: string) {
    const updated = removePlayerUtil(this.players, id);
    this.playersSubject.next(updated);
    this.savePlayers();
  }

  updateUser(user: Player) {
    const updated = updatePlayerUtil(this.players, user);
    this.playersSubject.next(updated);
    this.savePlayers();
  }

  loadPlayers() {
    const localPlayers = this.localStorageService.get(this.localStorageKey);
    const parsed = parsePlayers(localPlayers);
    this.playersSubject.next(parsed);
  }

  savePlayers() {
    this.localStorageService.set(this.localStorageKey, this.players);
  }

  resetPlayersTimer() {
    const updated = resetPlayersTimerUtil(this.players);
    this.playersSubject.next(updated);
    this.savePlayers();
  }
}