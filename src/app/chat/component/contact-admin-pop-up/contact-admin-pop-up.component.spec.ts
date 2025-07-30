import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactAdminPopUpComponent } from './contact-admin-pop-up.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { ClientProfileService } from '@ubs/ubs-user/services/client-profile.service';
import { BehaviorSubject, of } from 'rxjs';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { UserProfile } from '@ubs/ubs-admin/models/ubs-admin.interface';
import { CHAT_ICONS } from '../../chat-icons';

describe('ContactAdminPopUpComponent', () => {
  let component: ContactAdminPopUpComponent;
  let fixture: ComponentFixture<ContactAdminPopUpComponent>;
  let mockMatDialog: MatDialog;
  let mockLocalStorageService: Partial<LocalStorageService>;
  let mockJwtService: Partial<JwtService>;
  let mockClientProfileService: Partial<ClientProfileService>;

  const userIdSubject = new BehaviorSubject<number | null>(null);

  beforeEach(async () => {
    mockLocalStorageService = {
      userIdBehaviourSubject: userIdSubject
    };

    mockJwtService = {
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue('ROLE_USER')
    };

    mockClientProfileService = {
      getDataClientProfile: jasmine.createSpy('getDataClientProfile').and.returnValue(
        of({
          botList: [{ link: 'https://t.me/testbot' }]
        } as UserProfile)
      )
    };

    await TestBed.configureTestingModule({
      declarations: [ContactAdminPopUpComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: MatDialog, useValue: { open: jasmine.createSpy('open') } },
        { provide: LocalStorageService, useValue: mockLocalStorageService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ClientProfileService, useValue: mockClientProfileService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAdminPopUpComponent);
    component = fixture.componentInstance;
    mockMatDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  afterEach(() => {
    userIdSubject.next(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize chatIcon with CHAT_ICONS.chats', () => {
    expect(component.chatIcon).toBe(CHAT_ICONS.chats);
  });

  it('should call isUserAdmin on ngOnInit', () => {
    spyOn<any>(component, 'isUserAdmin');
    component.ngOnInit();
    expect(component['isUserAdmin']).toHaveBeenCalled();
  });

  describe('isUserAdmin', () => {
    it('should set isUbsAdmin to true and not call getTelegramUrl if user is UBS_EMPLOYEE', () => {
      mockJwtService.getUserRole = jasmine.createSpy().and.returnValue('ROLE_UBS_EMPLOYEE');
      spyOn<any>(component, 'getTelegramUrl');
      userIdSubject.next(123);

      component['isUserAdmin']();

      expect(component.isUbsAdmin).toBeTrue();
      expect(component['getTelegramUrl']).not.toHaveBeenCalled();
    });

    it('should set isUbsAdmin to false and call getTelegramUrl if user is not UBS_EMPLOYEE and userId exists', () => {
      mockJwtService.getUserRole = jasmine.createSpy().and.returnValue('ROLE_USER');
      spyOn<any>(component, 'getTelegramUrl');
      userIdSubject.next(456);

      component['isUserAdmin']();

      expect(component.isUbsAdmin).toBeFalse();
      expect(component['getTelegramUrl']).toHaveBeenCalled();
    });

    it('should set isUbsAdmin to false and not call getTelegramUrl if userId does not exist', () => {
      mockJwtService.getUserRole = jasmine.createSpy().and.returnValue('ROLE_USER');
      spyOn<any>(component, 'getTelegramUrl');
      userIdSubject.next(null);

      component['isUserAdmin']();

      expect(component.isUbsAdmin).toBeFalse();
      expect(component['getTelegramUrl']).not.toHaveBeenCalled();
    });
  });

  describe('getTelegramUrl', () => {
    it('should call clientProfileService.getDataClientProfile and set telegramBotURL', () => {
      const mockUserProfile: UserProfile = {
        botList: [{ link: 'https://t.me/anotherbot' }]
      } as UserProfile;
      (mockClientProfileService.getDataClientProfile as jasmine.Spy).and.returnValue(of(mockUserProfile));

      component['getTelegramUrl']();

      expect(mockClientProfileService.getDataClientProfile).toHaveBeenCalled();
      expect(component.telegramBotURL).toBe('https://t.me/anotherbot');
    });
  });

  describe('openTelegramChat', () => {
    let originalWindowOpen: (url?: string, target?: string, features?: string, replace?: boolean) => Window | null;

    beforeEach(() => {
      originalWindowOpen = window.open;
      spyOn(window, 'open');
      component.telegramBotURL = 'https://t.me/testboturl';
    });

    afterEach(() => {
      window.open = originalWindowOpen;
    });

    it('should call window.open with the correct URL and target', () => {
      component['openTelegramChat']();
      expect(window.open).toHaveBeenCalledWith('https://t.me/testboturl', '_blank');
    });
  });

  describe('openAuthModalWindow', () => {
    it('should open AuthModalComponent with correct dialog config', () => {
      component['openAuthModalWindow']();
      expect(mockMatDialog.open).toHaveBeenCalledWith(AuthModalComponent, {
        hasBackdrop: true,
        closeOnNavigation: true,
        panelClass: ['custom-dialog-container'],
        data: {
          popUpName: 'sign-in'
        }
      });
    });
  });

  describe('handleUserClick', () => {
    beforeEach(() => {
      spyOn<any>(component, 'openTelegramChat');
      spyOn<any>(component, 'openAuthModalWindow');
    });

    it('should call openTelegramChat if userId is present', () => {
      component['userId'] = 1;
      component.handleUserClick();
      expect(component['openTelegramChat']).toHaveBeenCalled();
      expect(component['openAuthModalWindow']).not.toHaveBeenCalled();
    });

    it('should call openAuthModalWindow if userId is not present', () => {
      component['userId'] = null;
      component.handleUserClick();
      expect(component['openAuthModalWindow']).toHaveBeenCalled();
      expect(component['openTelegramChat']).not.toHaveBeenCalled();
    });
  });
});
