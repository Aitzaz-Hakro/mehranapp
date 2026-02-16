interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-[#002147]/10 bg-white p-6 text-center shadow-sm">
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <p className="mt-2 text-sm text-black/70">{description}</p>
    </div>
  );
}

export function InlineErrorState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <h3 className="text-sm font-semibold text-red-700">{title}</h3>
      <p className="mt-1 text-sm text-red-600">{description}</p>
    </div>
  );
}
