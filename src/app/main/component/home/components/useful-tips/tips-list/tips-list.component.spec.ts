import { TipsCardComponent } from '../tips-card/tips-card.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsListComponent } from './tips-list.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { TranslateModule } from '@ngx-translate/core';

describe('TipsListComponent', () => {
  let component: TipsListComponent;
  let fixture: ComponentFixture<TipsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipsListComponent, TipsCardComponent],
      imports: [SwiperModule, TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
