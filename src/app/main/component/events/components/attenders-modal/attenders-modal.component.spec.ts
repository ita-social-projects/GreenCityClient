import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendersModalComponent } from './attenders-modal.component';

describe('AttendersModalComponent', () => {
  let component: AttendersModalComponent;
  let fixture: ComponentFixture<AttendersModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendersModalComponent]
    });
    fixture = TestBed.createComponent(AttendersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
