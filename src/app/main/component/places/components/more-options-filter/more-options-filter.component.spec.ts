import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MoreOptionsFilterComponent } from './more-options-filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';

describe('MoreOptionsFilterComponent', () => {
  let component: MoreOptionsFilterComponent;
  let fixture: ComponentFixture<MoreOptionsFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MoreOptionsFilterComponent],
      imports: [TranslateModule.forRoot(), MatMenuModule, MatCheckboxModule, MatSliderModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOptionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
