"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Review } from "../model";

export default function ReviewView({ review }: { review: Review }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {review.user.avatar && (
              <AvatarImage
                src={review.user.avatar}
                alt={`${review.user.first_name} ${review.user.last_name}`}
              />
            )}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xl">
              {review.user.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {review.user.first_name} {review.user.last_name}
            </h3>
            <p className="text-muted-foreground">{review.user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {review.vendor.logo && (
              <AvatarImage src={review.vendor.logo} alt={review.vendor.name} />
            )}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xl">
              {review.vendor.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{review.vendor.name}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Rating
            </h4>
            <Badge variant="secondary" className="text-lg py-2 px-4 mt-1">
              {review.rating}/5
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Created At
            </h4>
            <p className="mt-1">
              {new Date(review.created_at * 1000).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Comment</h4>
          <p className="mt-1 whitespace-pre-wrap">
            {review.comment || "No comment provided"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
