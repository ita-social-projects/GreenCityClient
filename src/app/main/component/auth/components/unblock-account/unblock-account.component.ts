import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { authImages, ubsAuthImages } from 'src/app/shared/image-paths/auth-images';
import { SignInIcons } from 'src/app/shared/image-paths/sign-in-icons';
import { unblockAccountLink } from 'src/app/main/links';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';

@Component({
  selector: 'app-unblock-account',
  templateUrl: './unblock-account.component.html',
  styleUrls: ['./unblock-account.component.scss']
})
export class UnblockAccountComponent implements OnInit {
  icons = SignInIcons;
  images = authImages;
  token: string;
  isUbs: boolean;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackBar: MatSnackBarService,
    private readonly http: HttpClient
  ) {}

  ngOnInit() {
    this.getToken();
    this.isUbs = this.router.url.includes('/ubs/');
    this.images = this.isUbs ? ubsAuthImages : authImages;
  }

  private getToken(): void {
    this.isUbs = this.router.url.includes('/ubs/');
    this.activatedRoute.queryParams.pipe(take(1)).subscribe((params) => {
      this.token = params[`token`];
    });
  }

  unblockAccount(token: string): Observable<void> {
    const body = {
      token
    };
    return this.http.post<void>(`${unblockAccountLink}`, body);
  }

  onButtonClick() {
    this.unblockAccount(this.token).subscribe({
      next: () => {
        this.snackBar.openSnackBar('successUnblockAccount');
        this.router.navigate(this.isUbs ? ['ubs'] : ['']);
      },
      error: () => {
        this.snackBar.openSnackBar('sendNewUnblockLetter');
        this.router.navigate(this.isUbs ? ['ubs'] : ['']);
      }
    });
  }

  closeModal(): void {
    this.router.navigate(this.isUbs ? ['ubs'] : ['']);
    this.snackBar.openSnackBar('exitConfirmUnblockAccount');
  }
}
