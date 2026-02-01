import PostList from "@/features/posts/components/list";

export default function PostPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
          <p className="text-muted-foreground">Check all posts.</p>
        </div>
      </div>
      <PostList />
    </>
  );
}
