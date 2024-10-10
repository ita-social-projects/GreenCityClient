import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeComponent } from './unsubscribe.component';

describe('UnsubscribeComponent', () => {
  let component: UnsubscribeComponent;
  let fixture: ComponentFixture<UnsubscribeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnsubscribeComponent]
    });
    fixture = TestBed.createComponent(UnsubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
