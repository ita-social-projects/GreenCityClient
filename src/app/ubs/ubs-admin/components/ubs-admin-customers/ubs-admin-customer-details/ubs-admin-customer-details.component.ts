import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ubs-admin-customer-details',
  templateUrl: './ubs-admin-customer-details.component.html',
  styleUrls: ['./ubs-admin-customer-details.component.scss']
})
export class UbsAdminCustomerDetailsComponent implements OnInit {
  customer: any;

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly location: Location,
    public readonly dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.customer = this.localStorageService.getCustomer();
  }

  goBack(): void {
    this.localStorageService.removeCurrentCustomer();
    this.location.back();
  }
  onOpenChat(chatId: number) {
    this.router.navigate(['ubs/admin', 'chat-page'], { state: { selectedChatId: chatId } });
  }
}
