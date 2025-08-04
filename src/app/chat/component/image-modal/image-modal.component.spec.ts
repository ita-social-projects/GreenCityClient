import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ImageModalComponent } from './image-modal.component';

describe('ImageModalComponent', () => {
  let component: ImageModalComponent;
  let fixture: ComponentFixture<ImageModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImageModalComponent]
    });
    fixture = TestBed.createComponent(ImageModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render modal when imageUrl is set', () => {
    component.imageUrl = 'https://example.com/test.png';
    fixture.detectChanges();

    const imgEl = fixture.nativeElement.querySelector('img');
    expect(imgEl).toBeTruthy();
    expect(imgEl.src).toContain('https://example.com/test.png');
  });

  it('should not render modal when imageUrl is null', () => {
    component.imageUrl = null;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeNull();
  });

  it('should emit closeModal when close button is clicked', () => {
    component.imageUrl = 'https://example.com/test.png';
    fixture.detectChanges();

    spyOn(component.closeModal, 'emit');

    const closeBtn = fixture.debugElement.query(By.css('.close-button'));
    closeBtn.nativeElement.click();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should emit closeModal when backdrop is clicked', () => {
    component.imageUrl = 'https://example.com/test.png';
    fixture.detectChanges();

    spyOn(component.closeModal, 'emit');

    const backdrop = fixture.debugElement.query(By.css('.modal-backdrop'));
    backdrop.nativeElement.click();

    expect(component.closeModal.emit).toHaveBeenCalled();
  });

  it('should NOT emit closeModal when modal content is clicked', () => {
    component.imageUrl = 'https://example.com/test.png';
    fixture.detectChanges();

    spyOn(component.closeModal, 'emit');

    const modalContent = fixture.debugElement.query(By.css('.modal-content'));
    modalContent.nativeElement.click();

    expect(component.closeModal.emit).not.toHaveBeenCalled();
  });
});
