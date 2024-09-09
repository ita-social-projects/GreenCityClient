import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommentTextareaComponent } from './comment-textarea.component';
import { Router } from '@angular/router';
import { SocketService } from '@global-service/socket/socket.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { PlaceholderForDivDirective } from 'src/app/main/component/comments/directives/placeholder-for-div.directive';
import { MatSelectModule } from '@angular/material/select';
import { UserProfileImageComponent } from '@global-user/components/shared/components/user-profile-image/user-profile-image.component';
import { MatMenuModule } from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CommentTextareaComponent', () => {
  let component: CommentTextareaComponent;
  let fixture: ComponentFixture<CommentTextareaComponent>;

  const socketServiceMock: SocketService = jasmine.createSpyObj('SocketService', ['onMessage', 'send', 'initiateConnection']);
  socketServiceMock.onMessage = () => new Observable();
  socketServiceMock.send = () => new Observable();
  socketServiceMock.connection = {
    greenCity: { url: '', socket: null, state: null },
    greenCityUser: { url: '', socket: null, state: null }
  };
  socketServiceMock.initiateConnection = () => {};

  const localStorageServiceMock: jasmine.SpyObj<LocalStorageService> = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviourSubject'
  ]);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1);

  const users = [
    {
      userId: 1,
      userName: 'User Name 1',
      profilePicture: null
    },
    {
      userId: 2,
      userName: 'User Name 2',
      profilePicture: null
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommentTextareaComponent, PlaceholderForDivDirective, UserProfileImageComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: SocketService, useValue: socketServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      imports: [MatSelectModule, TranslateModule.forRoot(), BrowserAnimationsModule, MatMenuModule]
    }).compileComponents();
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.style.overflow = 'visible';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define elementRef', () => {
    component.suggestedUsers = users;
    component.menuTrigger.openMenu();
    fixture.detectChanges();
    expect(component.commentTextarea).toBeDefined();
    expect(component.dropdown).toBeDefined();
    expect(fixture.debugElement.queryAll(By.css('.mat-menu-item')).length).toBe(2);
  });

  describe('ngAfterViewInit', () => {
    it('should set innerHTML if commentTextToEdit is provided', () => {
      component.commentTextToEdit = '<p>This is some edited text.</p>';
      component.ngAfterViewInit();
      expect(component.commentTextarea.nativeElement.innerHTML).toBe('<p>This is some edited text.</p>');
    });

    it('should not set innerHTML if commentTextToEdit is provided', () => {
      const placeholderPattern = /<span[^>]*>.*?<\/span>/g;
      component.commentTextToEdit = null;
      component.ngAfterViewInit();
      const innerHTML = component.commentTextarea.nativeElement.innerHTML.replace(placeholderPattern, '');
      expect(innerHTML).toBe('');
    });

    it('should set initial text content', () => {
      component.commentTextToEdit = 'Initial text';
      component.ngAfterViewInit();
      fixture.detectChanges();

      expect(component.commentTextarea.nativeElement.textContent).toBe('Initial text');
    });

    it('should subscribe to input events and emit comment text', () => {
      spyOn(component.content, 'setValue');
      spyOn(component as any, 'emitCommentText');

      component.ngAfterViewInit();
      fixture.detectChanges();

      const textarea = component.commentTextarea.nativeElement as HTMLTextAreaElement;
      textarea.value = 'New text';
      textarea.dispatchEvent(new Event('input'));

      fixture.whenStable().then(() => {
        expect(component.content.setValue).toHaveBeenCalledWith('New text');
        expect((component as any).emitCommentText).toHaveBeenCalled();
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should clear innerHTML if commentHtml is an empty string', () => {
      component.commentTextarea.nativeElement.innerHTML = '<p>Existing HTML content.</p>';
      fixture.detectChanges();
      component.ngOnChanges({ commentHtml: { currentValue: '' } as any });
      const textareaElement = component.commentTextarea.nativeElement;
      expect(textareaElement.innerHTML).toBe('');
    });

    it('should clear innerHTML if commentHtml is an empty string', () => {
      const innerHTML = '<p>Existing HTML content.</p>';
      component.commentTextarea.nativeElement.innerHTML = innerHTML;
      fixture.detectChanges();
      component.ngOnChanges({});
      const textareaElement = component.commentTextarea.nativeElement;
      expect(textareaElement.innerHTML).toBe(innerHTML);
    });

    it('should not clear innerHTML if commentHtml has a non-empty value', () => {
      const innerHTML = '<p>Existing HTML content.</p>';
      component.commentTextarea.nativeElement.innerHTML = innerHTML;
      fixture.detectChanges();
      component.ngOnChanges({ commentHtml: { currentValue: 'a' } as any });
      const textareaElement = component.commentTextarea.nativeElement;
      expect(textareaElement.innerHTML).toBe(innerHTML);
    });
  });

  describe('onpaste', () => {
    it('should prevent default behavior and update content on paste', () => {
      const clipboardEvent = {
        clipboardData: {
          getData: (type: string) => (type === 'text/plain' ? 'pasted text' : '')
        },
        preventDefault: () => {}
      } as ClipboardEvent;
      spyOn(clipboardEvent, 'preventDefault');
      spyOn(component as any, 'insertTextAtCursor');
      spyOn(component as any, 'emitCommentText');
      component.onPaste(clipboardEvent);
      expect(clipboardEvent.preventDefault).toHaveBeenCalled();
      expect((component as any).insertTextAtCursor).toHaveBeenCalledWith('pasted text');
      expect((component as any).emitCommentText).toHaveBeenCalled();
      expect(component.content.value).toBe(component.commentTextarea.nativeElement.textContent);
    });
  });

  describe('insertTextAtCursor', () => {
    it('should insert text at cursor position', () => {
      const text = 'Inserted Text';
      const selection = document.getSelection();
      const range = document.createRange();
      const textNode = document.createTextNode('Existing Text');
      const container = document.createElement('div');
      container.appendChild(textNode);
      document.body.appendChild(container);
      selection.removeAllRanges();
      range.setStart(textNode, 1);
      range.collapse(true);
      selection.addRange(range);
      (component as any).insertTextAtCursor(text);
      expect(container.textContent).toBe(`E${text}xisting Text`);
      document.body.removeChild(container);
    });
  });

  it('should be valid when inner HTML length is within limit', () => {
    component.content.patchValue('a');
    component.commentTextarea.nativeElement.innerHTML = 'a';
    component.content.updateValueAndValidity();
    expect(component.content.hasError('maxlength')).toBeFalsy();
    expect(component.content.valid).toBeTruthy();

    component.content.patchValue('a'.repeat(8000));
    component.commentTextarea.nativeElement.innerHTML = 'a'.repeat(8000);
    component.content.updateValueAndValidity();
    expect(component.content.hasError('maxlength')).toBeFalsy();
    expect(component.content.valid).toBeTruthy();
  });

  it('should be invalid when inner HTML length exceeds the limit', () => {
    component.content.patchValue('a'.repeat(8001));
    component.commentTextarea.nativeElement.innerHTML = 'a'.repeat(8001);
    component.content.updateValueAndValidity();
    expect(component.content.hasError('maxlength')).toBeTruthy();
  });

  it('should prevent default when Enter key is pressed', () => {
    const fakeEvent = { key: 'Enter', preventDefault: () => {} } as KeyboardEvent;
    spyOn(fakeEvent, 'preventDefault');

    component.onCommentKeyDown(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('should unsubscribe from the subscription on ngOnDestroy', () => {
    const destroy$ = 'destroy$';
    const nextSpy = spyOn(component[destroy$], 'next');
    const completeSpy = spyOn(component[destroy$], 'complete');
    component.ngOnDestroy();
    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  it('should return text content from the comment textarea', () => {
    component.commentTextarea.nativeElement.textContent = 'Sample text';
    const result = component['getTextContent']();
    expect(result).toBe('Sample text');
  });

  it('should return true when text contains @ or #', () => {
    const textWithTag = '@mention';
    const result = component['hasTagCharacter'](textWithTag);
    expect(result).toBeTrue();
  });

  it('should return false when text does not contain @ or #', () => {
    const textWithoutTag = 'no mention';
    const result = component['hasTagCharacter'](textWithoutTag);
    expect(result).toBeFalse();
  });

  it('should refocus the textarea after a short delay', (done) => {
    spyOn(component.commentTextarea.nativeElement, 'focus');
    component['refocusTextarea']();

    setTimeout(() => {
      expect(component.commentTextarea.nativeElement.focus).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should handle input events, filter by tag character, and emit text', (done) => {
    spyOn(component.content, 'setValue');
    spyOn(component as any, 'emitCommentText');
    spyOn(component.menuTrigger, 'closeMenu');

    component.commentTextarea.nativeElement.textContent = '@TestUser';
    (component as any).ngAfterViewInit();

    const event = new Event('input');
    component.commentTextarea.nativeElement.dispatchEvent(event);

    fixture.whenStable().then(() => {
      expect(component.content.setValue).toHaveBeenCalledWith('@TestUser');
      expect((component as any).emitCommentText).toHaveBeenCalled();
      expect(component.menuTrigger.closeMenu).not.toHaveBeenCalled();
      done();
    });
  });
});
