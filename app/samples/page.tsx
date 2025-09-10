import { Suspense } from "react"
import SamplePacksList from "@/components/sample-packs-list"
import SamplePackFilters from "@/components/sample-pack-filters"
import { Skeleton } from "@/components/ui/skeleton"

export default function SamplePacksPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12 mb-24">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 font-heading">Sample Packs</h1>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
        <div className="w-full lg:w-1/4 order-2 lg:order-1">
          <SamplePackFilters />
        </div>

        <div className="w-full lg:w-3/4 order-1 lg:order-2">
          <Suspense fallback={<SamplePacksLoadingSkeleton />}>
            <SamplePacksList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

function SamplePacksLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4">
            <Skeleton className="h-48 w-full rounded-lg mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}
