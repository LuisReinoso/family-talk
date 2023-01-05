import { Injectable, OnInit } from '@angular/core';
import { defaultPlayers, Player } from 'src/app/models/player';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements OnInit {
  players: { [key: string]: Player } = defaultPlayers;

  constructor(private localStorageService: LocalStorageService) {
    this.loadPlayers();
  }

  ngOnInit(): void {
    if (!this.players) {
      this.savePlayers();
    }
  }

  addUser(user: Player) {
    this.players[user.id] = user;
  }

  deleteUser(id: string) {
    delete this.players[id];
  }

  updateUser(user: Player) {
    this.players[user.id] = user;
  }

  loadPlayers() {
    const localPlayers = JSON.parse(this.localStorageService.get('players'));
    if (!localPlayers || Object.keys(localPlayers).length === 0) {
      this.players = defaultPlayers;
      return;
    }

    this.players = localPlayers;
  }

  savePlayers() {
    this.localStorageService.save('players', JSON.stringify(this.players));
  }
}
