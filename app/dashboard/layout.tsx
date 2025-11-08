export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen w-full grid grid-rows-[auto_1fr] overflow-y-auto">
      <header className="px-6 py-3 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md">
        <h2 className="font-semibold">Realtime Dashboard</h2>
        <nav className="text-sm opacity-75">Next.js 14 • Canvas • Workers</nav>
      </header>
      {children}
    </section>
  );
}
