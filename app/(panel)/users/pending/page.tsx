import PendingUserList from "@/features/users/components/pending/list";

export default function UsersPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pending Users</h2>
          <p className="text-muted-foreground">View All Pending Users</p>
        </div>
      </div>
      <PendingUserList />
    </>
  );
}
