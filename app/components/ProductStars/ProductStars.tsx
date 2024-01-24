import {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';

import {ReviewStars} from '~/components';

export function ProductStars({id}: {id: string}) {
  const [reviewAggregate, setReviewAggregate] = useState(null);

  // example api call to server; repurpose as needed
  const fetchReviewAggregate = useCallback(async (productId) => {
    try {
      if (!productId) return;

      const endpoint = '/api/reviews';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getProductReviewAggregate',
          productId: productId.split('/').pop(),
        }),
      };

      const response = await fetch(endpoint, options);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      setReviewAggregate(data);
    } catch (error) {
      console.error(`fetchReviewAggregate error: ${error.message}`);
      throw error;
    }
  }, []);

  useEffect(() => {
    // fetchReviewAggregate(id);

    // mock data until proper third party api call is implemented
    // remove this and uncomment fetchReviewAggregate(id) above
    setReviewAggregate({
      rating: 4.7,
      count: 105,
    });
  }, [id]);

  return (
    <div className="flex min-h-[1rem] flex-wrap items-center gap-1">
      {reviewAggregate && (
        <>
          <ReviewStars rating={reviewAggregate.rating} size="small" />

          <p className="text-2xs text-mediumDarkGray underline underline-offset-[3px]">
            ({reviewAggregate.count} Reviews)
          </p>
        </>
      )}
    </div>
  );
}

ProductStars.displayName = 'ProductStars';
ProductStars.propTypes = {
  id: PropTypes.string,
};
