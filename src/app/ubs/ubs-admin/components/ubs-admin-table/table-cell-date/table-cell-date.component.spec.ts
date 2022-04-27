import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCellDateComponent } from './table-cell-date.component';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';

describe('TableCellDateComponent', () => {
  let component: TableCellDateComponent;
  let fixture: ComponentFixture<TableCellDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCellDateComponent],
      imports: [HttpClientModule],
      providers: [AdminTableService]
    }).compileComponents();
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date());

    fixture = TestBed.createComponent(TableCellDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('TableCellDateComponent', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should set current date to min attribute ', () => {
      component.isEditable = true;
      fixture.detectChanges();
      const inputElem = fixture.debugElement.nativeElement.querySelector('#date-input');

      expect(inputElem.min).toEqual(new Date().toString());
    });
  });
});
