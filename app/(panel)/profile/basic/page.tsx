import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import BasicProfileForm from "@/features/profile/components/basic";

export default function ProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Profile</CardTitle>
        <CardDescription>
          Update your profile information and public display name
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BasicProfileForm />
      </CardContent>
    </Card>
  );
}
