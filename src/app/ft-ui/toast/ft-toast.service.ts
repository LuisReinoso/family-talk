import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type FtToastVariant = 'success' | 'error' | 'info' | 'warn';

export interface FtToast {
  id: number;
  message: string;
  variant: FtToastVariant;
  /** milliseconds until auto-dismiss; 0 = persistent until manual dismiss */
  duration: number;
}

export interface FtToastOptions {
  duration?: number;
  variant?: FtToastVariant;
}

@Injectable({ providedIn: 'root' })
export class FtToastService {
  private nextId = 1;
  private readonly toastsSubject = new BehaviorSubject<FtToast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  show(message: string, options: FtToastOptions = {}): number {
    const id = this.nextId++;
    const toast: FtToast = {
      id,
      message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 3000,
    };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    if (toast.duration > 0) {
      setTimeout(() => this.dismiss(id), toast.duration);
    }
    return id;
  }

  success(message: string, options: Omit<FtToastOptions, 'variant'> = {}): number {
    return this.show(message, { ...options, variant: 'success' });
  }

  error(message: string, options: Omit<FtToastOptions, 'variant'> = {}): number {
    return this.show(message, { ...options, variant: 'error' });
  }

  dismiss(id: number): void {
    this.toastsSubject.next(this.toastsSubject.value.filter((t) => t.id !== id));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}
