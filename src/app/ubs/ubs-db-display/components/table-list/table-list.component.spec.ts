import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableListComponent } from './table-list.component';

describe('TableListComponent', () => {
  let component: TableListComponent;
  let fixture: ComponentFixture<TableListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableListComponent]
    });
    fixture = TestBed.createComponent(TableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
