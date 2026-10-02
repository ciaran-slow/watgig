// Loading placeholders that match the real layouts, so nothing jumps when data arrives.

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`} />
}

function Status({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}

export function EventCardSkeleton() {
  return (
    <div aria-hidden="true" className="w-full rounded-3xl overflow-hidden bg-[#111] border border-gray-800 flex flex-col">
      <Skeleton className="h-72 md:h-96 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5 md:p-6">
        <div className="flex gap-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-7 w-20" />
        </div>
        <Skeleton className="h-8 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-5 w-3/5" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-12 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

// Same section and grid classes as the real event lists
export function EventListSkeleton({ count = 6, title = true }: { count?: number; title?: boolean }) {
  return (
    <Status label="Loading events" className="px-4 py-6 md:p-12 w-full overflow-hidden">
      {title && <Skeleton className="h-10 md:h-16 w-3/4 md:w-1/2 mb-8 md:mb-12 rounded-md" />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-20">
        {Array.from({ length: count }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    </Status>
  )
}

// Hero banner plus a two-column body, used by the event and profile pages
export function PageSkeleton({ label = 'Loading' }: { label?: string }) {
  return (
    <Status label={label} className="bg-[#0a0a0a] min-h-screen">
      <div aria-hidden="true" className="h-[480px] md:h-[700px] w-full bg-white/[0.03] flex flex-col items-center justify-center gap-4 px-4 pt-14">
        <Skeleton className="h-10 md:h-16 w-4/5 md:w-1/2" />
        <Skeleton className="h-5 w-1/2 md:w-1/3" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <div className="p-4 md:p-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12">
        <div className="lg:col-span-1 flex flex-col gap-6 md:gap-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col gap-5">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 md:p-8 flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-[300px] w-full rounded-3xl" />
        </div>
      </div>
    </Status>
  )
}

// Stand-in for the add/edit forms
export function FormSkeleton({ label = 'Loading form' }: { label?: string }) {
  return (
    <Status label={label} className="px-4 py-6 md:p-12 pt-28 md:pt-44 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-3xl mx-auto bg-white/[0.02] border border-white/5 rounded-3xl p-4 md:p-10 flex flex-col gap-8">
        <Skeleton className="h-10 w-1/2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-12 w-40 rounded-xl" />
      </div>
    </Status>
  )
}
