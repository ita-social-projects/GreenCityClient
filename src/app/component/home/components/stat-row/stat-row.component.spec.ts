import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatRowComponent } from './stat-row.component';

describe('StatRowComponent', () => {
  let component: StatRowComponent;
  let fixture: ComponentFixture<StatRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
