import { OverlayModule } from '@angular/cdk/overlay';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResizableBottomSheetComponent } from './resizable-bottom-sheet.component';

describe('ResizableBottomSheetComponent', () => {
  let component: ResizableBottomSheetComponent;
  let fixture: ComponentFixture<ResizableBottomSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResizableBottomSheetComponent],
      imports: [OverlayModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
