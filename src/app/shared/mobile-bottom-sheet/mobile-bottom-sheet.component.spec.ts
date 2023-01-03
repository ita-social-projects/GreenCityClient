import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBottomSheetComponent } from './mobile-bottom-sheet.component';

describe('MobileBottomSheetComponent', () => {
  let component: MobileBottomSheetComponent;
  let fixture: ComponentFixture<MobileBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MobileBottomSheetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
