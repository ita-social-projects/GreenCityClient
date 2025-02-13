import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedMainModule } from '@shared/shared-main.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchPopupComponent } from '../search-popup/search-popup.component';
import { FooterComponent } from '../footer/footer.component';
import { GreencityMainComponent } from './greencity-main.component';
import { GreencityModule } from '../../greencity.module';

describe('GreencityMainComponent', () => {
  let component: GreencityMainComponent;
  let fixture: ComponentFixture<GreencityMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GreencityMainComponent, SearchPopupComponent, FooterComponent],
      imports: [HttpClientModule, SharedMainModule, SharedModule, RouterTestingModule, GreencityModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GreencityMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
