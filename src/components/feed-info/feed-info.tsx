import { FeedInfoUI } from '@ui';
import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const getOrders = (
  orders: TOrder[],
  status: 'done' | 'pending'
): number[] =>
  orders
    .filter((item) =>
      status === 'done' ? item.status === 'done' : item.status !== 'done'
    )
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector((state) => state.feed);
  const orders = feed.orders;

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
