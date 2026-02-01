import VoucherList from "@/features/vouchers/components/list";

export default async function CreateVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vouchers</h2>
          <p className="text-muted-foreground">Manage your vouchers here</p>
        </div>
        <div className="flex gap-2"></div>
      </div>
      <VoucherList vendorId={id} />
    </>
  );
}
