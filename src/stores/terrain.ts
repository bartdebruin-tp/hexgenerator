import { defineStore } from 'pinia'

// Terrain types
export type TerrainType = 'grass' | 'forest' | 'mountain' | 'swamp' | 'desert' | 'hills' | 'coastal' | 'wetlands' | 'savannah' | 'deadlands'

export interface Terrain {
  type: TerrainType
  color: string
  movementCost: number
}

export const useTerrainStore = defineStore('terrain', () => {
  // State met terrain types
  const terrains: Record<TerrainType, Terrain> = {
    grass: {
      type: 'grass',
      color: '#90EE90',
      movementCost: 1
    },
    forest: {
      type: 'forest',
      color: '#228B22',
      movementCost: 2
    },
    mountain: {
      type: 'mountain',
      color: '#8B7355',
      movementCost: 3
    },
    swamp: {
      type: 'swamp',
      color: '#4A5D23',
      movementCost: 3
    },
    desert: {
      type: 'desert',
      color: '#EDC9AF',
      movementCost: 2
    },
    hills: {
      type: 'hills',
      color: '#8B9467',
      movementCost: 2
    },
    coastal: {
      type: 'coastal',
      color: '#7CB9E8',
      movementCost: 1
    },
    wetlands: {
      type: 'wetlands',
      color: '#6B8E23',
      movementCost: 2
    },
    savannah: {
      type: 'savannah',
      color: '#C2B280',
      movementCost: 1
    },
    deadlands: {
      type: 'deadlands',
      color: '#3B3C36',
      movementCost: 4
    }
  }

  // Getter voor een specifiek terrain type
  function getTerrain(type: TerrainType): Terrain {
    return terrains[type]
  }

  // Get random terrain type
  function getRandomTerrainType(): TerrainType {
    const types: TerrainType[] = [
      'grass', 'forest', 'mountain', 'swamp', 'desert', 
      'hills', 'coastal', 'wetlands', 'savannah', 'deadlands'
    ]
    return types[Math.floor(Math.random() * types.length)]
  }

  // Get random terrain
  function getRandomTerrain(): Terrain {
    const type = getRandomTerrainType()
    return terrains[type]
  }

  // Get all terrain types
  function getAllTerrainTypes(): TerrainType[] {
    return Object.keys(terrains) as TerrainType[]
  }

  return {
    // State
    terrains,
    // Actions
    getTerrain,
    getRandomTerrainType,
    getRandomTerrain,
    getAllTerrainTypes
  }
})
