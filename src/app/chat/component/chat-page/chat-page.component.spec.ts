import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { ChatComponent } from './chat-page.component';
import { ChatFacade } from '../../facade/chat.facade';

@Injectable()
class MockChatFacade {
  init = jasmine.createSpy('init');
  loadNextPage = jasmine.createSpy('loadNextPage');
}

class FakeIO implements IntersectionObserver {
  static last: FakeIO | null = null;
  constructor(
    private cb: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {
    FakeIO.last = this;
  }
  observe = jasmine.createSpy('observe');
  unobserve = jasmine.createSpy('unobserve');
  disconnect = jasmine.createSpy('disconnect');
  takeRecords = () => [];
  trigger(isIntersecting: boolean, target: Element) {
    const entry = {
      isIntersecting,
      target,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      time: performance.now()
    } as IntersectionObserverEntry;
    this.cb([entry], this as unknown as IntersectionObserver);
  }
  get root() {
    return this.options?.root ?? null;
  }
  get rootMargin() {
    return this.options?.rootMargin ?? '';
  }
  get thresholds() {
    const t = this.options?.threshold;
    return Array.isArray(t) ? t : [Number(t ?? 0)];
  }
}

describe('ChatComponent (baseline)', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [{ provide: ChatFacade, useClass: MockChatFacade }]
    })
      .overrideComponent(ChatComponent, { set: { template: `<div>no refs</div>` } })
      .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit calls facade.init with undefined when no selectedChatId', () => {
    const facade = TestBed.inject(ChatFacade) as unknown as MockChatFacade;
    facade.init.calls.reset();
    history.replaceState({}, '');
    component.ngOnInit();
    expect(facade.init).toHaveBeenCalledOnceWith(undefined);
  });

  it('ngOnInit calls facade.init with selectedChatId from history.state', () => {
    const facade = TestBed.inject(ChatFacade) as unknown as MockChatFacade;
    facade.init.calls.reset();
    history.replaceState({ selectedChatId: 321 }, '');
    component.ngOnInit();
    expect(facade.init).toHaveBeenCalledOnceWith(321);
  });
});

describe('ChatComponent (IO behavior)', () => {
  let fixture: ComponentFixture<ChatComponent>;
  let component: ChatComponent;
  let facade: MockChatFacade;
  let originalIO: any;

  beforeEach(async () => {
    originalIO = (window as any).IntersectionObserver;
    (window as any).IntersectionObserver = FakeIO as any;

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [{ provide: ChatFacade, useClass: MockChatFacade }]
    })
      .overrideComponent(ChatComponent, {
        set: {
          template: `
            <div #sidebarRoot style="height:120px; overflow:auto">
              <div style="height:400px"></div>
              <div #pagingAnchor id="anchor">anchor</div>
            </div>
          `
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(ChatFacade) as unknown as MockChatFacade;
    fixture.detectChanges();
  });

  afterEach(() => {
    (window as any).IntersectionObserver = originalIO;
  });

  it('creates IntersectionObserver with correct options', () => {
    const io = FakeIO.last!;
    expect(io).toBeTruthy();
    expect(io.rootMargin).toBe('0px 0px 200px 0px');
    expect(io.thresholds).toEqual([0]);
    expect(io.root).toBe(component.sidebarRoot.nativeElement);
  });

  it('calls observe on the paging anchor', () => {
    const io = FakeIO.last!;
    const anchor = fixture.nativeElement.querySelector('#anchor') as Element;
    expect(io.observe).toHaveBeenCalledWith(anchor);
  });

  it('does not call loadNextPage when entry is not intersecting', () => {
    const io = FakeIO.last!;
    const anchor = fixture.nativeElement.querySelector('#anchor') as Element;

    io.trigger(false, anchor);
    expect(facade.loadNextPage).not.toHaveBeenCalled();
  });
  it('sets the private io field after ngAfterViewInit', () => {
    expect((component as any).io).toBeTruthy();
  });
});
describe('ChatComponent (ctor + ngOnInit via detectChanges)', () => {
  it('ctor runs', () => {
    const c = new ChatComponent(new MockChatFacade() as any);
    expect(c).toBeTruthy();
  });

  const setup = async (state: any) => {
    history.replaceState(state, '');
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [{ provide: ChatFacade, useClass: MockChatFacade }]
    })
      .overrideComponent(ChatComponent, { set: { template: `<div>no refs</div>` } })
      .compileComponents();

    const fixture = TestBed.createComponent(ChatComponent);
    const component = fixture.componentInstance;
    const facade = TestBed.inject(ChatFacade) as unknown as MockChatFacade;
    facade.init.calls.reset();
    fixture.detectChanges();
    return { fixture, component, facade };
  };

  it('ngOnInit calls facade.init with undefined when no selectedChatId (via detectChanges)', async () => {
    const { facade } = await setup({});
    expect(facade.init).toHaveBeenCalledOnceWith(undefined);
  });

  it('ngOnInit calls facade.init with selectedChatId (via detectChanges)', async () => {
    const { facade } = await setup({ selectedChatId: 999 });
    expect(facade.init).toHaveBeenCalledOnceWith(999);
  });
});
describe('ChatComponent (ngOnInit coverage)', () => {
  it('covers selectedChatId read via detectChanges', async () => {
    history.replaceState({ selectedChatId: 555 }, '');
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [{ provide: ChatFacade, useClass: MockChatFacade }]
    })
      .overrideComponent(ChatComponent, { set: { template: `<div>no refs</div>` } })
      .compileComponents();

    const fixture = TestBed.createComponent(ChatComponent);
    const facade = TestBed.inject(ChatFacade) as unknown as MockChatFacade;
    facade.init.calls.reset();

    fixture.detectChanges();
    expect(facade.init).toHaveBeenCalledOnceWith(555);
  });
});
