import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EcoEventsComponent } from './eco-events.component';
import { EcoEventsItemComponent } from './eco-events-item/eco-events-item.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NewsService } from '@global-service/news/news.service';

describe('EcoEventsComponent', () => {
  let component: EcoEventsComponent;
  let fixture: ComponentFixture<EcoEventsComponent>;
  const newsServiceMock = jasmine.createSpyObj('NewsServiceMock', ['loadLatestNews']);
  newsServiceMock.loadLatestNews.and.returnValue(of());

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EcoEventsComponent, EcoEventsItemComponent],
      imports: [RouterTestingModule, HttpClientModule, TranslateModule.forRoot()],
      providers: [{ provide: NewsService, useValue: newsServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
