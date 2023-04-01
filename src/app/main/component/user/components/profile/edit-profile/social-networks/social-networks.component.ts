import { forwardRef, Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgModel, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopUpComponent } from '@shared/components';
import { take } from 'rxjs/operators';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SocialNetworksComponent)
    }
  ]
})
export class SocialNetworksComponent implements ControlValueAccessor {
  public icons = {
    edit: './assets/img/profile/icons/edit.svg',
    add: './assets/img/profile/icons/add.svg',
    delete: './assets/img/profile/icons/delete.svg',
    defaultIcon: './assets/img/profile/icons/default_social.svg',
    facebook: './assets/img/icon/facebook-icon.svg',
    linkedin: './assets/img/icon/linked-icon.svg',
    instagram: './assets/img/icon/instagram-icon.svg',
    twitter: './assets/img/icon/twitter-icon.svg'
  };

  public urlValidationRegex = Patterns.linkPattern;
  public showInput = false;
  public inputTextValue;
  public editedSocialLink: any = false;

  @ViewChild('socialLink') socialLink: NgModel;
  @Input() socialNetworks = [];
  @Output() socialNetworksChange: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  onChange(value: any) {
    // TODO: add functionality to this method
  }

  writeValue(obj: any): void {
    // TODO: add functionality to this method
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    // TODO: add functionality to this method
  }

  setDisabledState?(isDisabled: boolean): void {
    // TODO: add functionality to this method
  }

  public onEditLink(link): void {
    this.onChange(link);
    this.onToggleInput(true);
    this.inputTextValue = link.url;
    this.editedSocialLink = link.url;
    this.onFilterSocialLink(link);
  }

  public onDeleteLink(link): void {
    this.onChange(link);
    const dialogRef = this.dialog.open(WarningPopUpComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'popup-dialog-container',
      data: {
        popupTitle: 'user.edit-profile.delete-popup.title',
        popupConfirm: 'user.edit-profile.btn.yes',
        popupCancel: 'user.edit-profile.btn.cancel'
      }
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (confirm) {
          this.onFilterSocialLink(link);
        }
      });
  }

  private onFilterSocialLink(link) {
    this.socialNetworks = this.socialNetworks.filter((el) => link.url !== el.url);
    this.onEmitSocialNetworksChange();
  }

  public onToggleInput(state?: boolean): void {
    if (arguments.length > 0) {
      this.showInput = state;
    } else {
      this.showInput = !this.showInput;
    }
  }

  public getSocialImage(socialNetwork) {
    return socialNetwork && socialNetwork.socialNetworkImage && socialNetwork.socialNetworkImage.imagePath === ''
      ? this.icons.defaultIcon
      : socialNetwork.socialNetworkImage.imagePath;
  }

  public onCloseForm(): void {
    if (this.editedSocialLink) {
      this.onAddLink(this.editedSocialLink);
      this.editedSocialLink = false;
    }
    this.onToggleInput(false);
    this.inputTextValue = '';
  }

  public getErrorMessage(linkErrors) {
    let result = 'user.edit-profile.input-validation-';
    Object.keys(linkErrors).forEach((error) => {
      result = result + error;
    });
    return result;
  }

  public onAddLink(link?) {
    this.onChange(link);
    const value = link || this.inputTextValue;
    let imgPath = this.icons.defaultIcon;
    if (this.checkIsUrl(value) && !this.onCheckForExisting(value)) {
      Object.keys(this.icons).forEach((icon) => {
        if (value.toLowerCase().includes(icon)) {
          imgPath = this.icons[icon];
        }
      });

      this.socialNetworks.push({
        url: value,
        socialNetworkImage: {
          imagePath: imgPath
        }
      });

      this.onEmitSocialNetworksChange();
      this.editedSocialLink = false;
      this.onCloseForm();
    } else {
      // set error to input if user have same link added
      return this.socialLink.control.setErrors({ 'non-unique': true });
    }
  }

  public replaceHttp(str: string) {
    return str.replace(/(https|http):\/\//i, '');
  }

  private onEmitSocialNetworksChange(): void {
    this.socialNetworksChange.emit(this.createArrayWithUrl());
  }

  private checkIsUrl(url: string) {
    return this.urlValidationRegex.test(url);
  }

  private onCheckForExisting(url: string) {
    return this.socialNetworks.some((el) => url === el.url);
  }

  private createArrayWithUrl(arr = this.socialNetworks) {
    const result = [];
    Object.values(arr).forEach((el) => result.push(el.url));
    return result;
  }
}
