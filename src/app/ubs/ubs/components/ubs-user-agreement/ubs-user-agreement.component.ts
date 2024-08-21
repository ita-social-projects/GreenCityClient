import { Component, inject, OnInit } from '@angular/core';
import { TUserAgreementText } from '@ubs/ubs-admin/models/user-agreement.interface';
import { UserAgreementService } from '@ubs/ubs/services/user-agreement/user-agreement.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-ubs-user-agreement',
  templateUrl: './ubs-user-agreement.component.html',
  styleUrls: ['./ubs-user-agreement.component.scss']
})
export class UbsUserAgreementComponent implements OnInit {
  private userAgreementService: UserAgreementService = inject(UserAgreementService);

  userAgreement: TUserAgreementText;

  ngOnInit(): void {
    this.userAgreementService
      .getUserAgreement()
      .pipe(take(1))
      .subscribe((userAgreement) => {
        this.userAgreement = userAgreement;
      });
  }
}
