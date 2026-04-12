import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserAgentService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  public isMobile(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}