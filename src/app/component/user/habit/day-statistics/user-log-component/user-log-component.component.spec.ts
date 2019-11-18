import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogComponentComponent } from './user-log-component.component';

describe('UserLogComponentComponent', () => {
  let component: UserLogComponentComponent;
  let fixture: ComponentFixture<UserLogComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLogComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
