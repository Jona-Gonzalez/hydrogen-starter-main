import {MediaFile} from '@shopify/hydrogen';
import {useInView} from 'react-intersection-observer';

import {MEDIA_IMAGE_KEY_BY_TYPE} from '~/lib/constants';
import {ProductImage} from './ProductImage';
import {ProductVideo} from './ProductVideo';

const typeNameMap: any = {
  MODEL_3D: 'Model3d',
  VIDEO: 'Video',
  IMAGE: 'MediaImage',
  EXTERNAL_VIDEO: 'ExternalVideo',
};

export function ProductMediaFile({alt, media, onLoad, priority}) {
  const {mediaContentType} = media;
  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const previewImage = media[MEDIA_IMAGE_KEY_BY_TYPE[mediaContentType]];
  const {height, width} = {...previewImage};
  const __typename = typeNameMap[mediaContentType];

  return (
    <div
      className="relative bg-offWhite"
      ref={ref}
      style={{
        aspectRatio:
          width && height
            ? width / height
            : 'var(--product-image-aspect-ratio)',
      }}
    >
      {(priority || inView) && (
        <>
          {mediaContentType === 'IMAGE' && (
            <ProductImage
              alt={alt}
              image={media.image}
              onLoad={onLoad}
              priority={priority}
            />
          )}

          {mediaContentType === 'EXTERNAL_VIDEO' && (
            <MediaFile
              data={{...media, __typename}}
              className="media-fill"
              onLoad={onLoad}
            />
          )}

          {mediaContentType === 'MODEL_3D' && (
            <MediaFile
              data={{...media, __typename}}
              className="media-fill"
              onLoad={onLoad}
            />
          )}
        </>
      )}

      {mediaContentType === 'VIDEO' && (
        <ProductVideo inView={inView} media={media} onLoad={onLoad} />
      )}
    </div>
  );
}

ProductMediaFile.displayName = 'ProductMediaFile';
