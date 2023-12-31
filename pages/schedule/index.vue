<script setup lang="ts">
import { useGeolocation } from '@vueuse/core'
// Interfaces
import type { ILocation } from '@/models/ILocation'
import type { IPrayerTime, ISchedule } from '@/models/IPrayerTime'

// Get coordinate
const { coords, pause: pauseWatchCoords } = useGeolocation()

// Variables
const isLoading = ref<boolean>(true)
const dataLocation = ref<ILocation | null>(null)
const idCity = ref<string>('')
const prayerTime = ref<IPrayerTime>()
const prayerTimeOneMonth = ref<ISchedule[]>()
const tabs = [
  {
    key: 'today',
    label: 'Hari Ini',
  },
  {
    key: 'this-month',
    label: '1 Bulan',
  },
]

// Watch coordinate
watch(
  () => coords.value.latitude,
  (val) => {
    if (val !== Infinity) getDataLocation()
  },
)

// Get date today
const dateToday = computed(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()

  return `${year}/${month}/${day}`
})

// Get data location
const getDataLocation = () => {
  useFetch(LOCATION_API, {
    query: {
      latitude: coords.value.latitude,
      longitude: coords.value.longitude,
      localityLanguage: 'id',
    },
    transform: (data: any) => {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        countryName: data.countryName,
        cityName: data.localityInfo.administrative[2].name,
      }
    },
  }).then((res) => {
    dataLocation.value = res.data.value
    pauseWatchCoords()
    getIdCity()
  })
}

// Search & get city location
const getIdCity = () => {
  useFetch(`/kota/cari/${dataLocation.value?.cityName}`, {
    baseURL: SHOLAT_API,
    transform: (data: any) => data.data[0].id,
  }).then((res) => {
    idCity.value = res.data.value
    getPrayerTime()
    getPrayerTimeOneMonth()
  })
}

// Get data prayer time
const getPrayerTime = () => {
  useFetch(`/jadwal/${idCity.value}/${dateToday.value}`, {
    baseURL: SHOLAT_API,
    transform: (data: any) => data.data,
  }).then((res) => {
    prayerTime.value = res.data.value
    isLoading.value = false
  })
}

// Get data prayer time 1 month
const getPrayerTimeOneMonth = () => {
  const date = dateToday.value.split('/')
  date.pop()

  useFetch(`/jadwal/${idCity.value}/${date.join('/')}`, {
    baseURL: SHOLAT_API,
    transform: (data: any) => {
      const date = new Date()
      const newData = data.data.jadwal.map((data: ISchedule, index: any) => {
        const value = { ...data }
        value.tanggal = index + 1 < 10 ? `0${index + 1}` : index + 1

        if (index + 1 === date.getDate()) {
          value.class = 'bg-rose-600/20 dark:bg-rose-500/20 rounded-lg'
        }

        return value
      })

      return newData
    },
  }).then((res) => {
    prayerTimeOneMonth.value = res.data.value
  })
}

// Meta
useHead({
  title: 'Jadwal Sholat | Islam App',
})
</script>

<template>
  <div class="container pt-20 md:pt-24">
    <!-- Header -->
    <div
      class="mb-8 flex items-center justify-between space-x-2 rounded-xl bg-gradient-to-br from-rose-700 to-rose-500 p-5 md:mb-10 dark:from-slate-700/50 dark:to-slate-600/60"
    >
      <div>
        <h1 class="text-xl font-semibold text-white md:text-2xl">Jadwal Sholat</h1>
        <p
          v-if="!isLoading"
          class="text-sm text-slate-100 md:text-base dark:text-slate-400"
        >
          {{ prayerTime?.jadwal.tanggal }}
        </p>

        <!-- Skeleton date -->
        <div
          v-else
          class="h-6 w-[224px] animate-pulse rounded-md bg-gray-300 dark:bg-slate-600/50"
        />

        <div class="mt-5 flex items-center space-x-2 text-white">
          <Icon
            name="heroicons:map-pin-solid"
            class="text-base md:text-lg"
          />
          <p
            v-if="!isLoading"
            class="text-sm capitalize md:text-base"
          >
            {{ dataLocation?.cityName }}, {{ prayerTime?.daerah.toLowerCase() }},
            {{ dataLocation?.countryName }}
          </p>

          <!-- Skeleton location -->
          <div
            v-else
            class="h-6 w-[224px] animate-pulse rounded-md bg-gray-300 dark:bg-slate-600/50"
          />
        </div>
      </div>

      <Icon
        name="fa6-solid:mosque"
        class="text-[70px] text-white/40 sm:text-[80px] dark:text-white/20"
      />
    </div>

    <!-- Tabs -->
    <UTabs
      :items="tabs"
      class="w-full"
      :ui="{
        container: 'pt-3',
        list: {
          background: 'bg-gray-100 dark:bg-background-dark-soft',
          tab: {
            active: 'bg-rose-600 text-white',
          },
        },
      }"
    >
      <template #item="{ item }">
        <!-- Prayer schedule today -->
        <div v-if="item.key === 'today'">
          <!-- Skeleton -->
          <SkeletonScheduleToday v-if="isLoading" />

          <ScheduleToday
            v-else
            :data-schedule="prayerTime!"
          />
        </div>

        <!-- Prayer schedule 1 month -->
        <div v-else-if="item.key === 'this-month'">
          <!-- Skeleton -->
          <div
            v-if="isLoading"
            class="h-[600px] w-full animate-pulse rounded-xl bg-gray-300 dark:bg-slate-700/30"
          />
          <ScheduleMonth
            v-else
            :data-schedule="prayerTimeOneMonth!"
          />
        </div>
      </template>
    </UTabs>
  </div>
</template>
