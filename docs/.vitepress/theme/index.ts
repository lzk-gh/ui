import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import PhonePreview from './components/PhonePreview.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('PhonePreview', PhonePreview)
  },
} satisfies Theme
