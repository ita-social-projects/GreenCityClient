import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { TableCellReadonlyComponent } from './table-cell-readonly.component';

describe('TableCellReadonlyComponent', () => {
  let component: TableCellReadonlyComponent;
  let fixture: ComponentFixture<TableCellReadonlyComponent>;

  const fakeStrValue = '20Л - 0шт; 120л - 3ШТ';
  const fakeColumn = {
    key: 'fakeKey',
    ua: 'ua',
    en: 'en'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatTooltipModule],
      declarations: [TableCellReadonlyComponent, ServerTranslatePipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.optional = [fakeColumn];
    component.title = 'fakeKey';

    component.ngOnInit();

    expect(component.dataObj).toEqual(fakeColumn);
  });

  describe('ngOnChanges', () => {
    it('should translate in en', () => {
      component.key = 'bagsAmount';
      component.lang = 'en';
      component.title = fakeStrValue;

      component.ngOnChanges();

      expect(component.data).toBe('20L - 0p; 120L - 3p');
    });

    it('should not translate', () => {
      component.key = 'bagsAmount';
      component.lang = 'ua';
      component.title = fakeStrValue;

      component.ngOnChanges();

      expect(component.data).toBe(fakeStrValue);
    });
  });
});
