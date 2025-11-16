import type { TerrainType, Terrain } from '../stores/terrain'

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

// Hex tile definition
export interface Hex {
  id: string
  coordinates: HexCoordinates
  terrain: Terrain
  terrainType: TerrainType
  danger: DangerInfo
  createdAt: number
}

// Hex creation options
export interface HexOptions {
  coordinates?: Partial<HexCoordinates>
  terrainType?: TerrainType
}
