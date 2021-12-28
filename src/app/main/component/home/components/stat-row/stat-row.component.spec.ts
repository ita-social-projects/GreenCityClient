import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRowComponent } from './stat-row.component';

describe('StatRowComponent', () => {
  let component: StatRowComponent;
  let fixture: ComponentFixture<StatRowComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatRowComponent],
      imports: [TranslateModule.forRoot()]
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
      iconPath: defaultImagePath,
      locationText: 'test'
    };
    component.index = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
