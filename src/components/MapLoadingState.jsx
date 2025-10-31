import { Spinner } from "@/components/ui/spinner"

export default function MapLoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-xl font-semibold text-foreground">Loading</p>
      </div>
    </div>
  )
}
