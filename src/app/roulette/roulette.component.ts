import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  styleUrls: ['./roulette.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RouletteComponent implements OnInit {
  @ViewChild('roulette') roulette!: ElementRef;

  isRotating = true;

  rotationInterval: any;
  rotationAngle: number = 0;

  screenRotation: number = 0;

  items = [
    { name: 'Item 1', color: '#3f297e' },
    { name: 'Item 2', color: '#1d61ac' },
    { name: 'Item 3', color: '#169ed8' },
    { name: 'Item 4', color: '#209b6c' },
    { name: 'Item 5', color: '#60b236' },
    { name: 'Item 6', color: '#efe61f' },
    { name: 'Item 7', color: '#f7a416' },
    { name: 'Item 8', color: '#e6471d' },
    { name: 'Item 9', color: '#dc0936' },
    { name: 'Item 10', color: '#e5177b' },
    { name: 'Item 11', color: '#be107f' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) {
    this.screenRotation = 360 / this.items.length;
    console.log('screenRotation', this.screenRotation);
  }

  ngOnInit(): void {
    console.log('queryParams', this.route.snapshot.queryParams);
    this.startRotation();
  }

  startRotation() {
    this.isRotating = true;
    this.rotationInterval = setInterval(() => {
      this.rotationAngle += 10;
      this.roulette.nativeElement.setAttribute(
        'transform',
        `rotate(${this.rotationAngle} 200 200)`
      );
    }, 100);
  }

  stopRotation() {
    this.isRotating = false;
    clearInterval(this.rotationInterval);
  }

  returnToCountdown() {
    this.router.navigate(['']);
  }
}
