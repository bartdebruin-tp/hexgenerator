/**
 * Dungeon Service
 * Responsible for generating and managing dungeons
 */

export interface Dungeon {
  name: string
  description?: string
  levels?: number
}

const DUNGEONS = [
  'The Forgotten Crypt',
  'Tomb of the Ancient King',
  'The Black Citadel',
  'Cursed Catacombs',
  'The Shadow Vault',
  'Halls of the Damned',
  'The Deep Mines',
  'Necromancer\'s Tower',
  'The Sunken Temple',
  'Prison of Souls',
  'The Dark Sanctum',
  'Labyrinth of Despair',
  'The Blood Keep',
  'Ruins of the Old Kingdom',
  'The Abyssal Depths'
]

/**
 * Generate a random dungeon
 * @returns A random dungeon object
 */
export function generateDungeon(): Dungeon {
  const name = DUNGEONS[Math.floor(Math.random() * DUNGEONS.length)]
  return { name }
}

/**
 * Get all available dungeon names
 * @returns Array of all dungeon names
 */
export function getAllDungeons(): string[] {
  return [...DUNGEONS]
}

/**
 * Get a specific dungeon by index
 * @param index The index of the dungeon
 * @returns The dungeon name at the specified index
 */
export function getDungeonByIndex(index: number): string | undefined {
  return DUNGEONS[index]
}
