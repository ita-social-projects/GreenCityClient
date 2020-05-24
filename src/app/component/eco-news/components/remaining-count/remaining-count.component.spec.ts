import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemainingCountComponent } from './remaining-count.component';

describe('RemainingCountComponent', () => {
  let component: RemainingCountComponent;
  let fixture: ComponentFixture<RemainingCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemainingCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemainingCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
