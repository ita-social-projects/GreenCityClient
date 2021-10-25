import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsUserBonusesComponent } from './ubs-user-bonuses.component';
import { TranslateModule } from '@ngx-translate/core';
import { BonusesService } from './services/bonuses.service';
import { BonusesModel } from './models/BonusesModel';
import { of } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

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
  bonusesServiceMock = jasmine.createSpyObj('BonusesService', ['getUserBonuses']);
  bonusesServiceMock.getUserBonuses = () => of(testBonuses);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UbsUserBonusesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: BonusesService, useValue: bonusesServiceMock }]
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

  it('should call getBonusesData and return expected data', () => {
    component.getBonusesData();
    expect(component.dataSource.data).toEqual(testBonuses.ubsUserBonuses);
  });

  it('should call getBonusesData and return error', () => {
    bonusesServiceMock.getUserBonuses = () => ErrorObservable.create('error');
    component.getBonusesData();
    expect(component.isLoading).toEqual(false);
  });

  it('should something', () => {
    component.getBonusesData();
    expect(component.isLoading).toEqual(false);
  });
});
