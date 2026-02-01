import FeedbackList from "@/features/feedbacks/components/list";

export default function FeedbackPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Feedbacks</h2>
          <p className="text-muted-foreground">Check all feedbacks.</p>
        </div>
      </div>
      <FeedbackList />
    </>
  );
}
