import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminCertificateComponent } from './ubs-admin-certificate.component';

describe('UbsAdminCertificateComponent', () => {
  let component: UbsAdminCertificateComponent;
  let fixture: ComponentFixture<UbsAdminCertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCertificateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
