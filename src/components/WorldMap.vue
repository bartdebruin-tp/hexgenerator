<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Hex } from '@/types/hex'
import { createHex } from '@/factories/hexBuilder'
import { MapPinIcon } from '@heroicons/vue/24/solid'

interface Props {
  width?: number
  height?: number
  hexSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 10,
  height: 10,
  hexSize: 40
})

// Initialize world map with starting hex at 0,0
const hexMap = ref<Map<string, Hex>>(new Map())

// Create starting hex (always safe)
const startingHex = createHex(0, 0, 'grass', undefined, true)
hexMap.value.set(startingHex.id, startingHex)

// Pan state
const isPanning = ref(false)
const panOffset = ref({ x: 0, y: 0 })
const panStart = ref({ x: 0, y: 0 })
const svgRef = ref<SVGSVGElement | null>(null)

// Calculate hex dimensions
const hexWidth = computed(() => props.hexSize * 2)
const hexHeight = computed(() => Math.sqrt(3) * props.hexSize)

// Calculate grid range to support negative coordinates (centered around 0,0)
const minQ = computed(() => -Math.floor(props.width / 2))
const maxQ = computed(() => Math.ceil(props.width / 2))
const minR = computed(() => -Math.floor(props.height / 2))
const maxR = computed(() => Math.ceil(props.height / 2))

// Calculate offset to center the grid in the viewBox
const offsetX = computed(() => Math.abs(minQ.value) * hexWidth.value * 0.75)
const offsetY = computed(() => Math.abs(minR.value) * hexHeight.value + Math.abs(minQ.value) * hexHeight.value * 0.5)

// Convert axial coordinates (q, r) to pixel coordinates
const hexToPixel = (q: number, r: number): { x: number; y: number } => {
  const x = props.hexSize * (3/2 * q) + offsetX.value
  const y = props.hexSize * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r) + offsetY.value
  return { x, y }
}

// Generate SVG path for hexagon
const getHexagonPath = (size: number): string => {
  const points: { x: number; y: number }[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    points.push({
      x: size * Math.cos(angle),
      y: size * Math.sin(angle)
    })
  }
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z'
}

const hexagonPath = computed(() => getHexagonPath(props.hexSize))

// Calculate viewBox based on map size with padding
const viewBoxWidth = computed(() => props.width * hexWidth.value + props.hexSize * 2)
const viewBoxHeight = computed(() => props.height * hexHeight.value + props.hexSize * 2)

// Get all hexagons within a certain distance (rings) from a center hex
const getHexRing = (centerQ: number, centerR: number, radius: number): Array<{ q: number; r: number }> => {
  const results: Array<{ q: number; r: number }> = []
  
  if (radius === 0) {
    return [{ q: centerQ, r: centerR }]
  }
  
  // Cube coordinates for hex ring algorithm
  const directions = [
    { q: 1, r: 0 },    // east
    { q: 0, r: 1 },    // southeast
    { q: -1, r: 1 },   // southwest
    { q: -1, r: 0 },   // west
    { q: 0, r: -1 },   // northwest
    { q: 1, r: -1 }    // northeast
  ]
  
  // Start at radius distance in one direction
  let q = centerQ + directions[4].q * radius
  let r = centerR + directions[4].r * radius
  
  // Walk around the ring
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      results.push({ q, r })
      q += directions[i].q
      r += directions[i].r
    }
  }
  
  return results
}

// Get all hexagons within N rings from a center
const getHexesInRadius = (centerQ: number, centerR: number, rings: number): Array<{ q: number; r: number }> => {
  const results: Array<{ q: number; r: number }> = []
  
  for (let radius = 0; radius <= rings; radius++) {
    results.push(...getHexRing(centerQ, centerR, radius))
  }
  
  return results
}

