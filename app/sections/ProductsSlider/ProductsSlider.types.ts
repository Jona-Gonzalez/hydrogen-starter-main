import {LinkCms, ProductCms} from '~/lib/types';

export interface ProductsSliderProps {
  button: LinkCms;
  heading: string;
  productItem: {
    enabledColorNameOnHover: boolean;
    enabledColorSelector: boolean;
    enabledQuickShop: boolean;
    enabledStarRating: boolean;
  };
  products: {
    product: ProductCms;
  }[];
  section: {
    buttonStyle: string;
    fullWidth: boolean;
    maxWidth: string;
  };
  slider: {
    slidesPerViewDesktop: number;
    slidesPerViewMobile: number;
    slidesPerViewTablet: number;
    sliderStyle: string;
  };
  textColor: string;
}
