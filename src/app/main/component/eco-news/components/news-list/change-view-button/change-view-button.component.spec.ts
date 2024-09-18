import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChangeViewButtonComponent } from './change-view-button.component';

describe('ChangeViewButtonComponent', () => {
  let component: ChangeViewButtonComponent;
  let fixture: ComponentFixture<ChangeViewButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeViewButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeViewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
