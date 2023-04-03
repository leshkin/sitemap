import 'highlight.js/styles/vs2015.css'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import hljsVuePlugin from '@highlightjs/vue-plugin'

export default defineNuxtPlugin((nuxtApp) => {
  hljs.registerLanguage('xml', xml)
  nuxtApp.vueApp.use(hljsVuePlugin)
})
