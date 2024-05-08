import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterSelectComponent } from './filter-select.component';
import { ElementRef, NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { of } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatOption } from '@angular/material/core';

describe('FilterSelectComponent', () => {
  let component: FilterSelectComponent;
  let fixture: ComponentFixture<FilterSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterSelectComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [TranslateService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSelectComponent);
    component = fixture.componentInstance;
    component.filter = {
      isAllSelected: false,
      options: [],
      name: 'testName',
      title: 'testTitle',
      selectAllOption: 'testSelectAllOption'
    };
    component.resetAllEvent = of(null);
    component.selectFilter = jasmine.createSpyObj('MatSelect', ['options']);
    component.selectFilter.options = new QueryList<MatOption>();
    component.selectFilter.options.forEach = jasmine.createSpy('forEach');
    component.selectLabel = { nativeElement: document.createElement('div') } as ElementRef;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset selectFilter value on resetAllEvent', () => {
    component.selectFilter = { value: 'test' } as any;
    component.ngOnInit();
    expect(component.selectFilter.value).toBeNull();
  });

  it('should toggle all selection', () => {
    component.selectFilter = { options: { first: { selected: false }, forEach: function () {} } } as any;
    component.toggleAllSelection();
    expect(component.filter.isAllSelected).toBe(false);
  });

  it('should update selected filters', () => {
    const option = { isActive: false };
    component.filter.options = [option];
    component.selectFilter = { options: { first: { select: function () {}, deselect: function () {} } } } as any;
    component.updateSelectedFilters(option);
    expect(option.isActive).toBe(true);
  });

  it('should return value on getLangValue', () => {
    const value = component.getLangValue('ua', 'en');
    expect(value).toBe('en');
  });
});
