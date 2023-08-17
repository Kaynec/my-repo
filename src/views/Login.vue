<script setup lang="ts">
import { useGlobalStore } from '@/store/global'
import { updateToast } from '@/composables/useToast'
import SmallSpinner from '../components/SmallSpinner.vue'
import axios from '../plugins/axios'
import { nationalCodeValidator, requiredValidator } from '../validators'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VForm } from 'vuetify/components'

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const errors = ref<Record<string, string | undefined>>({
  nationalCode: undefined,
  password: undefined
})

const refVForm = ref<VForm>()
const nationalCode = ref('')
const password = ref('')

const store = useGlobalStore()

const isSendingRequest = ref(false)

const login = () => {
  isSendingRequest.value = true
  axios
    .post('/staff/login_with_password/', {
      national_code: nationalCode.value,
      password: password.value
    })
    .then(async r => {
      const { access, refresh } = r.data

      console.log(r.data)

      localStorage.setItem('accessToken', access)
      localStorage.setItem('refreshToken', refresh)

      axios
        .get('/profiles/my-profile/general-information/')
        .then(r => {
          isSendingRequest.value = false

          // USER DATA
          if (r.data) {
            localStorage.setItem('userData', JSON.stringify(r.data))
            store.setUserData(r.data)
          }
          // Redirect to `to` query if exist or redirect to index route
          router.replace(route.query.to ? String(route.query.to) : '/')
        })
        .catch(e => {
          isSendingRequest.value = false

          updateToast({
            color: 'error',
            text: 'نام کاربری یا رمز عبور اشتباه است'
          })
        })
    })
    .catch(e => {
      isSendingRequest.value = false
    })
}

const onSubmit = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) login()
  })
}
</script>

<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol cols="12" md="6" class="hidden lg:block">
      <div class="flex-center-row h-full custom">
        <img src="../assets/mahan-sm.png" max-w-25 aspect-1 />
        <div class="flex flex-col items-between gap-1rem pr-4">
          <h2 class="!text-white !font-800">مدرسه عالی کسب و کار ماهان</h2>
          <h5 class="!text-white !font-400">
            ماهان، اولین مدرسه کسب و کار در ایران
          </h5>
        </div>
      </div>
    </VCol>
    <VCol
      cols="12"
      md="6"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        class="w-90vw max-w-500px !p-3 text-center gap-4 space-y-4"
        style="background: rgba(10, 10, 10, 70%) !important"
      >
        <VForm ref="refVForm" @submit.prevent="onSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="nationalCode"
                label="کد ملی"
                type="text"
                :error-messages="errors.national_code"
                bg-color="white"
                autocomplete="current-national-code"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="password"
                label="رمز عبور"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :error-messages="errors.password"
                :append-inner-icon="
                  isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
                "
                autocomplete="current-password"
                bg-color="white"
              >
                <template #append-inner>
                  <v-icon color="white" v-if="isPasswordVisible">
                    mdi-eye-off-outline
                  </v-icon>
                  <v-icon color="white" v-else> mdi-eye-outline </v-icon>
                </template>
              </VTextField>

              <VBtn class="!py-3 !min-h-15 mt-5 block w-full" type="submit">
                <SmallSpinner v-if="isSendingRequest" />
                <span v-else> ورود </span>
              </VBtn>
            </VCol>
          </VRow>
          <router-link class="text-gray-3" to="/loginticket">
            مشکلی برای ورود دارید؟ ثبت تیکت
          </router-link>
        </VForm>

        <img src="../assets/logo.png" aspect-auto />
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.layout-blank {
  .auth-wrapper {
    min-block-size: 100svh;
    background-color: red !important;
  }

  .auth-card {
    z-index: 1 !important;
  }
}

@media (width >= 960px) {
  .skin--bordered {
    // .auth-card-v2 {
    //   border-inline-start: 1px solid
    //     rgba(var(--v-border-color), var(--v-border-opacity));
    // }
  }
}

@media (width <= 1200px) {
  .auth-footer-mask {
    inset-block-end: 12% !important;
  }
}

.auth-logo {
  position: absolute;
  z-index: 1;
  inset-block-start: 1.8rem;
  inset-inline-start: 2.5rem;
}

.auth-card-v2 {
  z-index: 1;
}

.auth-illustration {
  z-index: 1;
  max-inline-size: 48rem;
}

.auth-footer-mask {
  position: absolute;
  inline-size: 100%;
  inset-block-end: 7%;
}

.auth-wrapper {
  // background-color: red;
  background: url('../assets/bg-2.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
}

.custom {
  backdrop-filter: blur(5px);
  background: rgba(29, 29, 29, 20%);
  box-shadow: -4px 0 10px rgba(0, 0, 0, 43%);
}
</style>
