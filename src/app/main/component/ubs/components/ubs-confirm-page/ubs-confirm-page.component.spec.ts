import { Subscription } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { UbsConfirmPageComponent } from './ubs-confirm-page.component';

describe('UbsConfirmPageComponent', () => {
  let component: UbsConfirmPageComponent;
  let fixture: ComponentFixture<UbsConfirmPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsConfirmPageComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should subscribe on activatedRoute.queryParams', () => {
    // @ts-ignore
    spyOn(component.activatedRoute.queryParams, 'subscribe').and.callFake(() => new Subscription());
    component.ngOnInit();
    // @ts-ignore
    expect(component.activatedRoute.queryParams.subscribe).toHaveBeenCalled();
  });
});
