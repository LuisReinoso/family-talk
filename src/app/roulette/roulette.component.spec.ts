import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouletteComponent } from './roulette.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouletteComponent', () => {
  let component: RouletteComponent;
  let fixture: ComponentFixture<RouletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouletteComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RouletteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});