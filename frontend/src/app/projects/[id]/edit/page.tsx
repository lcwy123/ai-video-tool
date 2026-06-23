export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">编辑器</h1>
      <p className="text-gray-500">项目 ID: {id}</p>
      <p className="text-gray-400 text-sm mt-2">编辑器将在 Phase 2 中实现</p>
    </div>
  );
}
