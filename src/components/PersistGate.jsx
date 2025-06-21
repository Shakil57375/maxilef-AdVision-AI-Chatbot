import { useSelector } from "react-redux"

export function PersistGate({ children, loading = null }) {
  // Check if we have rehydrated by looking for the _persist key
  const persistState = useSelector((state) => state._persist)

  if (!persistState?.rehydrated) {
    return (
      loading || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      )
    )
  }

  return children
}
