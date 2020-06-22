import { Component, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { add } from 'ngx-bootstrap/chronos';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.scss']
})
export class AddCommentComponent {

  constructor(private commentsService: CommentsService,
              private fb: FormBuilder, 
              private route: ActivatedRoute) { }

  public avatarImage = 'assets/img/comment-avatar.png';
  public addCommentForm = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(8000)]],
  })
  public iterator = 0;
  public commenstSubscription;
  public remaining;
  public elements = [];

  ngOnInit() {
    this.addElemsToCurrentList();
   
  }

  private addElemsToCurrentList(): void {
    this.route.url.subscribe(url => this.commentsService.ecoNewsId = url[0].path);
    this.commenstSubscription =  this.commentsService.getCommentsByPage()
        .subscribe((list: any) => this.setList(list));
  }

  private setList(data: any): void {
    this.remaining = data.totalElements;
    this.elements = [...this.elements, ...data.page];
    console.log(this.elements)
  }

  private onSubmit(): void {
    console.log(this.addCommentForm.value.content)
    this.commentsService.addComment(this.addCommentForm).subscribe(
      (successRes) => {
        console.log(successRes);
       
      }
    )
  }

}
