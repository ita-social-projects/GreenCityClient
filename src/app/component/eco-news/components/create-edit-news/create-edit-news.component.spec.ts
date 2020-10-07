import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditNewsComponent } from './create-edit-news.component';

describe('CreateEditNewsComponent', () => {
  let component: CreateEditNewsComponent;
  let fixture: ComponentFixture<CreateEditNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
