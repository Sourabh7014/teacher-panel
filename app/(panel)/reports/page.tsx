import ReportList from "@/features/reports/components/list";

export default function ReportPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">Check all reports.</p>
        </div>
      </div>
      <ReportList />
    </>
  );
}
