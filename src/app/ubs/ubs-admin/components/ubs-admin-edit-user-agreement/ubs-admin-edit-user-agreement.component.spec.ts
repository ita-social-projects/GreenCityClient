import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TUserAgreementAdmin } from '@ubs/ubs-admin/models/user-agreement.interface';
import { AdminUserAgreementService } from '@ubs/ubs-admin/services/admin-user-agreement/admin-user-agreement.service';
import { of } from 'rxjs';
import { SpinnerComponent } from 'src/app/shared/spinner/spinner.component';
import { UbsAdminEditUserAgreementComponent } from './ubs-admin-edit-user-agreement.component';

const mockUserAgreement: TUserAgreementAdmin = {
  id: 1,
  createdAt: '2024-08-16T18:45:16.840366',
  authorEmail: 'admin@example.com',
  textUa: 'some text in Ukrainian',
  textEn: 'some text in English'
};

describe('UbsAdminEditUserAgreementComponent', () => {
  let component: UbsAdminEditUserAgreementComponent;
  let fixture: ComponentFixture<UbsAdminEditUserAgreementComponent>;
  let mockUserAgreementService: jasmine.SpyObj<AdminUserAgreementService>;
  let mockMatDialog;

  beforeEach(() => {
    mockUserAgreementService = jasmine.createSpyObj<AdminUserAgreementService>('UserAgreementService', [
      'getUserAgreement',
      'getAllVersions',
      'updateUserAgreement'
    ]);
    mockUserAgreementService.getUserAgreement.and.returnValue(of(mockUserAgreement));
    mockUserAgreementService.getAllVersions.and.returnValue(of(['1', '2', '3']));
    mockUserAgreementService.updateUserAgreement.and.returnValue(of());

    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockMatDialog.open.and.returnValue({ afterClosed: () => of(true) });

    TestBed.configureTestingModule({
      declarations: [UbsAdminEditUserAgreementComponent, SpinnerComponent, MatProgressSpinner],
      providers: [
        { provide: AdminUserAgreementService, useValue: mockUserAgreementService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    });
    fixture = TestBed.createComponent(UbsAdminEditUserAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    mockUserAgreementService.getUserAgreement.calls.reset(); //because it is called in ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Confirmation modal on version change', () => {
    it('should open if there are unsaved changes', () => {
      component.getUserAgreementControl('Ua').markAsDirty();
      component.onVersionSelect({ target: { value: '1' } } as any);

      expect(mockMatDialog.open).toHaveBeenCalled();
    });

    it('should return previous version if user cancels', () => {
      console.log('calls', mockUserAgreementService.getUserAgreement.calls.count());

      mockMatDialog.open.and.returnValue({ afterClosed: () => of(false) });

      component.currentVersion = 'initial';
      component.getUserAgreementControl('Ua').markAsDirty();
      component.onVersionSelect({ target: { value: '1' } } as any);

      expect(component.selectedVersion).toBe('initial');
      expect(mockUserAgreementService.getUserAgreement).not.toHaveBeenCalled();
    });

    it('should load new version if user agrees', () => {
      mockMatDialog.open.and.returnValue({ afterClosed: () => of(true) });

      component.currentVersion = 'initial';

      component.getUserAgreementControl('Ua').markAsDirty();
      component.onVersionSelect({ target: { value: '1' } } as any);

      expect(component.selectedVersion).toBe('1');
      expect(mockUserAgreementService.getUserAgreement).toHaveBeenCalled();
    });

    it('should not open if there are no unsaved changes', () => {
      component.onVersionSelect({ target: { value: '1' } } as any);

      expect(mockMatDialog.open).not.toHaveBeenCalled();
      expect(component.selectedVersion).toBe('1');
      expect(component.currentVersion).toBe('1');
      expect(mockUserAgreementService.getUserAgreement).toHaveBeenCalled();
    });
  });
});
