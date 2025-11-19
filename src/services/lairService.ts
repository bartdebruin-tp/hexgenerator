/**
 * Lair Service
 * Responsible for generating and managing lairs
 */

import type { Lair } from '../interfaces/lair'

export type { Lair }

const LAIRS = [
  'Dragon\'s Lair',
  'Spider Den',
  'Wolf Pack Territory',
  'Bear Cave',
  'Troll Cavern',
  'Goblin Warren',
  'Wyvern Nest',
  'Basilisk Pit',
  'Hydra Swamp',
  'Giant\'s Den',
  'Ogre Camp',
  'Harpy Roost',
  'Manticore Den',
  'Chimera Lair',
  'Bandit Hideout'
]

/**
 * Generate a random lair
 * @returns A random lair object
 */
export function generateLair(): Lair {
  const name = LAIRS[Math.floor(Math.random() * LAIRS.length)]
  return { name }
}

/**
 * Get all available lair names
 * @returns Array of all lair names
 */
export function getAllLairs(): string[] {
  return [...LAIRS]
}

/**
 * Get a specific lair by index
 * @param index The index of the lair
 * @returns The lair name at the specified index
 */
export function getLairByIndex(index: number): string | undefined {
  return LAIRS[index]
}
