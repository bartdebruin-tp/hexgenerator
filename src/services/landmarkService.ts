/**
 * Landmark Service
 * Responsible for generating and managing landmarks
 */

import type { Landmark } from '../interfaces/landmark'

export type { Landmark }

const LANDMARKS = [
  'Ancient Ruins',
  'Mysterious Monument',
  'Sacred Grove',
  'Abandoned Tower',
  'Crystal Cave',
  'Enchanted Spring',
  'Forgotten Temple',
  'Giant Statue',
  'Hidden Grotto',
  'Lost Shrine',
  'Magic Circle',
  'Old Battlefield',
  'Petrified Forest',
  'Stone Circle',
  'Sunken Cathedral',
  'Weathered Obelisk',
  'Witch\'s Hut',
  'Ancient Well',
  'Mystical Fountain',
  'Crumbling Bridge'
]

/**
 * Generate a random landmark
 * @returns A random landmark object
 */
export function generateLandmark(): Landmark {
  const name = LANDMARKS[Math.floor(Math.random() * LANDMARKS.length)]
  return { name }
}

/**
 * Get all available landmark names
 * @returns Array of all landmark names
 */
export function getAllLandmarks(): string[] {
  return [...LANDMARKS]
}

/**
 * Get a specific landmark by index
 * @param index The index of the landmark
 * @returns The landmark name at the specified index
 */
export function getLandmarkByIndex(index: number): string | undefined {
  return LANDMARKS[index]
}
