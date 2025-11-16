import type { Hex, HexCoordinates } from '../types/hex'
import type { TerrainType } from '../stores/terrain'
import { useTerrainStore } from '../stores/terrain'

/**
 * Builder pattern voor het maken van Hex objecten
 */
export class HexBuilder {
  private coordinates: HexCoordinates = { q: 0, r: 0 }
  private terrainType: TerrainType | null = null
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
   * Build de hex met de geconfigureerde waardes
   */
  build(): Hex {
    // Als geen terrain type is opgegeven, gebruik random
    const finalTerrainType = this.terrainType ?? this.terrainStore.getRandomTerrainType()
    const terrain = this.terrainStore.getTerrain(finalTerrainType)

    // Genereer unieke ID gebaseerd op coordinates
    const id = `hex_${this.coordinates.q}_${this.coordinates.r}`

    return {
      id,
      coordinates: { ...this.coordinates },
      terrain,
      terrainType: finalTerrainType,
      createdAt: Date.now()
    }
  }

  /**
   * Reset de builder naar default waardes
   */
  reset(): this {
    this.coordinates = { q: 0, r: 0 }
    this.terrainType = null
    return this
  }
}

/**
 * Factory function voor eenvoudige hex creatie
 */
export function createHex(q: number, r: number, terrainType?: TerrainType): Hex {
  const builder = new HexBuilder().setCoordinates(q, r)
  
  if (terrainType) {
    builder.setTerrainType(terrainType)
  } else {
    builder.useRandomTerrain()
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
