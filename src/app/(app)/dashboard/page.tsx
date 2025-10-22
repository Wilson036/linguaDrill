import { Suspense } from 'react';
import UserInfo from './user-info';
import LatestPosts from './latest-posts';


export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
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