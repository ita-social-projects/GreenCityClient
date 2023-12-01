import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FilterListByLangPipe } from 'src/app/shared/sort-list-by-lang/filter-list-by-lang.pipe';

import { DialogTariffComponent } from './dialog-tariff.component';

describe('DialogTariffComponent', () => {
  let component: DialogTariffComponent;
  let fixture: ComponentFixture<DialogTariffComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DialogTariffComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTariffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
