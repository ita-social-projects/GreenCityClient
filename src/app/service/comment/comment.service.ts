import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgFlashMessageService} from 'ng-flash-messages';
import {mainLink, placeLink} from '../../links';
import {Comment} from '../../model/comment/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${mainLink}`;

  constructor(private http: HttpClient, private ngFlashMessageService: NgFlashMessageService) {
  }

  saveCommentByPlaceId(id: number, comment: Comment) {
    this.http.post(`${placeLink}${id}/comments`, comment).subscribe(() => {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Your comment was added'],
          dismissible: true,
          timeout: 3000,
          type: 'success'
        });

      }, error => {
        this.ngFlashMessageService.showFlashMessage({
          messages: ['Please try again'],
          dismissible: true,
          timeout: 3000,
          type: 'danger'
        });
      }
    );
  }
}
