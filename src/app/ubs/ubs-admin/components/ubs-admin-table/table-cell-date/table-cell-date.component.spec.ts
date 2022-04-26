import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCellDateComponent } from './table-cell-date.component';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';

describe('TableCellDateComponent', () => {
  let component: TableCellDateComponent;
  let fixture: ComponentFixture<TableCellDateComponent>;
  const mockDate = '2022-01-01';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCellDateComponent],
      imports: [HttpClientModule],
      providers: [AdminTableService]
    }).compileComponents();
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(mockDate));

    fixture = TestBed.createComponent(TableCellDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  fdescribe('TableCellDateComponent', () => {
    it('should create component', () => {
      component.doneOrCanceled = false;
      component.isEditable = false;

      expect(component).toBeTruthy();
    });

    it('should set current date to min attribute ', () => {
      component.isEditable = true;
      fixture.detectChanges();
      const inputElem = fixture.debugElement.nativeElement.querySelector('#date-input');

      expect(inputElem.min).toBe(mockDate);
    });
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
});
