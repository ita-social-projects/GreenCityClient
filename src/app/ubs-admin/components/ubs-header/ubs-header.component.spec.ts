import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsHeaderComponent } from './ubs-header.component';

describe('UbsHeaderComponent', () => {
  let component: UbsHeaderComponent;
  let fixture: ComponentFixture<UbsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
