import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthorityService } from './authority.service';
import { Group, Permission } from '@ubs/ubs-admin/models/employee-permissions.model';

describe('AuthorityService', () => {
  let service: AuthorityService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthorityService]
    });
    service = TestBed.inject(AuthorityService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all authorities', () => {
    const mockGroups: Group[] = [
      {
        id: '1',
        nameEn: 'Group 1',
        nameUk: 'Група 1',
        authorities: [
          {
            name: 'SET_SMTH',
            descriptionEn: 'bla bla',
            descriptionUk: 'bla bla'
          },
          {
            name: 'DO_SMTH',
            descriptionEn: 'bla',
            descriptionUk: 'bla'
          }
        ]
      },
      {
        id: '2',
        nameEn: 'Group 2',
        nameUk: 'Група 2',
        authorities: [
          {
            name: 'GIVE_SMTH',
            descriptionEn: 'bla',
            descriptionUk: 'bla'
          },
          {
            name: 'NOT_DO_SMTH',
            descriptionEn: 'bla a',
            descriptionUk: 'bla a'
          }
        ]
      }
    ];
    const expectedUrl = `${service.ownSecurityLink}authorities/categories`;

    service.getAllAuthorities().subscribe((groups) => {
      expect(groups).toEqual(mockGroups);
    });

    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockGroups);
  });
});
