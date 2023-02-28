import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

declare let umami: any;

@Directive({
  selector: '[eventName]',
  standalone: true,
})
export class EventsDirective {
  @Input() eventName!: string;
  @Input() eventPayload = {};

  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  handleClick($event: MouseEvent) {
    if (environment.production && 'umami' in window) {
      umami.trackEvent(this.eventName, this.eventPayload);
    }
  }
}
