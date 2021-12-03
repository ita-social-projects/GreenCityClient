import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MoreOptionsFilterComponent } from './more-options-filter.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

describe('MoreOptionsFilterComponent', () => {
  let component: MoreOptionsFilterComponent;
  let fixture: ComponentFixture<MoreOptionsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoreOptionsFilterComponent],
      imports: [TranslateModule.forRoot(), MatMenuModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOptionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
