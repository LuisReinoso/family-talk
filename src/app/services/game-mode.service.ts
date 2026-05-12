import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_GAME_MODE, GameMode } from 'src/app/models/game-mode';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class GameModeService {
  private static readonly STORAGE_KEY = 'gameMode';

  private readonly modeSubject = new BehaviorSubject<GameMode>(DEFAULT_GAME_MODE);
  readonly mode$ = this.modeSubject.asObservable();

  constructor(private localStorage: LocalStorageService) {
    this.load();
  }

  get mode(): GameMode {
    return this.modeSubject.getValue();
  }

  set(mode: GameMode): void {
    this.modeSubject.next(mode);
    this.localStorage.set(GameModeService.STORAGE_KEY, mode);
  }

  toggle(): GameMode {
    const next: GameMode = this.mode === 'conversation' ? 'trivia' : 'conversation';
    this.set(next);
    return next;
  }

  private load(): void {
    const value = this.localStorage.get<GameMode>(GameModeService.STORAGE_KEY);
    this.modeSubject.next(value === 'trivia' ? 'trivia' : 'conversation');
  }
}
