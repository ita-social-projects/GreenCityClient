import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsComponent } from './ubs-admin-tariffs.component';
import { MatDialog } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UbsAdminTariffsComponent', () => {
  let component: UbsAdminTariffsComponent;
  let fixture: ComponentFixture<UbsAdminTariffsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsComponent],
      imports: [OverlayModule, MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [{ provide: MatDialog }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
