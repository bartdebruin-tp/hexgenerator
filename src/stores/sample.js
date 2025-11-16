import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSampleStore = defineStore('sample', () => {
  // State
  const sampleName = ref('Sample Name')

  function exportSample() {
    return {
      sampleName: sampleName.value,
    }
  }
  
  function loadFaction(data) {
    sampleName.value = data.sampleName || 'Sample Name'
  }

  return {
    // State
    sampleName,
    // Actions
    exportSample,
    loadFaction
  }
})