import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { DomSanitizer } from '@angular/platform-browser';

interface IpdfFile {
  pdfFile: string;
}

@Component({
  selector: 'app-show-pdf-pop-up',
  templateUrl: './show-pdf-pop-up.component.html',
  styleUrls: ['./show-pdf-pop-up.component.scss']
})
export class ShowPdfPopUpComponent implements OnInit {
  pdfFile: string;

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ShowPdfPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IpdfFile
  ) {}

  ngOnInit(): void {
    this.pdfFile = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdfFile));
  }
}
