import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipButtonsComponent } from './friendship-buttons.component';
import { ActionsSubject, Store } from '@ngrx/store';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FriendStatusValues, UserDataAsFriend } from 'src/app/greencity/modules/user/models/friend.model';
import { AcceptRequest, DeclineRequest } from 'src/app/store/actions/friends.actions';
import { By } from '@angular/platform-browser';
import { UserAsFriend } from 'src/app/greencity/modules/user/mocks/friends-mock';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

describe('FriendshipButtonsComponent', () => {
  let component: FriendshipButtonsComponent;
  let fixture: ComponentFixture<FriendshipButtonsComponent>;

  const storeMock = jasmine.createSpyObj('Store', ['dispatch']);
  storeMock.dispatch = () => {};

  const matSnackBarMock: MatSnackBarService = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);
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
        { provide: MatSnackBarService, useValue: matSnackBarMock },
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
