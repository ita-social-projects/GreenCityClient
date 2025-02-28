import { OverlayModule } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ResizableBottomSheetComponent } from './resizable-bottom-sheet.component';

describe('ResizableBottomSheetComponent', () => {
  let component: ResizableBottomSheetComponent;
  let fixture: ComponentFixture<ResizableBottomSheetComponent>;

  beforeEach(waitForAsync(() => {
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
