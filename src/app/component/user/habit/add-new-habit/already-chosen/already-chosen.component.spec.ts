import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyChosenComponent } from './already-chosen.component';

describe('AlreadyChosenComponent', () => {
  let component: AlreadyChosenComponent;
  let fixture: ComponentFixture<AlreadyChosenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyChosenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyChosenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
