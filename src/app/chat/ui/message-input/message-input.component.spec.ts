import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageInputComponent } from './message-input.component';
import { TranslateModule } from '@ngx-translate/core';
import { ElementRef } from '@angular/core';

describe('MessageInputComponent', () => {
  let fixture: ComponentFixture<MessageInputComponent>;
  let component: MessageInputComponent;

  const makeFile = (bytes: number, name = 'file.txt', type = 'text/plain') => new File([new Uint8Array(bytes)], name, { type });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageInputComponent, TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('send(): does nothing when both text empty/whitespace and no file', () => {
    const spy = jasmine.createSpy('sendText');
    component.sendText.subscribe(spy);

    component.text = '   ';
    component.file = undefined;

    component.send();

    expect(spy).not.toHaveBeenCalled();

    expect(component.text).toBe('   ');
    expect(component.file).toBeUndefined();
  });

  it('send(): emits payload and resets when text is non-empty', () => {
    const spy = jasmine.createSpy('sendText');
    component.sendText.subscribe(spy);

    component.text = 'hello';
    component.file = undefined;

    component.send();

    expect(spy).toHaveBeenCalledOnceWith({ text: 'hello', file: undefined });
    expect(component.text).toBe('');
    expect(component.file).toBeUndefined();
  });

  it('send(): emits when file exists even if text is whitespace, then resets both', () => {
    const spy = jasmine.createSpy('sendText');
    component.sendText.subscribe(spy);

    const f = makeFile(10, 'pic.png', 'image/png');
    component.text = '   ';
    component.file = f;

    component.send();

    expect(spy).toHaveBeenCalledOnceWith({ text: '   ', file: f });
    expect(component.text).toBe('');
    expect(component.file).toBeUndefined();
  });

  it('send(): clears file input value when fileInput ViewChild is available', () => {
    const spy = jasmine.createSpy('sendText');
    component.sendText.subscribe(spy);

    const mockFileInput = {
      nativeElement: {
        value: 'some-file-path'
      }
    };
    component.fileInput = mockFileInput as any;

    component.text = 'hello';
    const testFile = makeFile(10, 'test.txt');
    component.file = testFile;

    component.send();

    expect(spy).toHaveBeenCalledOnceWith({ text: 'hello', file: testFile });
    expect(mockFileInput.nativeElement.value).toBe('');
    expect(component.text).toBe('');
    expect(component.file).toBeUndefined();
  });

  it('send(): handles case when fileInput ViewChild is not available', () => {
    const spy = jasmine.createSpy('sendText');
    component.sendText.subscribe(spy);

    component.fileInput = undefined as any;

    component.text = 'hello';
    const testFile = makeFile(10, 'test.txt');
    component.file = testFile;

    expect(() => component.send()).not.toThrow();

    expect(spy).toHaveBeenCalledOnceWith({ text: 'hello', file: testFile });
    expect(component.text).toBe('');
    expect(component.file).toBeUndefined();
  });

  it('onFileSelected(): sets file when within size limit (<= 5MB)', () => {
    const okFile = makeFile(1 * 1024 * 1024, 'ok.txt');
    const event = {
      target: {
        files: [okFile],
        value: 'some-path'
      }
    } as any;

    component.onFileSelected(event);

    expect(component.file).toBe(okFile);
  });

  it('onFileSelected(): ignores when no file present', () => {
    const eventNoFiles = { target: { files: [], value: 'x' } } as any;
    component.file = undefined;

    component.onFileSelected(eventNoFiles);
    expect(component.file).toBeUndefined();

    const eventUndefined = { target: { files: undefined, value: 'y' } } as any;
    component.onFileSelected(eventUndefined);
    expect(component.file).toBeUndefined();
  });

  it('onFileSelected(): rejects file larger than 5MB, clears file and input value', () => {
    const bigFile = makeFile(5 * 1024 * 1024 + 1, 'too-big.bin');

    const event = {
      target: {
        files: [bigFile],
        value: 'chosen/path.bin'
      }
    } as any;

    component.file = makeFile(100, 'prev.txt');

    component.onFileSelected(event);

    expect(component.file).toBeUndefined();
    expect(event.target.value).toBe('');
  });

  it('should initialize text as empty string', () => {
    expect(component.text).toBe('');
  });

  it('should have undefined editText initially', () => {
    expect(component.editText).toBeUndefined();
  });

  it('should set text and focus input when editText changes', () => {
    component.textInput = new ElementRef(document.createElement('input'));
    spyOn(component.textInput.nativeElement, 'focus');

    const changes = {
      editText: {
        currentValue: 'Hello world',
        previousValue: '',
        firstChange: true,
        isFirstChange: () => true
      }
    };

    component.editText = 'Hello world';
    component.ngOnChanges(changes);

    expect(component.text).toBe('Hello world');
    expect(component.textInput.nativeElement.focus).toHaveBeenCalled();
  });

  it('should not focus when editText has no currentValue', () => {
    component.textInput = new ElementRef(document.createElement('input'));
    spyOn(component.textInput.nativeElement, 'focus');

    const changes = {
      editText: {
        currentValue: undefined,
        previousValue: 'Old',
        firstChange: false,
        isFirstChange: () => false
      }
    };

    component.ngOnChanges(changes);
    expect(component.textInput.nativeElement.focus).not.toHaveBeenCalled();
  });
});
