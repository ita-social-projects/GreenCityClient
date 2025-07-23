import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { CurrentChatComponent } from './current-chat.component';

class MockTranslateService {
  get(key: any) {
    return of(key);
  }

  instant(key: any) {
    return key;
  }

  use(lang: string) {
    return lang;
  }
}

class MockStore {
  select = jasmine.createSpy().and.returnValue(of({}));
  dispatch = jasmine.createSpy();
}

describe('CurrentChatComponent', () => {
  let component: CurrentChatComponent;
  let fixture: ComponentFixture<CurrentChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentChatComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: Store, useClass: MockStore }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
