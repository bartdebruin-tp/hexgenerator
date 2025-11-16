import type { Hex, HexCoordinates } from '../types/hex'
import type { TerrainType } from '../stores/terrain'
import { useTerrainStore } from '../stores/terrain'
import { rollDangerLevel } from '../services/diceService'

/**
 * Builder pattern voor het maken van Hex objecten
 */
export class HexBuilder {
  private coordinates: HexCoordinates = { q: 0, r: 0 }
  private terrainType: TerrainType | null = null
  private dangerLevel: { level: 'safe' | 'unsafe' | 'risky' | 'deadly', roll: number } | null = null
  private terrainStore = useTerrainStore()

  /**
   * Set de coördinaten van de hex
   */
  setCoordinates(q: number, r: number): this {
    this.coordinates = { q, r }
    return this
  }

  /**
   * Set alleen de q coördinaat (column)
   */
  setQ(q: number): this {
    this.coordinates.q = q
    return this
  }

  /**
   * Set alleen de r coördinaat (row)
   */
  setR(r: number): this {
    this.coordinates.r = r
    return this
  }

  /**
   * Set het terrain type
   */
  setTerrainType(type: TerrainType): this {
    this.terrainType = type
    return this
  }

  /**
   * Gebruik een random terrain type
   */
  useRandomTerrain(): this {
    this.terrainType = this.terrainStore.getRandomTerrainType()
    return this
  }

  /**
   * Set het danger level
   */
  setDangerLevel(level: 'safe' | 'unsafe' | 'risky' | 'deadly', roll: number = 1): this {
    this.dangerLevel = { level, roll }
    return this
  }

  /**
   * Build de hex met de geconfigureerde waardes
   */
  build(): Hex {
    // Als geen terrain type is opgegeven, gebruik random
    const finalTerrainType = this.terrainType ?? this.terrainStore.getRandomTerrainType()
    const terrain = this.terrainStore.getTerrain(finalTerrainType)

    // Genereer unieke ID gebaseerd op coordinates
    const id = `hex_${this.coordinates.q}_${this.coordinates.r}`

    // Determine danger level (use custom if set, otherwise roll)
    const danger = this.dangerLevel ?? rollDangerLevel()

    return {
      id,
      coordinates: { ...this.coordinates },
      terrain,
      terrainType: finalTerrainType,
      danger,
      createdAt: Date.now()
    }
  }

  /**
   * Reset de builder naar default waardes
   */
  reset(): this {
    this.coordinates = { q: 0, r: 0 }
    this.terrainType = null
    this.dangerLevel = null
    return this
  }
}

/**
 * Get neighboring hex coordinates (6 directions in axial coordinates)
 */
function getNeighborCoordinates(q: number, r: number): HexCoordinates[] {
  return [
    { q: q + 1, r: r },     // east
    { q: q - 1, r: r },     // west
    { q: q, r: r + 1 },     // southeast
    { q: q, r: r - 1 },     // northwest
    { q: q + 1, r: r - 1 }, // northeast
    { q: q - 1, r: r + 1 }  // southwest
  ]
}

/**
 * Factory function voor eenvoudige hex creatie
 */
export function createHex(q: number, r: number, terrainType?: TerrainType, existingHexMap?: Map<string, Hex>, forceSafe: boolean = false): Hex {
  const builder = new HexBuilder().setCoordinates(q, r)
  
  // Force safe if specified (for starting hex)
  if (forceSafe) {
    builder.setDangerLevel('safe', 1)
  }
  
  if (terrainType) {
    builder.setTerrainType(terrainType)
  } else {
    // Check for neighboring terrains to influence generation
    if (existingHexMap) {
      const neighborCoords = getNeighborCoordinates(q, r)
      const neighborTerrains: TerrainType[] = []
      
      neighborCoords.forEach(coord => {
        const neighborId = `hex_${coord.q}_${coord.r}`
        const neighbor = existingHexMap.get(neighborId)
        if (neighbor) {
          neighborTerrains.push(neighbor.terrainType)
        }
      })
      
      // Use terrain store with neighbor influence
      const terrainStore = useTerrainStore()
      const terrainType = terrainStore.getRandomTerrainType(neighborTerrains)
      builder.setTerrainType(terrainType)
    } else {
      builder.useRandomTerrain()
    }
  }
  
  return builder.build()
}

/**
 * Factory function voor het maken van meerdere hexes
 */
export function createHexGrid(width: number, height: number): Hex[] {
  const hexes: Hex[] = []
  
  for (let q = 0; q < width; q++) {
    for (let r = 0; r < height; r++) {
      hexes.push(createHex(q, r))
    }
  }
  
  return hexes
}
