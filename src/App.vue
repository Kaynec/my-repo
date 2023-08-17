<script setup lang="ts">
import { toastData } from './composables/useToast'
</script>

<template>
  <VApp relative>
    <!-- toast -->
    <v-snackbar
      timeout="3000"
      :color="toastData.color === 'success' ? `#00FF007F` : toastData.color"
      v-model="toastData.value"
      multi-line
    >
      <span text-white> {{ toastData.text }} </span>

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="toastData.value = false">
          بستن
        </v-btn>
      </template>
    </v-snackbar>
    <RouterView />
  </VApp>
</template>
