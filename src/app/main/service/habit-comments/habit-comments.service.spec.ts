import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HabitCommentsService } from './habit-comments.service';
import { environment } from '@environment/environment';
import { HabitAddedCommentDTO, HabitCommentsModel } from '@global-user/components/habit/models/habits-comments.model';

describe('HabitCommentsService', () => {
  let service: HabitCommentsService;
  let httpTestingController: HttpTestingController;
  const url = environment.backendLink;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HabitCommentsService]
    });

    service = TestBed.inject(HabitCommentsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    const serviceNew: HabitCommentsService = TestBed.inject(HabitCommentsService);
    expect(serviceNew).toBeTruthy();
  });

  it('should make POST request to add comment', () => {
    const commentBody: HabitAddedCommentDTO = {
      author: { id: 1, name: 'User', userProfilePicturePath: null },
      id: 2,
      text: 'Test comment',
      modifiedDate: new Date().toISOString()
    };

    service.addComment(1, 'Test comment', 0).subscribe((commentData) => {
      expect(commentData).toEqual(commentBody);
    });

    const req = httpTestingController.expectOne(`${url}habits/1/comments`);
    expect(req.request.method).toEqual('POST');
    req.flush(commentBody);
  });

  it('should make GET request to get active comments by page', () => {
    const commentData: HabitCommentsModel = {
      currentPage: 0,
      page: [
        {
          author: { id: 1, name: 'User', userProfilePicturePath: null },
          id: 1,
          text: 'Test comment',
          likes: 10,
          modifiedDate: new Date().toISOString(),
          status: 'ORIGINAL',
          replies: 0,
          currentUserLiked: false
        }
      ],
      totalElements: 1
    };

    service.getActiveCommentsByPage(1, 0, 5).subscribe((data) => {
      expect(data).toEqual(commentData);
    });

    const req = httpTestingController.expectOne(`${url}habits/comments/active?habitId=1&page=0&size=5`);
    expect(req.request.method).toEqual('GET');
    req.flush(commentData);
  });

  it('should make GET request to get comments count', () => {
    const count = 10;

    service.getCommentsCount(1).subscribe((data) => {
      expect(data).toEqual(count);
    });

    const req = httpTestingController.expectOne(`${url}habits/1/comments/count`);
    expect(req.request.method).toEqual('GET');
    req.flush(count);
  });

  it('should make DELETE request to delete comment', () => {
    service.deleteComments(1, 2).subscribe((result) => {
      expect(result).toBeTrue();
    });

    const req = httpTestingController.expectOne(`${url}habits/comments/2`);
    expect(req.request.method).toEqual('DELETE');
    req.flush({}, { status: 200, statusText: 'OK' });
  });

  it('should make GET request to get replies amount', () => {
    const repliesCount = 5;

    service.getRepliesAmount(1, 2).subscribe((data) => {
      expect(data).toEqual(repliesCount);
    });

    const req = httpTestingController.expectOne(`${url}habits/comments/2/replies/active/count`);
    expect(req.request.method).toEqual('GET');
    req.flush(repliesCount);
  });

  it('should make PATCH request to edit a comment', () => {
    const updatedText = 'Updated comment';

    service.editComment(1, 2, updatedText).subscribe(() => {});

    const req = httpTestingController.expectOne(`${url}habits/comments?id=2`);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toEqual({ text: updatedText });
    req.flush({});
  });
});
