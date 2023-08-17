import { ref } from 'vue'

export const toastData = ref({
  text: '',
  color: '',
  value: false
})
export function updateToast (
  newToast: Partial<typeof toastData.value> = {
    color: 'success',
    value: true,
    text: 'توست'
  }
) {
  const objectToSet = { ...newToast, value: true } as typeof toastData.value
  toastData.value = objectToSet
}
