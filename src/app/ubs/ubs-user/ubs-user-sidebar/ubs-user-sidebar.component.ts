import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { UserMessagesService } from '../services/user-messages.service';
import { JwtService } from '@global-service/jwt/jwt.service';
import { listElementsUser, listElementsUserMobile } from '../../ubs/models/ubs-sidebar-links';

@Component({
  selector: 'app-ubs-user-sidebar',
  templateUrl: './ubs-user-sidebar.component.html'
})
export class UbsUserSidebarComponent extends UbsBaseSidebarComponent {
  public listElementsUser = listElementsUser;
  public listElementsUserMobile = listElementsUserMobile;

  constructor(public service: UserMessagesService, public breakpointObserver: BreakpointObserver, public jwtService: JwtService) {
    super(service, breakpointObserver, jwtService);
  }
}
