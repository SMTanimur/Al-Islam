<script setup lang="ts">
import type { IVerse } from '~/models/ISurah';
import { useAlQuranStore } from '~/stores/AlQuran';

// Interfaces


// Props
const props = defineProps({
  surahName: {
    type: String,
    default: '',
  },
  surahNumber: {
    type: Number,
    default: 0,
  },
  verse: {
    type: Object as PropType<IVerse>,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
})

// Emits
const emits = defineEmits(['open-tafsir'])

// Store
const alQuranStore = useAlQuranStore()

// Play surah audio
const playSurah = () => {
  const data: any = {
    surah: `${props.surahName} - ${props.verse.nomorAyat}`,
    qori: 'Misyari Rasyid Al-Afasi',
    source: Object.values(props.verse.audio).find((audio: any) => audio.includes('Misyari')),
  }
  alQuranStore.setPlayingAudio(data)
}
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <!-- Header -->
    <div
      class="flex items-center justify-between rounded-xl bg-rose-600/10 px-4 py-1.5 dark:bg-rose-200/10"
    >
      <!-- Number surah & ayat -->
      <p class="text-sm font-semibold tracking-wide text-rose-700 dark:text-rose-500">
        {{ verse.nomorAyat }}
      </p>

      <div class="flex items-center gap-1">
        <!-- Play ayat -->
        <UTooltip text="Putar ayat">
          <div
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg text-rose-700 hover:bg-rose-100/60 dark:text-rose-500 hover:dark:bg-rose-200/10"
            role="button"
            @click="playSurah"
          >
            <Icon name="heroicons:play" />
          </div>
        </UTooltip>

        <!-- Button tafsir -->
        <UTooltip text="Tafsir">
          <div
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-lg text-rose-700 hover:bg-rose-100/60 dark:text-rose-500 hover:dark:bg-rose-200/10"
            role="button"
            @click="emits('open-tafsir', index)"
          >
            <Icon name="heroicons:book-open" />
          </div>
        </UTooltip>
      </div>
    </div>

    <div class="w-full">
      <p
        dir="rtl"
        lang="ar"
        class="mb-5 text-right font-mono text-3xl leading-[65px] text-slate-800 md:!leading-[70px] lg:text-4xl lg:!leading-[80px] dark:text-slate-200"
      >
        {{ verse.teksArab }}
      </p>

      <p class="mb-3 text-sm !leading-7 tracking-wide text-rose-800 md:text-base dark:text-white">
        {{ verse.teksLatin }}
      </p>
      <p class="text-sm !leading-7 text-smoke-1 md:text-base dark:text-slate-400">
        {{ verse.teksIndonesia }}
      </p>
    </div>
  </div>
</template>
