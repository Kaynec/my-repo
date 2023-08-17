import { isEmpty, isEmptyArray, isNullOrUndefined } from './index'

// 👉 IsEmpty
const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') return true

  return !!(Array.isArray(value) && value.length === 0)
}

// 👉 IsNullOrUndefined
const isNullOrUndefined = (value: unknown): value is undefined | null => {
  return value === null || value === undefined
}

// 👉 IsEmptyArray
const isEmptyArray = (arr: unknown): boolean => {
  return Array.isArray(arr) && arr.length === 0
}

// 👉 IsObject
const isObject = (obj: unknown): obj is Record<string, unknown> =>
  obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)

const isToday = (date: Date) => {
  const today = new Date()

  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

// 👉 Required Validator
export const requiredValidator = (value: unknown) => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'این فیلد ضروری است'

  return !!String(value).trim().length || 'این فیلد ضروری است'
}

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value)) return true

  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'ایمیل صحیح نمیباشد'

  return re.test(String(value)) || 'ایمیل صحیح نمیباشد'
}

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return (
    // eslint-disable-next-line operator-linebreak
    validPassword || 'این فیلد باید حداقل 8 رقم و دارای یک کاراکنر خاص باشد'
  )
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string) =>
  value === target || 'تکرار رمز عبور با رمز عبور یکسان نیست'

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)

  return (
    (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) ||
    `عدد وارد شده باید بین ${min} و ${max} باشد`
  )
}

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value)) return true

  if (Array.isArray(value))
    return (
      value.every(val => /^-?[0-9]+$/.test(String(val))) ||
      'این فیلد باید عدد باشد'
    )

  return /^-?[0-9]+$/.test(String(value)) || 'این فیلد باید عدد باشد'
}

// 👉 Regex Validator
export const regexValidator = (
  value: unknown,
  regex: RegExp | string
): string | boolean => {
  if (isEmpty(value)) return true

  let regeX = regex
  if (typeof regeX === 'string') regeX = new RegExp(regeX)

  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'فرمت اشتباه است'
}

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value)) return true

  return /^[A-Z]*$/i.test(String(value)) || 'لطفا فقط حروف وارد نمایید'
}

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value)) return true

  const re =
    /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(String(value)) || 'URL وارد شده اشتباه است'
}

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value)) return true

  return (
    String(value).length === length || `تعداد حروف باید حداقل ${length} باشد`
  )
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value)) return true

  const valueAsString = String(value)

  return /^[0-9A-Z_-]*$/i.test(valueAsString) || 'All Character are not valid'
}
// 👉 Alpha-dash Validator
export const nationalCodeValidator = (value: unknown) => {
  if (isEmpty(value)) return true

  const valueAsString = String(value)

  return /^(?!(\d)\1{9})\d{10}$/i.test(valueAsString) || 'کد ملی صحیح نمیباشد'
}
