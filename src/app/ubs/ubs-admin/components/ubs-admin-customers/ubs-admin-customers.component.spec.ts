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
    // @ts-ignore
    const spy = spyOn(component, 'setDisplayedColumns');
    // @ts-ignore
    const spy1 = spyOn(component, 'getTable');
    // @ts-ignore
    const spy2 = spyOn(component, 'initFilterForm');
    // @ts-ignore
    const spy3 = spyOn(component, 'onCreateGroupFormValueChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });

  it('method getSortingData should invoke methods', () => {
    // @ts-ignore
    const spy = spyOn(component, 'getTable');
    component.getSortingData('', '');
    expect(spy).toHaveBeenCalled();
  });

  it('method togglePopUp should toggle display', () => {
    component.isFiltersOpened = false;
    component.togglePopUp();
    expect(component.isFiltersOpened).toBeTruthy();
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
    // @ts-ignore
    expect(component.filterForm.getRawValue()).toEqual(component.initialFilterValues);
  });

  it('onScroll should add 1 to currentPage', () => {
    component.isUpdate = false;
    component.currentPage = 1;
    // @ts-ignore
    component.totalPages = 2;
    component.onScroll();
    expect(component.currentPage).toBe(2);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy$, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy$.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
