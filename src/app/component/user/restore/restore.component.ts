import { Component, OnInit } from '@angular/core';
import { RestorePasswordService } from '../../../service/auth/restore-password.service';
import { MatDialog } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.css']
})
export class RestoreComponent implements OnInit {
  email: string;
  //emailErrorMessageBackEnd: string;
  //loadingAnim = false;
  //backEndError: string;

  constructor(
  	private restorePasswordService: RestorePasswordService, 
  	private matDialogRef: MatDialogRef<RestoreComponent>) {}

  sentEmail() {
    this.restorePasswordService.sendEmailForRestore(this.email);
  }

  ngOnInit() {
  	  	//this.userOwnRestore = new UserOwnRestore();
    	//this.setNullAllMessage();
  }

      //private restore(userOwnRestore: UserOwnRestore) {
    //this.setNullAllMessage();
    //this.loadingAnim = true;
    //this.userOwnSecurityService.signUp(userOwnRestore).subscribe(
     // () => {
        //this.loadingAnim = false;
        //this.router.navigateByUrl('/auth/submit-email').then(r => r);
      //},
      //(errors: HttpErrorResponse) => {
        //errors.error.forEach(error => {
                //this.emailErrorMessageBackEnd = error.message;            
          
       // });
        //this.loadingAnim = false;     
    
//} );
//}
    //private setNullAllMessage() {
    //this.emailErrorMessageBackEnd = null;
  //}

    public close() {
  	this.matDialogRef.close();
  }
}

