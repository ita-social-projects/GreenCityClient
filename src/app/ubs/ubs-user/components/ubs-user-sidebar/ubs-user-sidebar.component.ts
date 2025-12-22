import { Component } from '@angular/core';
import { UbsBaseSidebarComponent } from '@ubs/shared/components/ubs-base-sidebar/ubs-base-sidebar.component';
import { UserMessagesService } from '../../services/user-messages.service';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { listElementsUser, listElementsUserMobile } from '../../../ubs/models/ubs-sidebar-links';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-user-sidebar',
  templateUrl: './ubs-user-sidebar.component.html'
})
export class UbsUserSidebarComponent extends UbsBaseSidebarComponent {
  listElementsUser = listElementsUser;
  listElementsUserMobile = listElementsUserMobile;

  constructor(
    public service: UserMessagesService,
    public jwtService: JwtService,
    protected router: Router
  ) {
    super(service, jwtService, router);
  }
}
