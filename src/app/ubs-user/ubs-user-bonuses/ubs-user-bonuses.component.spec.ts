import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsUserBonusesComponent } from './ubs-user-bonuses.component';
import { TranslateModule } from '@ngx-translate/core';
import { BonusesService } from './services/bonuses.service';
import { BonusesModel } from './models/BonusesModel';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { By } from '@angular/platform-browser';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { of, Subject } from 'rxjs';
import { EMPTY } from 'rxjs';

const testBonuses: BonusesModel = {
  ubsUserBonuses: [
    {
      amount: 40,
      dateOfEnrollment: new Date(),
      numberOfOrder: 10
    }
  ],
  userBonuses: 100
};

describe('UbsUserBonusesComponent', () => {
  let component: UbsUserBonusesComponent;
  let fixture: ComponentFixture<UbsUserBonusesComponent>;
  let bonusesServiceMock: BonusesService;
  let matSnackBarMock: MatSnackBarComponent;
  bonusesServiceMock = jasmine.createSpyObj('BonusesService', ['getUserBonuses']);
  bonusesServiceMock.getUserBonuses = () => of(testBonuses);
  matSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = (type: string) => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UbsUserBonusesComponent, MatSnackBarComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: BonusesService, useValue: bonusesServiceMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsUserBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should call getBonusesData', () => {
    const spy = spyOn(component, 'getBonusesData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getBonusesData and return expected data', () => {
    bonusesServiceMock.getUserBonuses = () => of(testBonuses);
    component.getBonusesData();
    expect(component.dataSource.data).toEqual(testBonuses.ubsUserBonuses);
    expect(component.totalBonuses).toEqual(testBonuses.userBonuses);
  });

  it('should call getBonusesData and return error', () => {
    bonusesServiceMock.getUserBonuses = () => ErrorObservable.create('error');
    component.getBonusesData();
    expect(component.isLoading).toEqual(false);
  });

  it('should call openSnackBar in case error', () => {
    bonusesServiceMock.getUserBonuses = () => ErrorObservable.create('error');
    const spy = spyOn(matSnackBarMock, 'openSnackBar').and.callFake(() => {
      return EMPTY;
    });
    component.getBonusesData();
    expect(spy).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    component.destroy = new Subject<boolean>();
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
