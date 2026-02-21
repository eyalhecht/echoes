import { Spinner } from "@/components/ui/spinner"

export default function MapLoadingState() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm" style={{ fontFamily: "'Lora', Georgia, serif", color: 'hsl(var(--echoes-muted))' }}>Loading...</p>
      </div>
    </div>
  )
}
