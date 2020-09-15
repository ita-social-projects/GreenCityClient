import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { CommentsDTO, CommentsModel } from '../../models/comments-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-replies-main',
  templateUrl: './replies-main.component.html',
  styleUrls: ['./replies-main.component.scss']
})
export class RepliesMainComponent implements OnInit, OnDestroy {
  @Input() public commentId: number;
  @Input() public isLoggedIn: boolean;
  @Input() public userId: number;
  public elementsList: CommentsDTO[] = [];
  public repliesSubscription: Subscription;
  public showRelies = false;
  public showAddReply = false;
  public repliesCounter: number;
  public elementsArePresent = true;
  public config = {
    id: 'reply',
    itemsPerPage: 10,
    currentPage: 0,
    totalItems: 0
  };

  constructor(private commentService: CommentService) { }

  ngOnInit() {
    this.config.id = this.commentId.toString();
    this.addElemsToRepliesList();
    this.getActiveComments();
    this.setRepliesCounter();
  }

  private addElemsToRepliesList(page = 0): void {
    this.repliesSubscription = this.commentService.getActiveRepliesByPage(this.commentId, page, this.config.itemsPerPage)
      .subscribe((list: CommentsModel) => {
        this.elementsList = list.page.filter(item => item.status !== 'DELETED');
      }); 
  };

  public showReliesList(): void {
    this.showRelies = !this.showRelies;
  }

  public toggleReply(): void {
    this.showAddReply = !this.showAddReply;
  }

  public addReply(data): void {
    this.elementsList = [data, ...this.elementsList];
    this.setRepliesCounter();
  }

  public deleteComment(data: CommentsDTO[]): void {
    this.elementsList = data;
    this.setRepliesCounter();
  }

  
  public setRepliesCounter(): void {
    this.commentService.getRepliesAmount(this.commentId)
      .subscribe((data: number) => this.repliesCounter = data);
  }

  public getActiveComments(): void {
    this.commentService.getActiveRepliesByPage(this.commentId, 0, this.config.itemsPerPage)
      .subscribe((el: CommentsModel) => {
        this.setData(el.currentPage, el.totalElements);
      });
  }

  public setData(currentPage: number, totalElements: number): void {
    this.config.currentPage = currentPage;
    this.config.totalItems = totalElements;
  }

  ngOnDestroy() {
    this.repliesSubscription.unsubscribe();
  }
}
