import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipsCardComponent } from './tips-card.component';

describe('TipsCardComponent', () => {
  let component: TipsCardComponent;
  let fixture: ComponentFixture<TipsCardComponent>;

  const defaultImagePath =
    'https://csb10032000a548f571.blob.core.windows.net/allfiles/90370622-3311-4ff1-9462-20cc98a64d1ddefault_image.jpg';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TipsCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipsCardComponent);
    component = fixture.componentInstance;
    component.tip = {
      imageUrl: defaultImagePath,
      text: 'test'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
