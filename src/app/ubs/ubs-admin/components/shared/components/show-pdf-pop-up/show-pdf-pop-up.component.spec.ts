import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPdfPopUpComponent } from './show-pdf-pop-up.component';

describe('ShowPdfPopUpComponent', () => {
  let component: ShowPdfPopUpComponent;
  let fixture: ComponentFixture<ShowPdfPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowPdfPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPdfPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
