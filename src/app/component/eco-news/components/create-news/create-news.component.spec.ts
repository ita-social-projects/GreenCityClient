import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewsComponent } from './create-news.component';

describe('CreateNewsComponent', () => {
  let component: CreateNewsComponent;
  let fixture: ComponentFixture<CreateNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
