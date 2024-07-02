import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { UbsAdminGoBackModalComponent } from './ubs-admin-go-back-modal.component';
import { AdminTableService } from '@ubs/ubs-admin/services/admin-table.service';
import { TranslateModule } from '@ngx-translate/core';

class MatDialogRefMock {
  close(value?: any) {}
}

class AdminTableServiceMock {
  cancelEdit(orderIds: number[]) {
    return of(true);
  }
}

describe('UbsAdminGoBackModalComponent', () => {
  let component: UbsAdminGoBackModalComponent;
  let fixture: ComponentFixture<UbsAdminGoBackModalComponent>;
  let dialogRef: MatDialogRef<UbsAdminGoBackModalComponent>;
  let adminTableService: AdminTableService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [UbsAdminGoBackModalComponent],
      providers: [
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        { provide: AdminTableService, useClass: AdminTableServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: { orderIds: [1, 2, 3] } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminGoBackModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    adminTableService = TestBed.inject(AdminTableService);
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog with false when doNotDiscardChanges is called', () => {
    spyOn(dialogRef, 'close');
    component.doNotDiscardChanges();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should call cancelEdit of adminTableService and close the dialog with true when discardChanges is called', () => {
    spyOn(dialogRef, 'close');
    spyOn(adminTableService, 'cancelEdit').and.callThrough();
    component.discardChanges();
    expect(adminTableService.cancelEdit).toHaveBeenCalledWith([1, 2, 3]);
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
