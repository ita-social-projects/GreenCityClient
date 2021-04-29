import { SocketService } from './../../../../service/socket/socket.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';
import { CommentsService } from './../../services/comments.service';
import { SharedModule } from '@shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeCommentComponent } from './like-comment.component';


fdescribe('LikeCommentComponent', () => {
  let component: LikeCommentComponent;
  let fixture: ComponentFixture<LikeCommentComponent>;

  let commentsServiceMock: CommentsService;
  commentsServiceMock = jasmine.createSpyObj('CommentsService', ['postLike']);
  commentsServiceMock.postLike = () => new Observable();

  let socketServiceMock: SocketService;
  socketServiceMock = jasmine.createSpyObj('SocketService', ['onMessage']);
  socketServiceMock.onMessage = () => new Observable();

  const commentData = {
    author: {
      id: 1,
      name: 'Test',
      userProfilePicturePath: null,
    },
    currentUserLiked: true,
    id: 1,
    likes: 0,
    modifiedDate: '111',
    replies: 1,
    status: 'EDITED',
    text: 'string'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LikeCommentComponent ],
      imports: [ 
        SharedModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: CommentsService, useValue: commentsServiceMock },
        { provide: SocketService, useValue: socketServiceMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeCommentComponent);
    component = fixture.componentInstance;
    component.comment = commentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
