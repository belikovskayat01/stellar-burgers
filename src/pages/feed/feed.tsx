import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useEffect } from 'react';

import { getFeed } from '@services/slices/feedSlice';
import { useDispatch, useSelector } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);
  const isLoading = useSelector((state) => state.feed.isLoading);

  const handleGetFeeds = (): void => {
    dispatch(getFeed());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};