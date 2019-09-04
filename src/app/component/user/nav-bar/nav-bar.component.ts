import {Component, OnInit} from '@angular/core';
import {ModalService} from "../_modal/modal.service";
import {UserService} from "../../../service/user/user.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  private firstName: string = null;
  private userRole: string;

  constructor(private uService: UserService, private modalService: ModalService) {
  }

  ngOnInit() {
    this.firstName = window.localStorage.getItem("firstName");
    this.userRole = this.uService.getUserRole();
  }

  private signOut() {
    localStorage.clear();
    window.location.href = "/";
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

}
