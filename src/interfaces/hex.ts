/**
 * Hex Interfaces
 */

import type { TerrainType, Terrain } from './terrain'

// Hex coordinate system (axial coordinates)
export interface HexCoordinates {
  q: number  // column
  r: number  // row
}

// Danger level types
export type DangerLevel = 'safe' | 'unsafe' | 'risky' | 'deadly'

export interface DangerInfo {
  level: DangerLevel
  roll: number
}

// Location types
export type LocationType = 'landmark' | 'settlement' | 'lair' | 'dungeon'

export interface LocationInfo {
  type: LocationType
  name: string
  mainBuilding?: string
}

// Hex tile definition
export interface Hex {
  id: string
  coordinates: HexCoordinates
  terrain: Terrain
  terrainType: TerrainType
  danger: DangerInfo
  location?: LocationInfo
  createdAt: number
}

// Hex creation options
export interface HexOptions {
  coordinates?: Partial<HexCoordinates>
  terrainType?: TerrainType
}
