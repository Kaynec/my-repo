import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore(
  'global',
  () => {
    const userData = ref({})
    const ticket = ref({})
    function setUserData (newUserData: unknown) {
      userData.value = newUserData
    }
    function setTicket (newTicket: any) {
      ticket.value = newTicket
    }
    const paginationNumber = 50
    return {
      userData,
      setUserData,
      ticket,
      setTicket,
      paginationNumber
    }
  },

  {
    persist: true
  }
)

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGlobalStore, import.meta.hot))
