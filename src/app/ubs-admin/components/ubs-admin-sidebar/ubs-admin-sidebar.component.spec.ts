import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatCheckboxModule, MatIconModule, MatPaginatorModule, MatSidenavModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { UbsAdminTableComponent } from '../ubs-admin-table/ubs-admin-table.component';
import { UbsHeaderComponent } from '../ubs-header/ubs-header.component';
import { UbsAdminSidebarComponent } from './ubs-admin-sidebar.component';

describe('UbsAdminSidebarComponent', () => {
  let component: UbsAdminSidebarComponent;
  let fixture: ComponentFixture<UbsAdminSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSidenavModule,
        MatIconModule,
        MatTableModule,
        DragDropModule,
        MatCheckboxModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SharedModule
      ],
      declarations: [UbsAdminSidebarComponent, UbsAdminTableComponent, UbsHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
