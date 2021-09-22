import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsComponent } from './ubs-admin-tariffs.component';
import { MatDialog } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('UbsAdminTariffsComponent', () => {
  let component: UbsAdminTariffsComponent;
  let fixture: ComponentFixture<UbsAdminTariffsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsComponent],
      imports: [OverlayModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialog }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
