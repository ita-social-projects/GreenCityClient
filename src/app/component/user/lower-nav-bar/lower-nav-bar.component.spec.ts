import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerNavBarComponent } from './lower-nav-bar.component';

describe('LowerNavBarComponent', () => {
  let component: LowerNavBarComponent;
  let fixture: ComponentFixture<LowerNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
