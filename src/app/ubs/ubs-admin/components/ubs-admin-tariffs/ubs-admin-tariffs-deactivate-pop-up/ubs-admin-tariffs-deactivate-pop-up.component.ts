import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ubs-admin-tariffs-deactivate-pop-up',
  templateUrl: './ubs-admin-tariffs-deactivate-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-deactivate-pop-up.component.scss']
})
export class UbsAdminTariffsDeactivatePopUpComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  ngOnInit(): void {}
}
