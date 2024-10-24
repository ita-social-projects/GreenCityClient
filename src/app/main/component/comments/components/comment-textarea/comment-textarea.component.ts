import { SocketService } from '@global-service/socket/socket.service';
import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  Output,
  Input,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { TaggedUser } from '../../models/comments-model';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { MatOption } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-comment-textarea',
  templateUrl: './comment-textarea.component.html',
  styleUrls: ['./comment-textarea.component.scss']
})
export class CommentTextareaComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  private userId: number;
  private searchQuery = '';
  private lastTagCharIndex: number;
  private charToTagUsers = ['@', '#'];
  private range: Range;

  content: FormControl = new FormControl('', [Validators.required, this.innerHtmlMaxLengthValidator(8000)]);
  suggestedUsers: TaggedUser[] = [];
  cursorPosition: {
    top: number;
    left: number;
  };
  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('commentTextarea') commentTextarea: ElementRef;
  @ViewChild('dropdown') dropdown;
  @ViewChild('menuTrigger') menuTrigger;

  @Output() commentText = new EventEmitter<{ text: string; innerHTML: string }>();
  @Input() commentTextToEdit: string;
  @Input() commentHtml: string;
  @Input() placeholder: string;

  constructor(
    public socketService: SocketService,
    private localStorageService: LocalStorageService,
    public elementRef: ElementRef
  ) {
    this.socketService.initiateConnection(this.socketService.connection.greenCity);
  }

  ngOnInit(): void {
    this.localStorageService.userIdBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((id) => (this.userId = id));
    this.socketService
      .onMessage(this.socketService.connection.greenCity, `/topic/${this.userId}/searchUsers`)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: TaggedUser[]) => {
        if (data.length) {
          this.suggestedUsers = data.filter((el) => el.userName.toLowerCase().includes(this.searchQuery.toLowerCase()));
          this.menuTrigger.openMenu();
          this.refocusTextarea();
        } else {
          this.menuTrigger.closeMenu();
          this.suggestedUsers = [];
        }
      });
  }

  ngAfterViewInit(): void {
    if (this.commentTextToEdit) {
      this.commentTextarea.nativeElement.innerHTML = this.commentTextToEdit;
    }
    fromEvent(this.commentTextarea.nativeElement, 'input')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        tap(() => {
          this.content.setValue(this.commentTextarea.nativeElement.textContent);
          this.emitCommentText();
          const textContent = this.commentTextarea.nativeElement.textContent;
          const hasTagCharacter = this.charToTagUsers.some((char) => textContent.includes(char));
          if (!hasTagCharacter) {
            this.menuTrigger.closeMenu();
            this.suggestedUsers = [];
          }
        }),
        filter(() => {
          this.getSelectionStart();
          if (this.range?.startContainer) {
            const textBeforeCaret = this.range.startContainer.textContent.slice(0, this.range.startOffset);
            this.lastTagCharIndex = Math.max(textBeforeCaret.lastIndexOf('@'), textBeforeCaret.lastIndexOf('#'));
            return this.lastTagCharIndex !== -1;
          }
          return false;
        })
      )
      .subscribe(() => {
        const textBeforeCaret = this.range.startContainer.textContent.slice(0, this.range.startOffset);
        this.searchQuery = textBeforeCaret.slice(this.lastTagCharIndex + 1);
        this.updateCursorPosition();

        if (!this.searchQuery.includes(' ')) {
          this.sendSocketMessage(this.searchQuery);
        } else {
          this.menuTrigger.closeMenu();
          this.suggestedUsers = [];
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.commentHtml?.currentValue === '') {
      this.commentTextarea.nativeElement.innerHTML = '';
    }
  }

  refocusTextarea(): void {
    setTimeout(() => {
      this.commentTextarea.nativeElement.focus();
    }, 0);
  }

  onCommentTextareaFocus(): void {
    const range = document.createRange();
    const nodeAmount = this.commentTextarea.nativeElement.childNodes.length;
    range.setStartAfter(this.commentTextarea.nativeElement.childNodes[nodeAmount - 1]);
    range.setEndAfter(this.commentTextarea.nativeElement.childNodes[nodeAmount - 1]);
    range.collapse(false);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  onDropdownBlur(event: FocusEvent): void {
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(this.range);
    this.refocusTextarea();
  }

  onCommentKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    this.insertTextAtCursor(text);
    this.content.setValue(this.commentTextarea.nativeElement.textContent);
    this.emitCommentText();
  }

  private insertTextAtCursor(text: string): void {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
  }

  insertNodeAtCursor(user: TaggedUser, tagChar: string) {
    const selection = window.getSelection();

    const userTagNode = document.createElement('a');
    userTagNode.contentEditable = 'false';
    userTagNode.textContent = tagChar + user.userName;
    userTagNode.setAttribute('data-userId', user.userId.toString());
    userTagNode.style.fontWeight = '700';
    this.range.insertNode(userTagNode);

    this.range.setStartAfter(userTagNode);
    this.range.setEndAfter(userTagNode);
    selection.removeAllRanges();
    selection.addRange(this.range);
  }

  getSelectionStart(): void {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.range = selection.getRangeAt(0);
      }
    }
  }

  updateCursorPosition(): void {
    const selection = window.getSelection();
    if (selection) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      this.cursorPosition = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      };
    }
  }

  sendSocketMessage(query: string): void {
    this.socketService.send(this.socketService.connection.greenCity, '/app/getUsersToTagInComment', {
      currentUserId: this.userId,
      searchQuery: query
    });
  }

  setFocusCommentTextarea(): void {
    const selection = window.getSelection();
    const range = document.createRange();
    const length = this.commentTextarea.nativeElement.childNodes.length;
    range.collapse(true);
    range.setStartAfter(this.commentTextarea.nativeElement.childNodes[length - 1]);
    range.setEndAfter(this.commentTextarea.nativeElement.childNodes[length - 1]);

    selection.removeAllRanges();
    selection.addRange(range);
  }

  selectSuggestion(user: TaggedUser): void {
    const tagChar = this.range.startContainer.textContent[this.lastTagCharIndex];

    this.menuTrigger.closeMenu();
    this.removeSearchQuery();
    this.insertNodeAtCursor(user, tagChar);
    this.setFocusCommentTextarea();
    this.content.setValue(this.commentTextarea.nativeElement.textContent);
    this.emitCommentText();
    this.refocusTextarea();
  }

  private emitCommentText(): void {
    this.commentText.emit({
      text: this.commentTextarea.nativeElement.textContent,
      innerHTML: this.commentTextarea.nativeElement.innerHTML.replace('&nbsp;', ' ')
    });
  }

  private removeSearchQuery(): void {
    const currentNode = this.range.startContainer;
    const currentStartOffset = this.range.startOffset;
    currentNode.textContent =
      currentNode.textContent.slice(0, currentStartOffset - this.searchQuery.length - 1) +
      currentNode.textContent.slice(currentStartOffset);

    this.range.setStart(this.range.startContainer, currentStartOffset - this.searchQuery.length - 1);
  }

  private innerHtmlMaxLengthValidator(maxLength: number) {
    return () => {
      if (this.commentTextarea) {
        const isValid = this.commentTextarea.nativeElement.innerHTML.length <= maxLength;
        return isValid ? null : { maxlength: true };
      } else {
        return null;
      }
    };
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
