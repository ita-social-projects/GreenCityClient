import { VisionCard } from '../../models/vision-card.interface';

export const visionCards: VisionCard[] = [
  {
    id: 1,
    title: 'about-us.steps.block-1.header',
    description: 'about-us.steps.block-1.text',
    linkText: 'about-us.steps.block-1.button',
    linkPath: ['/places'],
    imgUrl: 'assets/img/illustration-store.png',
    alt: 'illustration store',
    navigationExtras: {
      routerActiveLinkOptions: {
        exact: true
      },
      fragment: 'top-user-bar'
    }
  },
  {
    id: 2,
    title: 'about-us.steps.block-3.header',
    description: 'about-us.steps.block-3.text',
    linkText: 'about-us.steps.block-3.button',
    linkPath: [],
    imgUrl: 'assets/img/illustration-money.png',
    alt: 'illustration money'
  },
  {
    id: 3,
    title: 'about-us.steps.block-4.header',
    description: 'about-us.steps.block-4.text',
    linkText: 'about-us.steps.block-4.button',
    linkPath: [],
    imgUrl: 'assets/img/illustration-recycle.png',
    alt: 'illustration recycle'
  },
  {
    id: 4,
    title: 'about-us.steps.block-5.header',
    description: 'about-us.steps.block-5.text',
    linkText: 'about-us.steps.block-5.button',
    linkPath: [],
    imgUrl: 'assets/img/illustration-people.png',
    alt: 'illustration people'
  }
].map((obj) => ({ ...obj, numberImg: `assets/img/${obj.id}` }));
