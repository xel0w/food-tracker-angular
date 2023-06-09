import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyCaloriesComponent } from './daily-calories.component';

describe('DailyCaloriesComponent', () => {
  let component: DailyCaloriesComponent;
  let fixture: ComponentFixture<DailyCaloriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DailyCaloriesComponent]
    });
    fixture = TestBed.createComponent(DailyCaloriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
