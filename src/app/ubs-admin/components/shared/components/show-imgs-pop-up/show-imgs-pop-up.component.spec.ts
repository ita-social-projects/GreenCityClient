import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowImgsPopUpComponent } from './show-imgs-pop-up.component';

describe('ShowImgsPopUpComponent', () => {
  let component: ShowImgsPopUpComponent;
  let fixture: ComponentFixture<ShowImgsPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowImgsPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowImgsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
