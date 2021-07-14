import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRowComponent } from './stat-row.component';

describe('StatRowComponent', () => {
  let component: StatRowComponent;
  let fixture: ComponentFixture<StatRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatRowComponent],
      imports: [TranslateModule.forRoot()],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRowComponent);
    component = fixture.componentInstance;
    component.stat = {
      action: 'test',
      caption: 'test',
      count: 'test',
      question: 'test',
      iconPath: 'test',
      locationText: 'test',
    };
    component.index = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
