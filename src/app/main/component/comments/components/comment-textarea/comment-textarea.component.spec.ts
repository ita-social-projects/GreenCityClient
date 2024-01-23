import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentTextareaComponent } from './comment-textarea.component';
import { Router } from '@angular/router';
import { SocketService } from '@global-service/socket/socket.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('CommentTextareaComponent', () => {
  let component: CommentTextareaComponent;
  let fixture: ComponentFixture<CommentTextareaComponent>;

  let socketServiceMock: SocketService;
  socketServiceMock = jasmine.createSpyObj('SocketService', ['onMessage', 'send']);
  socketServiceMock.onMessage = () => new Observable();
  let localStorageServiceMock: jasmine.SpyObj<LocalStorageService>;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentTextareaComponent],
      providers: [
        { provide: Router, useValue: {} },
        { provide: SocketService, useValue: socketServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      imports: [TranslateModule.forRoot()]
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

  describe('ngAfterViewInit', () => {
    it('should set innerHTML if commentTextToEdit is provided', () => {
      component.commentTextToEdit = '<p>This is some edited text.</p>';
      component.ngAfterViewInit();
      expect(component.commentTextarea.nativeElement.innerHTML).toBe('<p>This is some edited text.</p>');
    });

    it('should not set innerHTML if commentTextToEdit is provided', () => {
      component.commentTextToEdit = null;
      component.ngAfterViewInit();
      expect(component.commentTextarea.nativeElement.innerHTML).toBe('');
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
      const innerHTML = '<p>Existing HTML content.</p>';
      component.commentTextarea.nativeElement.innerHTML = innerHTML;
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

  describe('onCommentTextareaBlur', () => {
    it('should update isTextareaFocused and isDropdownVisible on commentTextarea blur', () => {
      const fakeEvent = { relatedTarget: document.createElement('div') } as unknown as FocusEvent;
      component.onCommentTextareaBlur(fakeEvent);
      expect(component.isTextareaFocused).toBe(false);
      expect(component.isDropdownVisible).toBe(false);
    });

    it('should update isTextareaFocused and isDropdownVisible on commentTextarea blur', () => {
      const tag = document.createElement('div');
      tag.className = 'mat-option';
      const fakeEvent = { relatedTarget: tag } as unknown as FocusEvent;
      component.onCommentTextareaBlur(fakeEvent);
      expect(component.isTextareaFocused).toBe(false);
      expect(component.isDropdownVisible).toBe(true);
    });
  });

  describe('onDropdownBlur', () => {
    it('should update isDropdownVisible, isTextareaFocused, and document.body.style.overflow on dropdown blur', () => {
      const fakeEvent: FocusEvent = { relatedTarget: document.createElement('div') } as unknown as FocusEvent;
      component.onDropdownBlur(fakeEvent);
      expect(component.isDropdownVisible).toBe(false);
      expect(component.isTextareaFocused).toBe(false);
      expect(document.body.style.overflow).toBe('auto');
    });

    it('should update dropdown visibility and textarea focus on blur', () => {
      const focusEvent = { relatedTarget: component.commentTextarea.nativeElement } as FocusEvent;
      component.onDropdownBlur(focusEvent);
      expect(component.isDropdownVisible).toBe(false);
      expect(component.isTextareaFocused).toBe(true);
      expect(document.body.style.overflow).toBe('auto');
    });

    it('should update dropdown visibility and textarea focus on blur when relatedTarget has mat-option class ', () => {
      const matOption = document.createElement('div');
      matOption.className = 'mat-option';
      const focusEvent = { relatedTarget: matOption } as unknown as FocusEvent;
      component.onDropdownBlur(focusEvent);
      fixture.detectChanges();
      expect(component.isDropdownVisible).toBe(true);
      expect(component.isTextareaFocused).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
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
      component.onPaste(clipboardEvent);
      expect(clipboardEvent.preventDefault).toHaveBeenCalled();
      expect((component as any).insertTextAtCursor).toHaveBeenCalledWith('pasted text');
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

  it('should call onCommentTextareaFocus method', () => {
    component.onCommentTextareaFocus();
    expect(component.isTextareaFocused).toBe(true);
  });

  describe('setFocusOnOption', () => {
    it('should focus the correct option', () => {
      const mockOptions = [
        jasmine.createSpyObj('Option', ['focus']),
        jasmine.createSpyObj('Option', ['focus']),
        jasmine.createSpyObj('Option', ['focus'])
      ];
      spyOn(component.options, 'toArray').and.returnValue(mockOptions);

      (component as any).setFocusOnOption(1);

      expect(mockOptions[0].focus).not.toHaveBeenCalled();
      expect(mockOptions[1].focus).toHaveBeenCalled();
      expect(mockOptions[2].focus).not.toHaveBeenCalled();
      expect(() => (component as any).setFocusOnOption(3)).not.toThrow();
    });
  });

  it('should prevent default when Enter key is pressed', () => {
    const fakeEvent = { key: 'Enter', preventDefault: () => {} } as KeyboardEvent;
    spyOn(fakeEvent, 'preventDefault');

    component.onCommentKeyDown(fakeEvent);

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('should unsubscribe from the subscription on ngOnDestroy', () => {
    spyOn((component as any).localStorageServiceSubscription, 'unsubscribe');
    spyOn((component as any).socketServiceSubscription, 'unsubscribe');
    fixture.destroy();
    expect((component as any).socketServiceSubscription.unsubscribe).toHaveBeenCalled();
    expect((component as any).localStorageServiceSubscription.unsubscribe).toHaveBeenCalled();
  });
});
