import { Suspense } from 'react';
import UserInfo from './user-info';
import LatestPosts from './latest-posts';

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-xl font-bold">🚀 Dashboard</h1>

      <Suspense fallback={<p>Loading user info...</p>}>
        <UserInfo />
      </Suspense>

      <Suspense fallback={<p>Loading latest posts...</p>}>
        <LatestPosts />
      </Suspense>
    </div>
  );
}