// Get visible hexagons (discovered + 2 rings around each discovered hex)
const visibleHexes = computed(() => {
  const visible = new Set<string>()
  
  // For each discovered hex, add it and 2 rings around it
  hexMap.value.forEach((hex) => {
    const hexesInRange = getHexesInRadius(hex.coordinates.q, hex.coordinates.r, 2)
    hexesInRange.forEach(({ q, r }) => {
      visible.add(`hex_${q}_${r}`)
    })
  })
  
  return visible
})

// Generate empty hex grid with negative coordinates (only visible ones)
const emptyHexGrid = computed(() => {
  const grid: { q: number; r: number; id: string }[] = []
  
  visibleHexes.value.forEach((id) => {
    if (!hexMap.value.has(id)) {
      // Extract q and r from id
      const parts = id.split('_')
      const q = parseInt(parts[1])
      const r = parseInt(parts[2])
      grid.push({ q, r, id })
    }
  })
  
  return grid
})

// Get hex color
const getHexColor = (hex: Hex | undefined): string => {
  return hex?.terrain.color || '#f0f0f0'
}

// Get danger border styling
const getDangerStroke = (dangerLevel: string): { color: string; width: number; dasharray?: string } => {
  switch (dangerLevel) {
    case 'unsafe':
      return { color: '#FFA500', width: 1.5, dasharray: '4,2' } // Orange dashed
    case 'risky':
      return { color: '#FF4500', width: 2, dasharray: '2,1' } // Red-orange dashed
    case 'deadly':
      return { color: '#8B0000', width: 2.5 } // Dark red thick
    default:
      return { color: '#333333', width: 1 } // Default black
  }
}

// Handle hex click
const handleHexClick = (q: number, r: number): void => {
  // Only create hex if not panning (to distinguish between pan and click)
  if (isPanning.value) return
  
  const id = `hex_${q}_${r}`
  
  if (!hexMap.value.has(id)) {
    // Pass existing hex map to influence terrain generation
    const newHex = createHex(q, r, undefined, hexMap.value)
    hexMap.value.set(id, newHex)
  }
}

// Pan handlers
const handleMouseDown = (event: MouseEvent): void => {
  isPanning.value = true
  panStart.value = {
    x: event.clientX - panOffset.value.x,
    y: event.clientY - panOffset.value.y
  }
}

const handleMouseMove = (event: MouseEvent): void => {
  if (!isPanning.value) return
  
  panOffset.value = {
    x: event.clientX - panStart.value.x,
    y: event.clientY - panStart.value.y
  }
}

const handleMouseUp = (): void => {
  isPanning.value = false
}

const handleMouseLeave = (): void => {
  isPanning.value = false
}

// Transform for panning
const viewTransform = computed(() => {
  return `translate(${panOffset.value.x}, ${panOffset.value.y})`
})
</script>

