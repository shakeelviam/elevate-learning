export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-white border-b border-gray-100 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <div className="h-10 bg-gray-200 rounded-xl w-2/3 mx-auto" />
          <div className="h-5 bg-gray-100 rounded-lg w-1/2 mx-auto" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-5 bg-gray-200 rounded w-4/5" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-9 bg-gray-200 rounded-xl w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
