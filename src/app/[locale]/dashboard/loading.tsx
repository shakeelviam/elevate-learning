export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded-xl w-56" />
              <div className="h-4 bg-gray-100 rounded-lg w-40" />
            </div>
            <div className="h-14 w-14 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Banner skeleton */}
        <div className="h-24 bg-gray-200 rounded-2xl" />

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-16" />
              <div className="h-8 bg-gray-200 rounded w-10" />
            </div>
          ))}
        </div>

        {/* Cards skeleton */}
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start gap-4">
                <div className="h-20 w-28 rounded-xl bg-gray-200 hidden sm:block flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-gray-100 rounded-full w-20" />
                  </div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-100 rounded w-24" />
                    <div className="h-4 bg-gray-100 rounded w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
