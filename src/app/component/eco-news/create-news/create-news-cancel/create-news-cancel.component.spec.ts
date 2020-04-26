import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsCancelComponent } from './create-news-cancel.component';

describe('CreateNewsCancelComponent', () => {
  let component: CreateNewsCancelComponent;
  let fixture: ComponentFixture<CreateNewsCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewsCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewsCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
