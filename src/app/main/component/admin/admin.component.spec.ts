import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { JwtService } from '@global-service/jwt/jwt.service';
import { TranslateModule } from '@ngx-translate/core';

import { AdminComponent } from './admin.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  const jwtServiceFake = jasmine.createSpyObj('jwtService', ['getUserRole']);
  jwtServiceFake.getUserRole = () => '123';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        {
          provide: JwtService,
          useValue: jwtServiceFake
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOninit UserRole should been assigned a value', () => {
    expect(component.userRole).toBe('123');
  });
});
