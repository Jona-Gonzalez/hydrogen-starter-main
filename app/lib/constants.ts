import {I18nLocale} from './types/Store.types';

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  label: 'United States (USD $)',
  language: 'EN',
  country: 'US',
  currency: 'USD',
  pathPrefix: '',
});

export const COLOR_OPTION_NAME = 'Color';

export const MEDIA_IMAGE_KEY_BY_TYPE = Object.freeze({
  EXTERNAL_VIDEO: 'previewImage',
  IMAGE: 'image',
  MODEL_3D: 'previewImage',
  VIDEO: 'previewImage',
});
