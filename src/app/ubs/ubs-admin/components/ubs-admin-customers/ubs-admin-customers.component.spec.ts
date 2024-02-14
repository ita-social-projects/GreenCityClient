import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { UbsAdminCustomersComponent } from './ubs-admin-customers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('UbsAdminCustomersComponent', () => {
  let component: UbsAdminCustomersComponent;
  let fixture: ComponentFixture<UbsAdminCustomersComponent>;
  let dialogMock: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatTableModule,
        SharedModule,
        TranslateModule.forRoot(),
        InfiniteScrollModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule
      ],
      declarations: [UbsAdminCustomersComponent],
      providers: [],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomersComponent);
    component = fixture.componentInstance;
    dialogMock = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('detects changes', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, 'detectChanges');

    component.ngAfterViewChecked();

    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('method ngOnInit should invoke methods', () => {
    const spy = spyOn(component as any, 'setDisplayedColumns');
    const spy1 = spyOn(component as any, 'getTable');
    const spy2 = spyOn(component as any, 'initFilterForm');
    const spy3 = spyOn(component as any, 'onCreateGroupFormValueChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('method getSortingData should invoke methods', () => {
    const spy = spyOn(component as any, 'getTable');
    component.getSortingData('', '');
    expect(spy).toHaveBeenCalled();
  });

  it('method togglePopUp should toggle display', () => {
    component.display = 'block';
    component.togglePopUp();
    expect(component.display).toBe('none');
  });

  it('method initFilterForm should assign data to filters', () => {
    (component as any).initFilterForm();
    expect(component.filters).toBe(component.filterForm.value);
  });

  it('method onDeleteFilter should reset data in filterForm', () => {
    component.onDeleteFilter('bonusesFrom', 'bonusesTo');
    expect(component.filterForm.value.bonusesFrom).toBe('');
    expect(component.filterForm.value.bonusesTo).toBe('');
  });

  it('method onClearFilters should reset filterForm', () => {
    component.onClearFilters();
    expect((component as any).filterForm.getRawValue()).toEqual((component as any).initialFilterValues);
  });

  it('onScroll should add 1 to currentPage', () => {
    component.isUpdate = false;
    component.currentPage = 1;
    (component as any).totalPages = 2;
    component.onScroll();
    expect(component.currentPage).toBe(2);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    (component as any).destroy = new Subject<boolean>();
    spyOn((component as any).destroy$, 'unsubscribe');
    component.ngOnDestroy();
    expect((component as any).destroy$.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
