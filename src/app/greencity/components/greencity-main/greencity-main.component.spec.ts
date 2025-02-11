import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreencityMainComponent } from './greencity-main.component';

describe('GreencityMainComponent', () => {
  let component: GreencityMainComponent;
  let fixture: ComponentFixture<GreencityMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GreencityMainComponent]
    });
    fixture = TestBed.createComponent(GreencityMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
