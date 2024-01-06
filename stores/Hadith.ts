import {type IHadithHistory } from './../models/IHadith';
import { defineStore } from 'pinia'
// Interface


// Type state
type Store = {
  hadithHistory: IHadithHistory[]
}

export const useHadithStore = defineStore({
  id: 'hadithStore',

  state: (): Store => ({
    hadithHistory: [],
  }),

  getters: {
    getHadithHistory: (state) => state.hadithHistory,
  },

  actions: {
    setHadithHistory(data: IHadithHistory[]) {
      this.hadithHistory = data
    },
  },
})
