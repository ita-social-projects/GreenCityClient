import { Component, inject, OnInit } from '@angular/core';
import { AdminUserAgreementService } from '@ubs/ubs-admin/services/admin-homepage-settings/admin-homepage-settings.service';
import { THomepageContent } from '@ubs/ubs-admin/models/homepage-settings.interface';

@Component({
  selector: 'app-ubs-admin-edit-homepage',
  templateUrl: './ubs-admin-edit-homepage.component.html',
  styleUrls: ['./ubs-admin-edit-homepage.component.scss']
})
export class UbsAdminEditHomepageComponent implements OnInit {
  private adminHomepageSettingsService: AdminUserAgreementService = inject(AdminUserAgreementService);

  homepageContent: THomepageContent;

  ngOnInit() {
    this.getHomepageContent();
  }

  getHomepageContent() {
    this.adminHomepageSettingsService.getHomepageContent().subscribe((homepageContent) => {
      this.homepageContent = homepageContent;
      console.log(this.homepageContent);
    });
  }
}
