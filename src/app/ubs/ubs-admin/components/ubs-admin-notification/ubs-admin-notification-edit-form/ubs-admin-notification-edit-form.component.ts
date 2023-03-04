import { Component, Inject, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, Input, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-notification-edit-form',
  templateUrl: './ubs-admin-notification-edit-form.component.html',
  styleUrls: ['./ubs-admin-notification-edit-form.component.scss']
})
export class UbsAdminNotificationEditFormComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  platform = '';

  params = ['${name}', '${surname}', '${email}'];
  lastFocusedTextarea: ElementRef<HTMLInputElement> | undefined;
  cursorPosition = 0;

  divInput;
  divList;
  isTagging: boolean = false;
  tagValue: string = '';
  items = [
    {
      name: '{name}'
    },
    {
      name: '{id}'
    },
    {
      name: '{email}'
    }
  ];

  active;
  top;
  left;
  triggerIdx;
  options;

  isFirefox;

  properties = [
    'direction', // RTL support
    'boxSizing',
    'width', // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    'height',
    'overflowX',
    'overflowY', // copy the scrollbar for IE

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderStyle',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'fontSizeAdjust',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration', // might not make a difference, but better be safe

    'letterSpacing',
    'wordSpacing',

    'tabSize',
    'MozTabSize'
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { platform: string; text: { en: string; ua: string } },
    public dialogRef: MatDialogRef<UbsAdminNotificationEditFormComponent>
  ) {
    this.platform = data.platform;
    this.form = this.fb.group({
      textEn: [data.text.en],
      textUa: [data.text.ua]
    });
  }

  @ViewChild('textUa') textUa: ElementRef<HTMLInputElement>;
  @ViewChild('textEn') textEn: ElementRef<HTMLInputElement>;

  @ViewChild('list') menuRef: ElementRef;

  @HostListener('input', ['$event'])
  onInputStart(event: Event) {
    this.onInput();
  }

  @HostListener('keydown', ['$event'])
  onKeyDownStart(event: Event) {
    this.onKeyDown(event);
  }

  ngOnInit(): void {
    this.isFirefox = typeof window !== 'undefined' && window['mozInnerScreenX'] != null;
    this.options = [];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.textUa.nativeElement.focus();
      this.saveCaretPosition();
    }, 0);
    this.textUa.nativeElement.addEventListener('focus', () => {
      this.lastFocusedTextarea = this.textUa;
      this.saveCaretPosition();
    });
    this.textEn.nativeElement.addEventListener('focus', () => {
      this.lastFocusedTextarea = this.textEn;
      this.saveCaretPosition();
    });
  }

  addTextToLastFocused(selectElement: HTMLSelectElement) {
    const textToAdd = selectElement.value;
    if (this.lastFocusedTextarea?.nativeElement) {
      let focusedAreaText = this.lastFocusedTextarea.nativeElement.value;

      // Check if cursor position is defined and add text accordingly
      this.lastFocusedTextarea.nativeElement.value = this.cursorPosition
        ? focusedAreaText.slice(0, this.cursorPosition) + textToAdd + focusedAreaText.slice(this.cursorPosition)
        : focusedAreaText + textToAdd;
    }
  }

  saveCaretPosition() {
    this.cursorPosition = this.lastFocusedTextarea.nativeElement.selectionStart || this.lastFocusedTextarea.nativeElement.selectionEnd;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const { textEn, textUa } = this.form.value;
    this.dialogRef.close({
      text: {
        en: textEn,
        ua: textUa
      }
    });
  }

  onInput() {
    const positionIndex = this.textUa.nativeElement.selectionStart;
    const textBeforeCaret = this.textUa.nativeElement.value.slice(0, positionIndex);
    const tokens = textBeforeCaret.split(/\s/);
    const lastToken = tokens[tokens.length - 1];
    const triggerIdx = textBeforeCaret.endsWith(lastToken) ? textBeforeCaret.length - lastToken.length : -1;
    const maybeTrigger = textBeforeCaret[triggerIdx];
    const keystrokeTriggered = maybeTrigger === '$';

    if (!keystrokeTriggered) {
      this.closeMenu();
      return;
    }

    const query = textBeforeCaret.slice(triggerIdx + 1);
    this.makeOptions(query);

    const coords = this.getCaretCoordinates(this.textUa.nativeElement, positionIndex);
    const { top, left } = this.textUa.nativeElement.getBoundingClientRect();

    setTimeout(() => {
      this.active = 0;
      this.left = 200;
      this.top = 30;
      this.triggerIdx = triggerIdx;
      this.renderMenu();
    }, 0);
  }

  onKeyDown(ev) {
    let keyCaught = false;
    if (this.triggerIdx !== undefined) {
      switch (ev.key) {
        case 'ArrowDown':
          this.active = Math.min(this.active + 1, this.options.length - 1);
          this.renderMenu();
          keyCaught = true;
          break;
        case 'ArrowUp':
          this.active = Math.max(this.active - 1, 0);
          this.renderMenu();
          keyCaught = true;
          break;
        case 'Enter':
        case 'Tab':
          this.selectItem(this.active)();
          keyCaught = true;
          break;
      }
    }

    if (keyCaught) {
      ev.preventDefault();
    }
  }

  getCaretCoordinates(element, position) {
    const li = document.createElement('li');
    document.body.appendChild(li);

    const style = li.style;
    const computed = getComputedStyle(element);

    style.whiteSpace = 'pre-wrap';
    style.wordWrap = 'break-word';
    style.position = 'absolute';
    style.visibility = 'hidden';

    if (this.isFirefox) {
      if (element.scrollHeight > parseInt(computed.height)) style.overflowY = 'scroll';
    } else {
      style.overflow = 'hidden';
    }

    li.textContent = element.value.substring(0, position);

    const span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    li.appendChild(span);

    const coordinates = {
      top: span.offsetTop + parseInt(computed['borderTopWidth']),
      left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
      // height: parseInt(computed['lineHeight'])
      height: span.offsetHeight
    };

    li.remove();

    return coordinates;
  }

  renderMenu() {
    if (this.top === undefined) {
      this.menuRef.nativeElement.hidden = true;
      return;
    }

    this.menuRef.nativeElement.style.left = this.left + 'px';
    this.menuRef.nativeElement.style.top = this.top + 'px';
    this.menuRef.nativeElement.innerHTML = '';

    this.options.forEach((option, idx) => {
      this.menuRef.nativeElement.appendChild(this.menuItemFn(option, this.selectItem(idx), this.active === idx));
    });

    this.menuRef.nativeElement.hidden = false;
  }

  menuItemFn = (item, setItem, selected) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    li.classList.add('menu-item');
    if (selected) {
      li.classList.add('selected');
      li.setAttribute('aria-selected', '');
      li.style.backgroundColor = 'slateGray';
      li.style.color = 'white';
    }
    li.textContent = this.trimBrackets(item.name);
    li.onclick = setItem;
    return li;
  };

  selectItem(active) {
    return () => {
      const preMention = this.textUa.nativeElement.value.substr(0, this.triggerIdx);
      const option = this.options[active];
      const mention = this.replaceFn(option, this.textUa.nativeElement.value[this.triggerIdx]);
      const postMention = this.textUa.nativeElement.value.substr(this.textUa.nativeElement.selectionStart);
      const newValue = `${preMention}${mention}${postMention}`;
      this.textUa.nativeElement.value = newValue;
      const caretPosition = this.textUa.nativeElement.value.length - postMention.length;
      this.textUa.nativeElement.setSelectionRange(caretPosition, caretPosition);
      this.closeMenu();
      this.textUa.nativeElement.focus();
    };
  }

  replaceFn = (item, trigger) => `${trigger}${item.name}`;
  resolveFn = (prefix) => (prefix === '' ? this.items : this.items.filter((item) => item.name.startsWith(prefix)));

  closeMenu() {
    setTimeout(() => {
      this.options = [];
      this.left = undefined;
      this.top = undefined;
      this.triggerIdx = undefined;
      this.renderMenu();
    }, 0);
  }

  makeOptions(query) {
    const opts = this.resolveFn(query);
    if (opts.length !== 0) {
      this.options = opts;
      this.renderMenu();
    } else {
      this.closeMenu();
    }
  }

  trimBrackets(word) {
    return word.charAt(0) === '{' && word.charAt(word.length - 1) === '}' ? word.substring(1, word.length - 1) : word;
  }
}
