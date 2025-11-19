/**
 * Settlement Service
 * Responsible for generating and managing settlements
 */

import { roll1d20, roll1d12 } from './diceService'
import type { Settlement, Hamlet } from '../interfaces/settlement'

export type { Settlement, Hamlet }

const SETTLEMENTS = [
  'Camp',
  'Hamlet',
  'Village',
  'City',
  'Tower',
  'Abbey',
  'Castle'
]

/**
 * Generate the main building for a hamlet based on d12 roll
 * @returns The main building name
 */
function generateHamletMainBuilding(): string {
  const roll = roll1d12()
  
  switch (roll) {
    case 1: return 'Brewery/Vineyard'
    case 2: return 'Chapel'
    case 3: return 'Farm/Ranch'
    case 4: return 'Manor'
    case 5: return 'Mill'
    case 6: return 'Mine'
    case 7: return 'Sawmill'
    case 8: return 'Shop'
    case 9: return 'Tavern'
    case 10: return 'Blacksmith'
    case 11: return 'Tourney grounds'
    case 12: return 'Watchtower'
    default: return 'Farm/Ranch'
  }
}

/**
 * Generate a random settlement based on d20 roll
 * Camp: 1-3 (3 chances)
 * Hamlet: 4-6 (3 chances) - rolls d12 for main building
 * Village: 7-8 (2 chances)
 * City: 9 (1 chance)
 * Tower: 10 (1 chance)
 * Abbey: 11 (1 chance)
 * Castle: 12 (1 chance)
 * Remaining rolls (13-20) cycle through the list
 * @returns A random settlement object (can be Settlement or Hamlet)
 */
export function generateSettlement(): Settlement | Hamlet {
  const roll = roll1d20()
  
  let name: string
  
  if (roll >= 1 && roll <= 3) {
    name = 'Camp'
  } else if (roll >= 4 && roll <= 6) {
    return {
      name: 'Hamlet',
      mainBuilding: generateHamletMainBuilding()
    }
  } else if (roll >= 7 && roll <= 8) {
    name = 'Village'
  } else if (roll === 9) {
    name = 'City'
  } else if (roll === 10) {
    name = 'Tower'
  } else if (roll === 11) {
    name = 'Abbey'
  } else if (roll === 12) {
    name = 'Castle'
  } else {
    // For rolls 13-20, cycle through the settlements
    const index = (roll - 13) % SETTLEMENTS.length
    name = SETTLEMENTS[index]
    // If the cycled result is a Hamlet, roll for main building
    if (name === 'Hamlet') {
      return {
        name: 'Hamlet',
        mainBuilding: generateHamletMainBuilding()
      }
    }
  }
  
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