<template>
  <div class="world-map-container">
    <div class="mb-4">
      <h2 class="text-2xl font-bold text-gray-800">World Map</h2>
      <p class="text-sm text-gray-600">Click on empty hexagons to generate terrain • Drag to pan</p>
    </div>
    
    <div 
      class="map-wrapper border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50"
      :class="{ 'cursor-grabbing': isPanning, 'cursor-grab': !isPanning }"
    >
      <svg 
        ref="svgRef"
        :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
        class="w-full h-full select-none"
        style="min-height: 500px;"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
      >
        <g :transform="viewTransform">
          <!-- Empty hexagons -->
          <g v-for="hex in emptyHexGrid" :key="`empty-${hex.id}`">
          <g 
            :transform="`translate(${hexToPixel(hex.q, hex.r).x + hexWidth / 2}, ${hexToPixel(hex.q, hex.r).y + hexHeight / 2})`"
            class="cursor-pointer hover:opacity-75 transition-opacity"
            @click="handleHexClick(hex.q, hex.r)"
          >
            <path 
              :d="hexagonPath"
              fill="#f0f0f0"
              stroke="#cccccc"
              stroke-width="2"
            />
            <text
              text-anchor="middle"
              dominant-baseline="middle"
              class="text-xs fill-gray-400 pointer-events-none"
              font-size="10"
            >
              {{ hex.q }},{{ hex.r }}
            </text>
            </g>
          </g>

          <!-- Generated hexagons with terrain -->
          <g v-for="[id, hex] in hexMap" :key="`filled-${id}`">
          <g 
            :transform="`translate(${hexToPixel(hex.coordinates.q, hex.coordinates.r).x + hexWidth / 2}, ${hexToPixel(hex.coordinates.q, hex.coordinates.r).y + hexHeight / 2})`"
            class="cursor-pointer hover:opacity-90 transition-opacity"
          >
            <path 
              :d="hexagonPath"
              :fill="getHexColor(hex)"
              :stroke="getDangerStroke(hex.danger.level).color"
              :stroke-width="getDangerStroke(hex.danger.level).width"
              :stroke-dasharray="getDangerStroke(hex.danger.level).dasharray"
            />
            <g v-if="hex.location">
              <foreignObject
                :x="-10"
                :y="-18"
                width="20"
                height="20"
              >
                <MapPinIcon 
                  :class="{
                    'w-5 h-5 drop-shadow-lg': true,
                    'text-blue-500': hex.location.type === 'landmark',
                    'text-green-500': hex.location.type === 'settlement',
                    'text-red-500': hex.location.type === 'lair',
                    'text-purple-500': hex.location.type === 'dungeon'
                  }"
                  :title="`${hex.location.type}: ${hex.location.name}`"
                />
              </foreignObject>
            </g>
            <text
              text-anchor="middle"
              dominant-baseline="middle"
              class="text-xs fill-white pointer-events-none"
              font-size="8"
              dy="4"
            >
              {{ hex.coordinates.q }},{{ hex.coordinates.r }}
            </text>
          </g>
        </g>
        </g>
      </svg>
    </div>

    <!-- Legend -->
    <div class="mt-4 flex flex-wrap gap-3 justify-center">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #90EE90;"></div>
        <span class="text-sm text-gray-700">Grass</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #228B22;"></div>
        <span class="text-sm text-gray-700">Forest</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #8B7355;"></div>
        <span class="text-sm text-gray-700">Mountain</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #4A5D23;"></div>
        <span class="text-sm text-gray-700">Swamp</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #EDC9AF;"></div>
        <span class="text-sm text-gray-700">Desert</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #8B9467;"></div>
        <span class="text-sm text-gray-700">Hills</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #7CB9E8;"></div>
        <span class="text-sm text-gray-700">Coastal</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #6B8E23;"></div>
        <span class="text-sm text-gray-700">Wetlands</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #C2B280;"></div>
        <span class="text-sm text-gray-700">Savannah</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded" style="background-color: #3B3C36;"></div>
        <span class="text-sm text-gray-700">Deadlands</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 rounded bg-gray-200 border border-gray-400"></div>
        <span class="text-sm text-gray-700">Empty</span>
      </div>
    </div>

    <!-- Danger Legend -->
    <div class="mt-3 pt-3 border-t border-gray-300">
      <h3 class="text-sm font-semibold text-gray-700 mb-2 text-center">Danger Levels</h3>
      <div class="flex flex-wrap gap-3 justify-center">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border-2 border-gray-800"></div>
          <span class="text-sm text-gray-700">Safe</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border-3" style="border: 3px dashed #FFA500;"></div>
          <span class="text-sm text-gray-700">Unsafe</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded border-4" style="border: 4px dashed #FF4500;"></div>
          <span class="text-sm text-gray-700">Risky</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded" style="border: 5px solid #8B0000;"></div>
          <span class="text-sm text-gray-700">Deadly</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.world-map-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.map-wrapper {
  max-height: 600px;
  position: relative;
}

svg {
  display: block;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
