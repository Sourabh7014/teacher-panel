import ReviewList from "@/features/reviews/components/list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Manage reviews",
};

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-muted-foreground">Manage reviews</p>
        </div>
      </div>
      <ReviewList />
    </div>
  );
}
