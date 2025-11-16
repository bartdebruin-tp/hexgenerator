/**
 * Settlement Service
 * Responsible for generating and managing settlements
 */

export interface Settlement {
  name: string
  description?: string
  population?: number
}

const SETTLEMENTS = [
  'Riverside Village',
  'Mountain Outpost',
  'Trading Post',
  'Farming Hamlet',
  'Mining Camp',
  'Frontier Town',
  'Merchant Crossroads',
  'Fishing Village',
  'Hillside Settlement',
  'Forest Camp',
  'Desert Oasis',
  'Coastal Harbor',
  'Highland Village',
  'Valley Town',
  'Border Fort'
]

/**
 * Generate a random settlement
 * @returns A random settlement object
 */
export function generateSettlement(): Settlement {
  const name = SETTLEMENTS[Math.floor(Math.random() * SETTLEMENTS.length)]
  return { name }
}

/**
 * Get all available settlement names
 * @returns Array of all settlement names
 */
export function getAllSettlements(): string[] {
  return [...SETTLEMENTS]
}

/**
 * Get a specific settlement by index
 * @param index The index of the settlement
 * @returns The settlement name at the specified index
 */
export function getSettlementByIndex(index: number): string | undefined {
  return SETTLEMENTS[index]
}
