import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'
    ],
    ['error-message', 'text-red-600 text-xs m-1.2'],
    ['flex-center-row', 'flex flex-row justify-center items-center'],
    ['flex-center-column', '!flex flex-col justify-center items-center '],
    [
      'class-icons',
      'flex items-center text-.75em justify-center gap-2 font-600'
    ],
    [
      'profile-div-rows',
      'flex items-center justify-between bg-white shadow-md rounded-xl w-full p-3 py-4 text-xs font-600'
    ],
    [
      'input-bg-gray',
      'bg-gray-50 border font-600 text-#6969AF border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500'
    ],
    ['mobile-container', 'w-11/12 mx-auto md:w-full'],
    ['footer-pb', 'pb-22% md:pb-0'],
    ['text_xs', 'text-2vw md:text-xs'],
    ['text_s', 'text-2.75vw md:text-xs'],
    ['text_sm', 'text-3vw md:text-sm'],
    ['text_base', 'text-4vw md:text-base'],
    ['text_lg', 'text-5vw md:text-lg'],
    ['text_xl', 'text-6vw md:text-xl'],
    ['text_2xl', 'text-7vw md:text-2xl']
  ],
  theme: {
    colors: {
      text_color: '#4C4E64B2',
      accent: '#4C4E64B2',
      primary: '#6969AF',
      secondary: '#FE7A59',
      inputDarkBg: '#323232'
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 2,
      warn: true
    }),
    presetTypography()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left'.split(' ')
})
