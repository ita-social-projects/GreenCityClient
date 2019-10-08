import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgFlashMessageService} from 'ng-flash-messages';
import {mainLink} from '../../links';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${mainLink}`;
  constructor(private http: HttpClient, private ngFlashMessageService: NgFlashMessageService) { }
}
