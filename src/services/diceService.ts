/**
 * Dice Service
 * Responsible for rolling dice and returning results
 */

import { generateLandmark as generateLandmarkFromService } from './landmarkService'
import { generateSettlement as generateSettlementFromService } from './settlementService'
import { generateLair as generateLairFromService } from './lairService'
import { generateDungeon as generateDungeonFromService } from './dungeonService'

export interface DiceRollResult {
  total: number
  rolls: number[]
}

/**
 * Roll a single die with specified number of sides
 * @param sides Number of sides on the die (e.g., 6 for d6)
 * @returns The result of the roll (1 to sides)
 */
export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

/**
 * Roll multiple dice with specified number of sides
 * @param count Number of dice to roll
 * @param sides Number of sides on each die
 * @returns DiceRollResult with total sum and individual rolls
 */
export function rollDice(count: number, sides: number): DiceRollResult {
  const rolls: number[] = []
  
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides))
  }
  
  const total = rolls.reduce((sum, roll) => sum + roll, 0)
  
  return {
    total,
    rolls
  }
}

/**
 * Roll 1d6 (one six-sided die)
 * @returns The result of one d6 roll (1-6)
 */
export function roll1d6(): number {
  return rollDie(6)
}

/**
 * Determine danger level based on 1d6 roll
 * 1 = Safe, 2-3 = Unsafe, 4-5 = Risky, 6 = Deadly
 * @returns Object with danger level and roll result
 */
export function rollDangerLevel(): { level: 'safe' | 'unsafe' | 'risky' | 'deadly', roll: number } {
  const roll = roll1d6()
  
  let level: 'safe' | 'unsafe' | 'risky' | 'deadly'
  
  if (roll === 1) {
    level = 'safe'
  } else if (roll >= 2 && roll <= 3) {
    level = 'unsafe'
  } else if (roll >= 4 && roll <= 5) {
    level = 'risky'
  } else {
    level = 'deadly'
  }
  
  return { level, roll }
}

/**
 * Roll 1d20 (one twenty-sided die)
 * @returns The result of one d20 roll (1-20)
 */
export function roll1d20(): number {
  return rollDie(20)
}

/**
 * Roll with advantage (roll twice, take highest)
 * @param sides Number of sides on the die
 * @returns The higher of two rolls
 */
export function rollWithAdvantage(sides: number): number {
  const roll1 = rollDie(sides)
  const roll2 = rollDie(sides)
  return Math.max(roll1, roll2)
}

/**
 * Roll with disadvantage (roll twice, take lowest)
 * @param sides Number of sides on the die
 * @returns The lower of two rolls
 */
export function rollWithDisadvantage(sides: number): number {
  const roll1 = rollDie(sides)
  const roll2 = rollDie(sides)
  return Math.min(roll1, roll2)
}

/**
 * @deprecated Use landmarkService.generateLandmark() instead
 * Generate a random landmark name
 * @returns A random landmark name
 */
export function generateLandmark(): string {
  return generateLandmarkFromService().name
}

/**
 * @deprecated Use settlementService.generateSettlement() instead
 * Generate a random settlement name
 * @returns A random settlement name
 */
export function generateSettlement(): string {
  return generateSettlementFromService().name
}

/**
 * @deprecated Use lairService.generateLair() instead
 * Generate a random lair name
 * @returns A random lair name
 */
export function generateLair(): string {
  return generateLairFromService().name
}

/**
 * @deprecated Use dungeonService.generateDungeon() instead
 * Generate a random dungeon name
 * @returns A random dungeon name
 */
export function generateDungeon(): string {
  return generateDungeonFromService().name
}
