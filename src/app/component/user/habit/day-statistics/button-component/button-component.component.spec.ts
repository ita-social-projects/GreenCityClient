import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponentComponent } from './button-component.component';

describe('ButtonComponentComponent', () => {
  let component: ButtonComponentComponent;
  let fixture: ComponentFixture<ButtonComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
