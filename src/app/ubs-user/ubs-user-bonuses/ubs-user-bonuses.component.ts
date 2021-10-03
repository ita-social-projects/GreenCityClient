import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BonusesModel } from './models/BonusesModel';
import { BonuseModel } from './models/BonuseModel';
import { BonusesService } from './services/bonuses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ubs-user-bonuses',
  templateUrl: './ubs-user-bonuses.component.html',
  styleUrls: ['./ubs-user-bonuses.component.scss']
})
export class UbsUserBonusesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['dateOfEnrollment', 'amount', 'reason'];

  dataSource = new MatTableDataSource<BonuseModel>();
  totalBonuses: number;
  isLoading = true;
  subscription: Subscription;

  constructor(private bonusesService: BonusesService) {}

  ngOnInit() {
    this.getBonusesData();
  }

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    if (this.dataSource) {
      this.dataSource.sort = ms;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'dateOfEnrollment') {
        return new Date(item.dateOfEnrollment);
      } else {
        return item[property];
      }
    };
  }

  getBonusesData() {
    this.isLoading = true;
    this.subscription = this.bonusesService.getUserBonuses().subscribe(
      (res: BonusesModel) => {
        this.dataSource.data = res.ubsUserBonuses;
        this.totalBonuses = res.userBonuses;
        this.isLoading = false;
      },
      (err: any) => {
        this.isLoading = false;
        console.log(err);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
