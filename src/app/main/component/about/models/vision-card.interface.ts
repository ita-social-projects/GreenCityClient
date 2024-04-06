export interface VisionCard {
  id: number;
  title: string;
  description: string;
  linkText: string;
  linkPath: string[];
  imgUrl: string;
  numberImg: string;
  alt: string;
  navigationExtras?: {
    routerActiveLinkOptions?: {
      exact: boolean;
    };
    fragment?: string;
  };
}
