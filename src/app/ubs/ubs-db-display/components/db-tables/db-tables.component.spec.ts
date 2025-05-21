import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTablesComponent } from './db-tables.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TableListComponent } from '../table-list/table-list.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

describe('DbTablesComponent', () => {
  let component: DbTablesComponent;
  let fixture: ComponentFixture<DbTablesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DbTablesComponent, TableListComponent, TableViewComponent],
      imports: [HttpClientTestingModule, FormsModule, InfiniteScrollModule]
    });
    fixture = TestBed.createComponent(DbTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
