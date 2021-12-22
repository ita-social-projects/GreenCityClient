import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BonusesModel } from './models/BonusesModel';
import { BonuseModel } from './models/BonuseModel';
import { BonusesService } from './services/bonuses.service';
import { Subject, throwError } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

@Component({
  selector: 'app-ubs-user-bonuses',
  templateUrl: './ubs-user-bonuses.component.html',
  styleUrls: ['./ubs-user-bonuses.component.scss']
})
export class UbsUserBonusesComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['dateOfEnrollment', 'amount', 'reason'];
  dataSource = new MatTableDataSource<BonuseModel>();
  totalBonuses: number;
  isLoading = true;
  bonusesList: BonuseModel[];
  destroy: Subject<boolean> = new Subject<boolean>();

  constructor(private snackBar: MatSnackBarComponent, private bonusesService: BonusesService) {}

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getBonusesData();
    this.dataSource.sort = this.sort;
  }

  getBonusesData() {
    this.isLoading = true;
    this.bonusesService
      .getUserBonuses()
      .pipe(takeUntil(this.destroy))
      .subscribe(
        (res: BonusesModel) => {
          this.bonusesList = res.ubsUserBonuses;
          this.dataSource.data = res.ubsUserBonuses;
          this.totalBonuses = res.userBonuses;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.snackBar.openSnackBar('Oops, something went wrong. Please reload page or try again later.');
          return throwError(error);
        }
      );
  }

  sortData(sort: Sort) {
    const data = this.bonusesList.slice();
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(new Date(a.dateOfEnrollment).getDate(), new Date(b.dateOfEnrollment).getDate(), isAsc);
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
