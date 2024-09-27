import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementsModalComponent } from './achievements-modal.component';

describe('AchievementsPopupComponent', () => {
  let component: AchievementsModalComponent;
  let fixture: ComponentFixture<AchievementsModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AchievementsModalComponent]
    });
    fixture = TestBed.createComponent(AchievementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
