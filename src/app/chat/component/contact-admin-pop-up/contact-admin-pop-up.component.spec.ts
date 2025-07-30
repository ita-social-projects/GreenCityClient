import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAdminPopUpComponent } from './contact-admin-pop-up.component';

describe('ContactAdminPopUpComponent', () => {
  let component: ContactAdminPopUpComponent;
  let fixture: ComponentFixture<ContactAdminPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactAdminPopUpComponent]
    });
    fixture = TestBed.createComponent(ContactAdminPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
