export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-12 w-64" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">{Array.from({ length: 10 }, (_, i) => <div key={i} className="skeleton h-28" />)}</div>
      <div className="skeleton h-80" />
      <div className="grid gap-6 lg:grid-cols-2"><div className="skeleton h-72" /><div className="skeleton h-72" /></div>
    </div>
  );
}
