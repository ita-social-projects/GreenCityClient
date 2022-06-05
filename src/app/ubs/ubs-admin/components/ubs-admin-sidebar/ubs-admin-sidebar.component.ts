import { AfterViewInit, Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { UserMessagesService } from '../../../../ubs/ubs-user/services/user-messages.service';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { JwtService } from '@global-service/jwt/jwt.service';
import { listElementsAdmin } from '../../../ubs/models/ubs-sidebar-links';

// @ts-ignore
@Component({
  selector: 'app-ubs-admin-sidebar',
  templateUrl: './ubs-admin-sidebar.component.html'
})
export class UbsAdminSidebarComponent extends UbsBaseSidebarComponent implements AfterViewInit {
  public listElementsAdmin = listElementsAdmin;

  constructor(public service: UserMessagesService, public breakpointObserver: BreakpointObserver, public jwtService: JwtService) {
    super(service, breakpointObserver, jwtService);
  }
}
