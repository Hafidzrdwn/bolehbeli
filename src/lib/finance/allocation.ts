export interface AllocationInput {
  balance: number
  needsTotal: number
  wishlistTotal: number
  buffer: number
}

export interface AllocationResult {
  needsPct: number
  wishlistPct: number
  remainingPct: number
  bufferMarkerPct: number
  deficit: boolean
  shortfall: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function buildAllocation({
  balance,
  needsTotal,
  wishlistTotal,
  buffer,
}: AllocationInput): AllocationResult {
  const safeBalance = Math.max(0, Math.floor(balance))
  const safeNeeds = Math.max(0, Math.floor(needsTotal))
  const safeWishlist = Math.max(0, Math.floor(wishlistTotal))
  const safeBuffer = Math.max(0, Math.floor(buffer))

  const total = Math.max(safeBalance, safeNeeds + safeWishlist, 1)

  const needsPct = Math.round((safeNeeds / total) * 100)
  const wishlistPct = Math.round((safeWishlist / total) * 100)
  const remainingPct = Math.max(0, 100 - needsPct - wishlistPct)

  const bufferMarkerPct = Math.round(clamp(((total - safeBuffer) / total) * 100, 0, 100))

  const deficit = safeNeeds + safeWishlist > safeBalance
  const shortfall = deficit ? safeNeeds + safeWishlist - safeBalance : 0

  return {
    needsPct,
    wishlistPct,
    remainingPct,
    bufferMarkerPct,
    deficit,
    shortfall,
  }
}
