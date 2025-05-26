import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbTablesComponent } from './db-tables.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TableListComponent } from '../table-list/table-list.component';
import { TableViewComponent } from '../table-view/table-view.component';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

describe('DbTablesComponent', () => {
  let component: DbTablesComponent;
  let fixture: ComponentFixture<DbTablesComponent>;
  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DbTablesComponent, TableListComponent, TableViewComponent],
      imports: [HttpClientTestingModule, FormsModule, InfiniteScrollModule],
      providers: [{ provide: MatSnackBarService, useValue: MatSnackBarMock }]
    });
    fixture = TestBed.createComponent(DbTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
