import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddressComponent } from './address.component';
import { LanguageService } from 'src/app/shared/i18n/language.service';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { of } from 'rxjs';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLangObs']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => valUa;
  languageServiceMock.getCurrentLangObs = () => of('ua');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
      declarations: [AddressComponent, LangValueDirective]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;

    component.address = {
      city: 'Місто',
      cityEn: 'City',
      district: 'Район',
      districtEn: 'District',
      region: 'Область',
      regionEn: 'Region',
      entranceNumber: '1',
      street: 'Вулиця',
      streetEn: 'Street',
      houseCorpus: 'A',
      houseNumber: '10',
      actual: true,
      coordinates: {
        latitude: 50.45,
        longitude: 30.52
      }
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
