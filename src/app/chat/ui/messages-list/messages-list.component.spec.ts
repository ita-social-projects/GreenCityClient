import { MessagesListComponent } from './messages-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessageView } from '../../model/chat-page.interface';
import { fakeAsync, tick } from '@angular/core/testing';

describe('MessagesListComponent', () => {
  let fixture: ComponentFixture<MessagesListComponent>;
  let component: MessagesListComponent;

  const msg = (over: Partial<ChatMessageView> = {}): ChatMessageView => ({
    from: 'User',
    text: 'hello',
    time: '10:00',
    images: [],
    viewingStatus: null,
    ...over
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MessagesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not scroll if message count is unchanged', () => {
    component.messages = [msg()];
    fixture.detectChanges();

    component.ngAfterViewChecked();
    const spy = spyOn<any>(component as any, 'scrollToBottom');

    component.ngAfterViewChecked();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call scrollToBottom if new messages have no images', () => {
    const spy = spyOn<any>(component as any, 'scrollToBottom');
    component.messages = [msg({ text: 'no images' })];
    fixture.detectChanges();

    component.ngAfterViewChecked();
    expect(spy).toHaveBeenCalled();
  });

  it('should wait for images before scrolling if new messages contain images', fakeAsync(() => {
    const spy = spyOn<any>(component as any, 'scrollToBottom');

    (component as any).lastMsgCount = 0;
    component.messages = [msg({ images: ['a.png'] })];

    fixture.detectChanges();

    const imgElement = fixture.nativeElement.querySelector('img');
    Object.defineProperty(imgElement, 'complete', { value: false });

    component.ngAfterViewChecked();

    imgElement.dispatchEvent(new Event('load'));

    tick();

    expect(spy).toHaveBeenCalled();
  }));
  it('scrollToBottom should do nothing if scrollContainer is null', () => {
    (component as any).scrollContainer = null;
    expect(() => (component as any).scrollToBottom()).not.toThrow();
  });

  it('waitForImagesToLoad resolves immediately if el is missing', async () => {
    (component as any).scrollContainer = null;
    await expectAsync((component as any).waitForImagesToLoad()).toBeResolved();
  });

  it('waitForImagesToLoad resolves immediately if all images are complete', async () => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    Object.defineProperty(img, 'complete', { value: true });
    div.appendChild(img);
    (component as any).scrollContainer = { nativeElement: div };

    await expectAsync((component as any).waitForImagesToLoad()).toBeResolved();
  });
});
