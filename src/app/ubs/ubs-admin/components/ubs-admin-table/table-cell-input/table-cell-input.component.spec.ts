import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCellInputComponent } from './table-cell-input.component';
import { AdminTableService } from '@ubs/ubs-admin/services/admin-table.service';
import { of } from 'rxjs';
import { IAlertInfo } from '@ubs/ubs-admin/models/edit-cell.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { IColumnBelonging } from '@ubs/ubs-admin/models/ubs-admin.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { provideMockStore } from '@ngrx/store/testing';

describe('TableCellInputComponent', () => {
  let component: TableCellInputComponent;
  let fixture: ComponentFixture<TableCellInputComponent>;
  let adminTableService: jasmine.SpyObj<AdminTableService>;

  beforeEach(() => {
    const adminTableServiceSpy = jasmine.createSpyObj('AdminTableService', ['howChangeCell', 'blockOrders', 'showTooltip']);
    const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    const mockModalRef = {
      componentInstance: {
        header: '',
        comment: ''
      },
      afterClosed: jasmine.createSpy().and.returnValue(of('New Comment'))
    };

    matDialogSpy.open.and.returnValue(mockModalRef as any);

    TestBed.configureTestingModule({
      declarations: [TableCellInputComponent, ServerTranslatePipe],
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useValue: { getTranslation: () => of({}) } }
        }),
        HttpClientTestingModule,
        MatDialogModule,
        MatTooltipModule
      ],
      providers: [
        TranslateService,
        TranslateStore,
        { provide: AdminTableService, useValue: adminTableServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        provideMockStore({ initialState: {} })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TableCellInputComponent);
    component = fixture.componentInstance;
    adminTableService = TestBed.inject(AdminTableService) as jasmine.SpyObj<AdminTableService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call showBlockedInfo.emit() when orders are blocked', () => {
    const mockColumn: IColumnBelonging = { key: 'test', ua: 'Test', en: 'Test' };
    const mockData = 'Test Comment';
    component.column = mockColumn;
    component.id = 1;
    component.ordersToChange = [1, 2, 3];
    component.isAllChecked = true;
    component.isUneditableStatus = false;
    component.data = mockData;

    adminTableService.howChangeCell.and.returnValue([1, 2, 3]);
    adminTableService.blockOrders.and.returnValue(of([{ message: 'Blocked' } as unknown as IAlertInfo]));

    spyOn(component.showBlockedInfo, 'emit');

    component.edit();

    expect(component.showBlockedInfo.emit).toHaveBeenCalledWith([{ message: 'Blocked' }]);
    expect(component.isEditable).toBeFalse();
  });

  it('should call onMouseEnter() and show tooltip', () => {
    const event = new MouseEvent('mouseenter');
    const tooltip = {};

    component.onMouseEnter(event, tooltip);

    expect(adminTableService.showTooltip).toHaveBeenCalledWith(event, tooltip, '12px Lato, sans-serif');
  });
});
