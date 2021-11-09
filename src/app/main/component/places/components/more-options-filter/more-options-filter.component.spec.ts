import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MoreOptionsFilterComponent } from './more-options-filter.component';

describe('MoreOptionsFilterComponent', () => {
  let component: MoreOptionsFilterComponent;
  let fixture: ComponentFixture<MoreOptionsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MoreOptionsFilterComponent],
      imports: [TranslateModule.forRoot(), MatMenuModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreOptionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
