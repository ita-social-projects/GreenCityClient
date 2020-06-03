import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRowsComponent } from './stat-rows.component';

describe('StatRowsComponent', () => {
  let component: StatRowsComponent;
  let fixture: ComponentFixture<StatRowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatRowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
