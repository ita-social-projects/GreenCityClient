import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile-image',
  templateUrl: './user-profile-image.component.html',
  styleUrls: ['./user-profile-image.component.scss']
})
export class UserProfileImageComponent implements OnChanges {
  @Input() firstName: string;
  @Input() imgPath: string;
  @Input() isOnline: boolean;
  @Input() additionalImgClass = '';

  sanitizedImgPath: SafeUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imgPath'] && this.imgPath) {
      this.sanitizedImgPath = this.sanitizeUrl(this.imgPath);
    }
  }

  sanitizeUrl(url: string): SafeUrl | null {
    const validUrlPattern = /^https?:\/\/[^\s/$.?#].\S*$/;
    const cleanedUrl = url.replace(/[[\]"']/g, '').trim();
    if (validUrlPattern.test(cleanedUrl)) {
      return this.sanitizer.bypassSecurityTrustUrl(cleanedUrl);
    } else {
      console.error('Invalid URL:', cleanedUrl);
      return null;
    }
  }

  getDefaultProfileImg(): string {
    let initials = '';
    if (this.firstName) {
      initials = this.firstName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
    }
    return initials;
  }
}
