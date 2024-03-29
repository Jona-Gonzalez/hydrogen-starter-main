import {Image} from '@shopify/hydrogen';

import {Link, Markdown} from '~/components';
import {Schema} from './MetaobjectImage.schema';

export function MetaobjectImage({cms}) {
  const dataSourceReference = cms?.dataSource?.reference;
  const fields = {};
  dataSourceReference?.fields?.forEach((field) => {
    fields[field.key] = field.reference || field.value;
  });

  const {alt, link, caption, enable_padding, image} = fields;
  const imageDetails = image?.image;

  const maxWidth = 'max-w-[90rem]';
  const sizes =
    /[0-9]+(?:px)|[0-9]+(?:rem)/.exec('max-w-[90rem]')?.[0] || '100vw';

  return (
    <div
      className={`py-4 md:py-6 lg:py-8 ${enable_padding ? 'px-contained' : ''}`}
    >
      <Link className={`mx-auto ${maxWidth}`} href={link} newTab={true}>
        <div
          className={`relative hidden bg-offWhite md:block md:aspect-[16/9]`}
        >
          {imageDetails?.url && (
            <Image
              data={{
                altText: alt || image.altText,
                url: imageDetails.url,
              }}
              className="media-fill md:object-center"
              sizes={sizes}
            />
          )}
        </div>
      </Link>

      {caption && (
        <div className={`mt-3 ${enable_padding ? '' : 'px-contained'}`}>
          <div
            className={`mx-auto [&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base ${maxWidth}`}
          >
            <Markdown>{caption}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

MetaobjectImage.displayName = 'MetaobjectImage';
MetaobjectImage.Schema = Schema;
