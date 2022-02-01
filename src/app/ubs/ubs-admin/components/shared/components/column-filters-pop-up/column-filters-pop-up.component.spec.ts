import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFiltersPopUpComponent } from './column-filters-pop-up.component';

describe('ColumnFiltersPopUpComponent', () => {
  let component: ColumnFiltersPopUpComponent;
  let fixture: ComponentFixture<ColumnFiltersPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnFiltersPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFiltersPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
