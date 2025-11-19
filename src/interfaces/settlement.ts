/**
 * Settlement Interfaces
 */

export interface Settlement {
  name: string
  description?: string
  population?: number
}

export interface Hamlet extends Settlement {
  mainBuilding: string
}
