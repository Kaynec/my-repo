<template>
  <div class="!relative">
    <VCard class="w-full !p-5 !py-5 mt-2 pb-7rem">
      <VRow dense>
        <VCol cols="6" lg="2">
          <VCard
            class="!bg-#6D788D rounded-lg !bg-opacity-30 py-5 px-3 !text-#6D788D"
          >
            {{ ticket.title }}
          </VCard>
        </VCol>
        <VCol cols="6" lg="2">
          <VCard
            class="!bg-#6D788D rounded-lg !bg-opacity-30 py-5 px-3 !text-#6D788D"
          >
            {{ ticket.title }}
          </VCard>
        </VCol>
        <VCol cols="6" lg="2">
          <VCard
            class="!bg-#6D788D rounded-lg !bg-opacity-30 py-5 px-3 !text-#6D788D"
          >
            {{ ticket.title }}
          </VCard>
        </VCol>
        <VCol cols="6" lg="2">
          <VCard
            class="!bg-#6D788D rounded-lg !bg-opacity-30 py-5 px-3 !text-#6D788D"
          >
            {{ ticket.title }}
          </VCard>
        </VCol>
        <VCol cols="6" lg="2">
          <VCard
            class="!bg-#6D788D rounded-lg !bg-opacity-30 py-5 px-3 !text-#6D788D"
          >
            {{ ticket.title }}
          </VCard>
        </VCol>
        <VCol>
          <VBtn
            cols="6"
            lg="1"
            class="bg-#525252 text-white rounded-lg min-h-full shadow-0"
          >
            بستن تیکت
          </VBtn>
        </VCol>

        <VCol
          cols="12"
          class="mt-4 !max-h-50vh !overflow-auto flex flex-col gap-2 my-3 border-1 border-#ddd border-solid !p-2"
        >
          <div v-for="msg in msgs" :key="msg.id">
            <VCard
              rounded="lg"
              class="min-h-30 !shadow-xs !p-5 !pb-8 relative"
              elevation="6"
              :style="`background:${msg.sender === (store.userData as any).id ? 'rgba(76, 78, 100, 0.1)' :
        '#fff'
        } !important`"
            >
              <span> {{ msg.message }}</span>

              <span class="absolute left-5 bottom-2" v-if="msg?.created_at">
                پیام شما

                <text class="mx-1">
                  {{ format(new Date(msg.created_at), 'EEEE dd MMMM yyyy ') }}
                </text>

                پیش ارسال شده است.
              </span>
            </VCard>
          </div>
        </VCol>
      </VRow>
      <VForm class="p-3" @submit.prevent="createTicket()">
        <VRow mx-auto>
          <VCol>
            <textarea
              placeholder="پیام خودرا بنویسید..."
              class="!placeholder-text-gray-4 !shadow-lg border-1 border-#ddd border-solid !rounded-15px bg-#FFF resize-none p-3 !sticky !top-0 max-h-7rem w-full"
              rows="15"
              v-model="message.msg"
            ></textarea>
          </VCol>
        </VRow>
        <VRow mx-auto justify="end">
          <VCol cols="12" md="3">
            <input
              type="file"
              hidden
              ref="fileInput"
              @change="
                e => {
                  message.file = e.target?.files[0]
                }
              "
            />
            <div
              class="b-1px b-solid p-4 min-h-15 rounded-15px b-#393939 w-full h-full"
              style="
                background: linear-gradient(
                    0deg,
                    rgba(255, 255, 255, 0.88) 0%,
                    rgba(255, 255, 255, 0.88) 100%
                  ),
                  #6d788d;
              "
              @click="fileInput.click()"
            >
              <span v-if="!message.file"> انتخاب فایل </span>
              <span v-else> {{ message.file?.name }} </span>
            </div>
          </VCol>
          <VCol cols="12" md="2">
            <VBtn
              type="submit"
              class="w-full h-full min-h-15 rounded-15px bg-#6D788D text-white"
            >
              ارسال
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import { updateToast } from '@/composables/useToast'
import axios from '@/plugins/axios'
import { useGlobalStore } from '@/store/global'
import { useQuery } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Ticket, Message } from './types'
import { format } from 'date-fns-jalali'
const store = useGlobalStore()

const router = useRouter()

const id = router.currentRoute.value.params.id

const { data: msgs, isLoading } = useQuery({
  queryKey: ['get-messages', id],

  queryFn: async () => {
    const promises = []

    const dataToReturn = [] as any

    const res = await axios(`/staff/messages/${id}`)

    const numberOfLoopsToGoThrough =
      Math.ceil(res.data.count / store.paginationNumber) + 1

    for (let i = 1; i < numberOfLoopsToGoThrough; i++) {
      const res = axios(`/staff/messages/${id}/?page=${i}`)

      promises.push(res)
    }

    const result = await Promise.all(promises)
    result.forEach(el => dataToReturn.push(...el.data.results))

    return dataToReturn as Message[]
  }
})

const createFormData = () => {
  const msgFormData = new FormData()

  msgFormData.append('message', message.value.msg)
  if (message.value.file && typeof message.value.file === 'object') {
    msgFormData.append('uploaded_files', message.value.file)
  }
  return msgFormData
}

const ticket = store.ticket as Ticket

const message = ref({
  title: '',
  department: '',
  importance: '',
  msg: '',
  file: ''
})

const fileInput = ref()

const handleFormErrors = () => {
  if (!message.value.msg) {
    updateToast({
      color: 'error',
      text: 'لطفا متن پیام را مشخص کنید'
    })
    return false
  }
  return true
}

const createTicket = async () => {
  const shouldContinue = handleFormErrors()

  const formData = createFormData()

  if (!shouldContinue) return

  const errorFN = () => {
    updateToast({
      color: 'error',
      text: 'خطایی در فرآیند ساخت تیکت رخ داده است'
    })
  }

  axios
    .post(`/staff/messages/create/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      updateToast({
        color: 'success',
        text: 'پاسخ شما با موفقیت ارسال شد'
      })
      router.push({
        name: 'Ticket'
      })
    })
    .catch(() => {
      errorFN()
    })
}
</script>

<style>
.v-label .v-field-label {
  font-size: 0.55em !important;
}
:deep(.v-label) {
  font-size: 10px !important;
}
</style>
