import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodTrackerComponent } from './food-tracker.component';

describe('FoodTrackerComponent', () => {
  let component: FoodTrackerComponent;
  let fixture: ComponentFixture<FoodTrackerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodTrackerComponent]
    });
    fixture = TestBed.createComponent(FoodTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
