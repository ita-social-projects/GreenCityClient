import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsDetailsFormComponent } from './news-details-form.component';

describe('NewsDetailsFormComponent', () => {
  let component: NewsDetailsFormComponent;
  let fixture: ComponentFixture<NewsDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
