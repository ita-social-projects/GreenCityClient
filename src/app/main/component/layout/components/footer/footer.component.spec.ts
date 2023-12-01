import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, Subject } from 'rxjs';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.languageSubject = new Subject();

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
