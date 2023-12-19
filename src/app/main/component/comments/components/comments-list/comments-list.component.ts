import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChildren
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, dataTypes, PaginationConfig } from '../../models/comments-model';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent implements OnChanges, AfterViewInit {
  @Input() public entityId: number;
  @Input() public elementsList: CommentsDTO[] = [];
  @Input() public dataType: string;
  @Input() public commentId: number;
  @Input() public config: PaginationConfig;
  @Input() public isLoggedIn: boolean;
  @Input() public userId: number;
  @Output() public changedList = new EventEmitter();
  public types = dataTypes;
  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(8000)]);
  private commentHtml = '';
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';
  public likeImg = 'assets/img/comments/like.png';
  public isEditTextValid: boolean;
  public commentMaxLength = 8000;

  @ViewChildren('commentText') commentText: QueryList<ElementRef>;

  constructor(private commentsService: CommentsService, private renderer: Renderer2, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.elementsList && !changes.elementsList.firstChange) {
      setTimeout(() => this.updateCommentsInnerHtml(this.commentText), 0);
    }
  }

  ngAfterViewInit(): void {
    this.updateCommentsInnerHtml(this.commentText);
  }

  updateCommentsInnerHtml(elements: QueryList<ElementRef>): void {
    elements.toArray().forEach((element, index) => {
      console.log(element.nativeElement);
      if (element.nativeElement?.childNodes?.length) {
        Array.from(element.nativeElement?.childNodes).forEach((node) => {
          this.renderer.removeChild(element.nativeElement, node);
        });
      }

      this.renderElemFromString(element, this.elementsList[index].text);
    });
  }

  private renderElemFromString(el: ElementRef, text: string): void {
    const div = this.renderer.createElement('div');
    this.renderer.setProperty(div, 'innerHTML', text);

    for (const child of div.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const link = this.renderer.createElement('a');
        const linkText = this.renderer.createText(child.textContent);
        const userName = child.textContent.slice(1);
        this.renderer.listen(link, 'click', () => {
          this.router.navigate(['profile', this.userId, 'users', userName, `${child.getAttribute('data-userid')}`]);
        });
        this.renderer.appendChild(link, linkText);
        this.renderer.addClass(link, 'user-tag');
        this.renderer.appendChild(el.nativeElement, link);
      }
      if (child.nodeType === Node.TEXT_NODE) {
        const textNode = this.renderer.createText(child.textContent);
        this.renderer.appendChild(el.nativeElement, textNode);
      }
    }
  }

  public deleteComment(): void {
    this.changedList.emit();
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentsService
      .editComment(element.id, this.commentHtml)
      .pipe(take(1))
      .subscribe(() => this.content.reset());

    element.isEdit = false;
    element.text = this.commentHtml;
    element.status = 'EDITED';
    element.modifiedDate = String(Date.now());

    setTimeout(() => {
      const index = this.elementsList.findIndex((el) => el.id === element.id);
      this.renderElemFromString(this.commentText.toArray()[index], this.commentHtml);
    }, 0);
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }

  public changeCounter(counter: number, id: number, key: string): void {
    this.elementsList = this.elementsList.map((item) => {
      if (item.id === id) {
        item[key] = counter;
      }
      return item;
    });
  }

  public showElements(id: number, key: 'isEdit' | 'showAllRelies' | 'showRelyButton'): void {
    if (key !== 'showAllRelies') {
      this.updateContentControl(id);
    }
    this.elementsList = this.elementsList.map((item) => {
      item[key] = item.id === id && !item[key];
      return item;
    });
  }

  public updateContentControl(id: number): void {
    const commentContent = this.elementsList.filter((el) => el.id === id)[0].text;
    this.content.setValue(commentContent);
    this.isEditTextValid = true;
  }

  public isShowReplies(id: number): boolean {
    for (const item of this.elementsList) {
      if (item.id === id && item.showAllRelies) {
        return item.showAllRelies;
      }
    }
    return false;
  }

  public checkCommentAuthor(commentAuthorId: number) {
    return commentAuthorId === Number(this.userId);
  }

  setCommentText(data: { text: string; innerHTML: string }): void {
    this.content.setValue(data.text);
    this.commentHtml = data.innerHTML;
    this.isEditTextValid = !!this.content.value.trim().length && this.content.value.length <= this.commentMaxLength;
  }
}
