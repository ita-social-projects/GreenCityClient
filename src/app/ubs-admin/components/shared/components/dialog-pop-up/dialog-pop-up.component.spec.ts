import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPopUpComponent } from './dialog-pop-up.component';

describe('DialogPopUpComponent', () => {
  let component: DialogPopUpComponent;
  let fixture: ComponentFixture<DialogPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
