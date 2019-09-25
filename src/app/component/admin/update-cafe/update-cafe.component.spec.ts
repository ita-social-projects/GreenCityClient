import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCafeComponent } from './update-cafe.component';

describe('UpdateCafeComponent', () => {
  let component: UpdateCafeComponent;
  let fixture: ComponentFixture<UpdateCafeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCafeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCafeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
