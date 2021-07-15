import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { SharedMainModule } from '../../../shared/shared-main.module';
import { SocketService } from '../../../../service/socket/socket.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { CommentsService } from '../../services/comments.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LikeCommentComponent } from './like-comment.component';

describe('LikeCommentComponent', () => {
  let component: LikeCommentComponent;
  let fixture: ComponentFixture<LikeCommentComponent>;

  let commentsServiceMock: CommentsService;
  commentsServiceMock = jasmine.createSpyObj('CommentsService', ['postLike']);
  commentsServiceMock.postLike = () => new Observable();

  let socketServiceMock: SocketService;
  socketServiceMock = jasmine.createSpyObj('SocketService', ['onMessage', 'send']);
  socketServiceMock.onMessage = () => new Observable();
  socketServiceMock.send = () => {};

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);

  const commentData = {
    author: {
      id: 1,
      name: 'Test',
      userProfilePicturePath: null
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
      declarations: [LikeCommentComponent],
      imports: [SharedMainModule, HttpClientTestingModule],
      providers: [
        { provide: CommentsService, useValue: commentsServiceMock },
        { provide: SocketService, useValue: socketServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LikeCommentComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    component.comment = commentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get user id', () => {
    // @ts-ignore
    component.userId = null;
    component.getUserId();
    // @ts-ignore
    expect(component.userId).toBe(1111);
  });

  it('should set initial view for like-component elements', () => {
    component.likeState = true;
    const state = component.likeState;
    // @ts-ignore
    component.setStartingElements(state);
    expect(component.like.nativeElement.srcset).toEqual(component.commentsImages.liked);
  });

  it('should change view of like button', () => {
    const msg = {
      id: 8877,
      amountLikes: 1,
      liked: true,
      userId: 1111
    };
    component.changeLkeBtn(msg);
    expect(component.likeState).toBeTruthy();
    expect(component.like.nativeElement.srcset).toEqual(component.commentsImages.liked);
  });

  it('should set userId and send data to backend if user press like button', () => {
    // @ts-ignore
    component.userId = null;
    // @ts-ignore
    const spy = spyOn(component.commentsService, 'postLike').and.returnValue(of({}));
    component.pressLike();
    expect(spy).toHaveBeenCalled();
    // @ts-ignore
    expect(component.userId).toBe(1111);
  });

  it('should connect to socket and change view of like button', () => {
    const msg = {
      id: 8877,
      amountLikes: 1,
      liked: true,
      userId: 1111
    };
    // @ts-ignore
    spyOn(component.socketService, 'onMessage').and.returnValue(of(msg));
    const spy = spyOn(component, 'changeLkeBtn');
    component.onConnectedtoSocket();
    expect(spy).toHaveBeenCalledWith(msg);
  });

  it('should emit new count of likes', () => {
    const msg = {
      id: 8877,
      amountLikes: 1,
      liked: true,
      userId: 1111
    };
    let likeCount = null;
    // @ts-ignore
    spyOn(component.socketService, 'onMessage').and.returnValue(of(msg));
    component.likesCounter.subscribe((amountLikes) => (likeCount = amountLikes));
    component.onConnectedtoSocket();
    expect(likeCount).toBe(1);
  });
});
