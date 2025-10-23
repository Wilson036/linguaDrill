export default async function LatestPosts() {
  await new Promise((r) => setTimeout(r, 4000));
  return (
    <ul className="list-disc pl-6">
      <li>Next.js Streaming 教學</li>
      <li>React Server Components 實戰</li>
    </ul>
  );
}
