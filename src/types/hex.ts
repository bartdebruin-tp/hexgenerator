import type { TerrainType, Terrain } from '../stores/terrain'

// Hex coordinate system (axial coordinates)
export interface HexCoordinates {
  q: number  // column
  r: number  // row
}

// Hex tile definition
export interface Hex {
  id: string
  coordinates: HexCoordinates
  terrain: Terrain
  terrainType: TerrainType
  createdAt: number
}

// Hex creation options
export interface HexOptions {
  coordinates?: Partial<HexCoordinates>
  terrainType?: TerrainType
}
