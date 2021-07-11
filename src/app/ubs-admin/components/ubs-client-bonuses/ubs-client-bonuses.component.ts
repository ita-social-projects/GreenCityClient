import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BonusesModel } from './models/BonusesModel';
import { BonuseModel } from './models/BonuseModel';
import { BonusesService } from './services/bonuses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ubs-client-bonuses',
  templateUrl: './ubs-client-bonuses.component.html',
  styleUrls: ['./ubs-client-bonuses.component.scss']
})
export class UbsClientBonusesComponent implements OnInit, AfterViewInit, OnDestroy  {
  displayedColumns: string[] = ['dateOfEnrollment', 'amount', 'reasone'];

  dataSource = new MatTableDataSource<BonuseModel>();
  totalBonuses: number;
  isLoading: boolean;
  subscription: Subscription;

  constructor(private bonusesService: BonusesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getBonusesData();
  }

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = ms;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'dateOfEnrollment':
          return new Date(item.dateOfEnrollment);
        default:
          return item[property];
      }
    };
  }

  getBonusesData() {
    this.subscription = this.bonusesService.getUserBonuses().subscribe((res: BonusesModel) => {
      this.dataSource.data = res.ubsUserBonuses;
      this.totalBonuses = res.userBonuses;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
