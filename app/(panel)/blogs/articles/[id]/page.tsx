import CreateArticle from "@/features/articles/components/create";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CreateArticle id={id} />;
}
