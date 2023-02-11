import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined') {
      return null;
    }

    return JSON.parse(data);
  }

  getRaw(key: string) {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined') {
      return null;
    }

    return data;
  }

  reset() {
    localStorage.clear();
  }
}
