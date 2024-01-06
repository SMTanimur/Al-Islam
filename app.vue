<script setup lang="ts">
import { useAlQuranStore } from './stores/AlQuran';

// Store
const alQuranStore = useAlQuranStore()
</script>

<template>
  <div
    id="content"
    :class="{ 'pb-[140px]': alQuranStore.getPlayingAudio }"
  >


    <Header />

    <main class="min-h-[100vh] pb-8">
      <NuxtPage />

      <AudioPlayer />
    </main>

    <Footer />

  </div>
</template>
