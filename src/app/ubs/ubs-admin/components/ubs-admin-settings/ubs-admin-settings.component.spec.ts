import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminSettingsComponent } from './ubs-admin-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { UbsAdminEditUserAgreementComponent } from '@ubs/ubs-admin/components/ubs-admin-edit-user-agreement/ubs-admin-edit-user-agreement.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UbsAdminEditHomepageComponent } from '@ubs/ubs-admin/components/ubs-admin-edit/ubs-admin-edit-homepage/ubs-admin-edit-homepage.component';
import { UbsAdminEditTelegramBotComponent } from '@ubs/ubs-admin/components/ubs-admin-edit/ubs-admin-edit-telegram-bot/ubs-admin-edit-telegram-bot.component';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('UbsAdminSettingsComponent', () => {
  let component: UbsAdminSettingsComponent;
  let fixture: ComponentFixture<UbsAdminSettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        UbsAdminSettingsComponent,
        UbsAdminEditUserAgreementComponent,
        UbsAdminEditHomepageComponent,
        UbsAdminEditTelegramBotComponent,
        SpinnerComponent
      ],
      imports: [TranslateModule.forRoot(), MatDialogModule, HttpClientTestingModule, MatProgressSpinnerModule]
    });
    fixture = TestBed.createComponent(UbsAdminSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
