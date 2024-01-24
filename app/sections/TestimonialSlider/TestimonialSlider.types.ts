import {LinkCms} from '~/lib/types';

interface Section {
  bgColor: string;
  fullWidth: boolean;
  reviewStarColor: string;
  sliderPaginationBulletColor: string;
  textColor: string;
}

interface Slide {
  title: string;
  body: string;
  author: string;
  rating: string;
}

export interface TestimonialSliderProps {
  heading: string;
  link: LinkCms;
  section: Section;
  testimonialSlides: Slide[];
}
