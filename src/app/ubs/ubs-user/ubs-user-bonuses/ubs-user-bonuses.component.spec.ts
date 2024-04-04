import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsUserBonusesComponent } from './ubs-user-bonuses.component';
import { TranslateModule } from '@ngx-translate/core';
import { BonusesService } from './services/bonuses.service';
import { BonusesModel } from './models/BonusesModel';
import { throwError } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { of, Subject } from 'rxjs';
import { EMPTY } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

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
  let router: Router;

  const bonusesServiceMock: BonusesService = jasmine.createSpyObj('BonusesService', ['getUserBonusesWithPaymentHistory']);
  bonusesServiceMock.getUserBonusesWithPaymentHistory = () => of(testBonuses);
  const matSnackBarMock: MatSnackBarComponent = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  matSnackBarMock.openSnackBar = (type: string) => {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UbsUserBonusesComponent, MatSnackBarComponent],
      imports: [MatTableModule, TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: BonusesService, useValue: bonusesServiceMock },
        { provide: MatSnackBarComponent, useValue: matSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  const buildComponent = async () => {
    await TestBed.compileComponents();
    fixture = TestBed.createComponent(UbsUserBonusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  };

  it('should create', async () => {
    await buildComponent();
    expect(component).toBeTruthy();
  });

  it('method ngOnInit should call getBonusesData', async () => {
    await buildComponent();
    const spy = spyOn(component, 'getBonusesData');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getBonusesData and return expected data', async () => {
    await buildComponent();
    bonusesServiceMock.getUserBonusesWithPaymentHistory = () => of(testBonuses);
    component.getBonusesData();
    expect(component.dataSource.data).toEqual(testBonuses.ubsUserBonuses);
    expect(component.totalBonuses).toEqual(testBonuses.userBonuses);
  });

  it('should call getBonusesData and return error', async () => {
    await buildComponent();
    bonusesServiceMock.getUserBonusesWithPaymentHistory = () => throwError(console.error);
    component.getBonusesData();
    expect(component.isLoading).toEqual(false);
  });

  it('should call openSnackBar in case error', async () => {
    await buildComponent();
    bonusesServiceMock.getUserBonusesWithPaymentHistory = () => throwError('error');
    const spy = spyOn(matSnackBarMock, 'openSnackBar').and.callFake(() => {
      return EMPTY;
    });
    component.getBonusesData();
    expect(spy).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', async () => {
    await buildComponent();
    component.destroy = new Subject<boolean>();
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
