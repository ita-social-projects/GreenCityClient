import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
// import { ProposeCafeComponent } from '../../../core/components/propose-cafe/propose-cafe.component';

import { AdminNavComponent } from './admin-nav.component';

describe('AdminNavComponent', () => {
  let component: AdminNavComponent;
  let fixture: ComponentFixture<AdminNavComponent>;
  let dialog: MatDialog;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNavComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: MatDialog, useValue: { open: () => of({ id: 1 }) } }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialog = TestBed.inject(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should open dialog on trigger', () => {
  //   spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ id: 1 }) } as MatDialogRef<typeof ProposeCafeComponent>);
  //   component.openDialog();
  //   expect(dialog.open).toHaveBeenCalled();
  // });
});
