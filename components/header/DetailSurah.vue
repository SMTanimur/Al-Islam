<script setup lang="ts">
// Interfaces

import type { ISurah } from '~/models/ISurah';
import { useAlQuranStore } from '~/stores/AlQuran';

// Store
const alQuranStore = useAlQuranStore()

// Emits
const emits = defineEmits(['show-detail', 'show-list'])

// Surah detail
const { data: surahDetail } = useNuxtData<ISurah>('surahDetail')
console.log(surahDetail,'detal')
// Play surah audio
const playSurah = () => {
  const data = {
    surah: surahDetail.value!.namaLatin,
    qori: 'Misyari Rasyid Al-Afasi',
    source: surahDetail.value!.audioFull,
  }
  if (surahDetail.value) alQuranStore.setPlayingAudio(data)
}
</script>

<template>
  <div
    v-if="surahDetail"
    class="sticky top-0 z-10 flex h-10 w-full items-center border-b border-slate-700/10 bg-white/75 backdrop-blur dark:border-slate-300/10 dark:bg-background-dark/70"
  >
    <div class="container flex items-center justify-between">
      <div
        class="flex cursor-pointer items-center gap-x-2"
        role="button"
        @click="emits('show-list')"
      >
        <Icon
          name="heroicons:squares-2x2-20-solid"
          class="text-base text-slate-800 md:text-lg dark:text-slate-200"
        />
        <p class="text-xs text-slate-800 md:text-sm dark:text-slate-200">
          {{ surahDetail.namaLatin }}
        </p>
      </div>

      <div class="flex items-center gap-x-4">
        <!-- Detail button -->
        <div
          class="flex cursor-pointer items-center text-xs text-slate-800 md:text-sm dark:text-slate-200"
          @click="emits('show-detail')"
        >
          <Icon
            name="heroicons:information-circle-solid"
            class="mr-1 text-base text-slate-800 md:text-lg dark:text-slate-200"
          />
          Detail
        </div>

        <!-- Play button -->
        <div
          class="flex cursor-pointer items-center text-xs text-rose-700 md:text-sm dark:text-rose-500"
          @click="playSurah"
        >
          <Icon
            name="heroicons:play-solid"
            class="mr-1 text-base text-rose-700 md:text-lg dark:text-rose-500"
          />
          Spin
        </div>
      </div>
    </div>
  </div>
</template>
