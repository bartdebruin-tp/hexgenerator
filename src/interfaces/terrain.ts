/**
 * Terrain Interfaces
 */

export type TerrainType = 'grass' | 'forest' | 'mountain' | 'swamp' | 'desert' | 'hills' | 'coastal' | 'wetlands' | 'savannah' | 'deadlands'

export interface Terrain {
  type: TerrainType
  color: string
  movementCost: number
  name?: string
}
