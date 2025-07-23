import { TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MockTranslatePipe, MockTranslateService } from './mock-translate.mock';

export async function setupChatComponentTest() {
  await TestBed.configureTestingModule({
    imports: [ChatComponent, HttpClientTestingModule, FormsModule, NgForOf, NgClass, NgIf, NgStyle, MockTranslatePipe],
    providers: [{ provide: TranslateService, useClass: MockTranslateService }]
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

  return { fixture, component, httpMock };
}
