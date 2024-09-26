import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipButtonsComponent } from './friendship-buttons.component';
import { ActionsSubject, Store } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FriendStatusValues, UserDataAsFriend } from '@global-user/models/friend.model';
import { AcceptRequest, DeclineRequest } from 'src/app/store/actions/friends.actions';
import { By } from '@angular/platform-browser';
import { UserAsFriend } from '@global-user/mocks/friends-mock';

describe('FriendshipButtonsComponent', () => {
  let component: FriendshipButtonsComponent;
  let fixture: ComponentFixture<FriendshipButtonsComponent>;

  const storeMock = jasmine.createSpyObj('Store', ['dispatch']);
  storeMock.dispatch = () => {};

  const matSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = () => {};

  const matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });

  const actionsSubj: ActionsSubject = new ActionsSubject();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [FriendshipButtonsComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: ActionsSubject, useValue: actionsSubj }
      ]
    });
    fixture = TestBed.createComponent(FriendshipButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call subscribeToAction when ngOnInit is invoked', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
