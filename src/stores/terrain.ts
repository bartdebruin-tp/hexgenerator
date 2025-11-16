import { defineStore } from 'pinia'
import { rollDice } from '../services/diceService'

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

  // Get random terrain type using 2d6 roll
  function getRandomTerrainType(): TerrainType {
    // Use dice service to roll 2d6
    const roll = rollDice(2, 6).total
    
    // Map roll to terrain type
    const rollToTerrain: Record<number, TerrainType> = {
      2: 'deadlands',
      3: 'desert',
      4: 'savannah',
      5: 'swamp',
      6: 'forest',
      7: 'grass',
      8: 'forest',
      9: 'wetlands',
      10: 'hills',
      11: 'mountain',
      12: 'coastal'
    }
    
    return rollToTerrain[roll]
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
