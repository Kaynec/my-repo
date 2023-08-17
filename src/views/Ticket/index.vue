<template>
  <VCard class="w-full !p-5 !py-10 mt-5">
    <VRow dense>
      <VCol cols="4">
        <VTextField
          variant="outlined"
          append-inner-icon="mdi-magnify"
          rounded="lg"
          label="جستجو"
          v-model="searchTerm"
        >
        </VTextField>
      </VCol>
      <VCol cols="2">
        <VSelect variant="outlined" rounded="lg" label="نقش کاربر"> </VSelect>
      </VCol>
      <VCol cols="2">
        <VSelect
          variant="outlined"
          v-model="condition"
          rounded="lg"
          label="وضعیت"
        >
        </VSelect>
      </VCol>
      <VCol cols="2">
        <VSelect
          hide-details
          v-model="department"
          variant="outlined"
          rounded="lg"
        >
          <template v-slot:label>
            <span style="font-size: 13px">انتخاب دپارتمان</span>
          </template>
        </VSelect>
      </VCol>
      <VCol cols="2">
        <VSelect
          variant="outlined"
          v-model="importance"
          rounded="lg"
          label="نمایش بر اساس اولویت"
        >
        </VSelect>
      </VCol>
      <VCol cols="12">
        <VTable cols="12" class="h-70vh overflow-auto">
          <template v-slot:bottom>
            <div class="text-center pt-2">
              <v-pagination
                items-per-page="8"
                active-color="purple"
                elevation="6"
                color="#4C4E64"
                v-model="page"
                :length="pageCount"
              ></v-pagination>
            </div>
          </template>
          <thead>
            <tr>
              <th>شناسه</th>
              <th>کاربر</th>
              <th>دپارتمان</th>
              <th>تاریخ</th>
              <th>اولویت</th>
              <th>وضعیت</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in currentPieceOfData" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.department.name }}</td>
              <td>{{ new Date(item.created_at).toLocaleDateString('fa') }}</td>
              <td>{{ item.importance.name }}</td>
              <td>
                <VChip :text="item.condition" :color="getColor(item.condition)">
                </VChip>
              </td>
              <td>
                <RouterLink
                  @click="store.setTicket(item)"
                  :to="{
                    name: 'Ticket-id',
                    params: {
                      id: item.id
                    }
                  }"
                >
                  <VIcon color="#4C4E64"> mdi-eye </VIcon>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCol>
    </VRow>
  </VCard>
</template>

<script setup lang="ts">
import axios from '@/plugins/axios'
import { useGlobalStore } from '@/store/global'
import { useQuery } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

import { Ticket } from './types'
import { ref } from 'vue'
import { computed } from 'vue'
import { watch } from 'vue'

const store = useGlobalStore()

const page = ref(1)

const pageCount = computed(() => {
  return Math.ceil(dataForTheTable.value.length / store.paginationNumber)
})

const currentPieceOfData = computed(() => {
  const programaticPageCount = page.value - 1
  return dataForTheTable.value?.slice(programaticPageCount, 50)
})

const router = useRouter()

const initialData = ref<Ticket[]>([])
const dataForTheTable = ref<Ticket[]>([])

const { isLoading: courseLoading } = useQuery({
  queryKey: ['get-courses'],
  queryFn: async () => {
    const promises = []

    let dataToReturn = [] as any[]

    const res = await axios('/staff/tickets/')

    const numberOfLoopsToGoThrough =
      Math.ceil(res.data.count / store.paginationNumber) + 1

    for (let i = 1; i < numberOfLoopsToGoThrough; i++) {
      const res = axios(`/staff/tickets/?page=${i}`)

      promises.push(res)
    }

    const result = await Promise.all(promises)
    result.forEach(el => dataToReturn.push(...el.data.results))

    initialData.value = dataToReturn as Ticket[]

    dataForTheTable.value = dataToReturn as Ticket[]

    return dataToReturn as Ticket[]
  }
})

const getColor = (item: string) => {
  if (item === 'waiting') return 'orange'
  else if (item === 'open') return '#72E128'
  else if (item === 'closed') return '#6D788D'
  else return 'red'
}

const searchTerm = ref('')

const checkBySearchTerm = (arr: Ticket[]) => {
  if (!searchTerm.value) return arr
  return arr.filter((ticket: Ticket) => ticket.title.includes(searchTerm.value))
}

const importance = ref('')

const checkByImportance = (arr: Ticket[]) => {
  if (!importance.value) return arr
  return arr.filter(
    (ticket: Ticket) => ticket.importance.name === importance.value
  )
}

const department = ref('')

const checkByDepartment = (arr: Ticket[]) => {
  if (!department.value) return arr
  return arr.filter(
    (ticket: Ticket) => ticket.department.name === department.value
  )
}

const condition = ref('')

const checkByCondition = (arr: Ticket[]) => {
  if (!condition.value) return arr
  return arr.filter((ticket: Ticket) => ticket.condition === condition.value)
}

watch([searchTerm, department, importance, condition], () => {
  const currentArr = [...initialData.value]
  const searchTermArr = checkBySearchTerm(currentArr)
  const importanceArr = checkByImportance(searchTermArr)
  const departmentArr = checkByDepartment(importanceArr)
  const conditionArr = checkByCondition(departmentArr)
  dataForTheTable.value = conditionArr
})
</script>

<style>
.v-label .v-field-label {
  font-size: 0.55em !important;
}
:deep(.v-label) {
  font-size: 10px !important;
}
</style>
