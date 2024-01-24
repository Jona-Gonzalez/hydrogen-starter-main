import {Image} from '@shopify/hydrogen-react';

interface ProductImageProps {
  alt?: string;
  image?: any;
  onLoad?: () => void;
  priority?: boolean;
}

export function ProductImage({
  alt,
  image,
  onLoad,
  priority,
}: ProductImageProps) {
  return image?.url ? (
    <Image
      data={{
        altText: alt || image.altText,
        url: image.url,
      }}
      onLoad={onLoad}
      className="media-fill"
      loading={priority ? 'eager' : 'lazy'}
      sizes="(min-width: 1440px) 900px, (min-width: 768px) 50vw, 100vw"
      // srcSetSizes={[480, 960, 1280]}
      // IMPORTANT: for naturally large, high resolution images from Shopify,
      // reduce quality back to the default ~75 for better page performance
    />
  ) : null;
}

ProductImage.displayName = 'ProductImage';
