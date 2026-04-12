import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error(`LocalStorageService: Failed to set key "${key}"`);
    }
  }

  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      if (!data || data === 'undefined') {
        return null;
      }
      return JSON.parse(data) as T;
    } catch {
      console.error(`LocalStorageService: Failed to parse key "${key}"`);
      return null;
    }
  }

  getRaw(key: string): string | null {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined') {
      return null;
    }
    return data;
  }

  reset(): void {
    localStorage.clear();
  }
}