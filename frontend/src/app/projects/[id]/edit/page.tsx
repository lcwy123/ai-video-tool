import EditorLayout from '@/components/editor/EditorLayout';

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditorLayout projectId={id} />;
}
