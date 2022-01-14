import { Component, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PopUpViewService } from '@auth-service/pop-up/pop-up-view.service';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class SubmitButtonComponent implements OnInit, OnDestroy {
  private destroy: Subject<boolean> = new Subject<boolean>();
  private localeStorageService: LocalStorageService;
  private popUpViewService: PopUpViewService;
  public isUbs: boolean;
  public loadingAnim: boolean;
  public buttonIsActive: boolean;
  @Input() buttonText: string;

  constructor(private injector: Injector) {
    this.localeStorageService = injector.get(LocalStorageService);
    this.popUpViewService = injector.get(PopUpViewService);
  }

  ngOnInit(): void {
    this.popUpViewService.loadButtonAnimationBehaviourSubject
      .pipe(takeUntil(this.destroy))
      .subscribe((value) => (this.loadingAnim = value));
    this.localeStorageService.ubsRegBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((value) => (this.isUbs = value));
  }

  ngOnDestroy() {
    this.destroy.next(true);
    this.destroy.complete();
  }
}
