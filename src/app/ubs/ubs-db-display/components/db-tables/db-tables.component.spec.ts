import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTablesComponent } from './db-tables.component';

describe('DbTablesComponent', () => {
  let component: DbTablesComponent;
  let fixture: ComponentFixture<DbTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DbTablesComponent]
    });
    fixture = TestBed.createComponent(DbTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
