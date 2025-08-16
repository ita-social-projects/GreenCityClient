import { TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle, Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe, MockTranslateService } from './mock-translate.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { userRoleSelector } from 'src/app/store/selectors/auth.selectors';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

export async function setupChatComponentTest(mockRole: string | null = null) {
  await TestBed.configureTestingModule({
    imports: [
      ChatComponent,
      HttpClientTestingModule,
      FormsModule,
      NgForOf,
      NgClass,
      NgIf,
      NgStyle,
      MockTranslatePipe,
      RouterTestingModule.withRoutes([{ path: 'ubs/admin/chat-page/:id', component: ChatComponent }])
    ],
    providers: [
      { provide: TranslateService, useClass: MockTranslateService },
      { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } },
      { provide: Location },
      { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) },
      provideMockStore({
        selectors: [
          {
            selector: userRoleSelector,
            value: mockRole
          }
        ]
      })
    ]
  })
    .overrideComponent(ChatComponent, {
      set: {
        imports: [NgForOf, FormsModule, NgClass, NgIf, HttpClientTestingModule, NgStyle, MockTranslatePipe]
      }
    })
    .compileComponents();

  const fixture = TestBed.createComponent(ChatComponent);
  const component = fixture.componentInstance;
  const httpMock = TestBed.inject(HttpTestingController);
  const location = TestBed.inject(Location);
  const router = TestBed.inject(Router);

  return { fixture, component, httpMock, location, router };
}
