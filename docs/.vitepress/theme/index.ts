import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import PhonePreview from './components/PhonePreview.vue'
import HomePage from './components/HomePage.vue'
import PropsPlayground from './components/PropsPlayground.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('PhonePreview', PhonePreview)
    app.component('HomePage', HomePage)
    app.component('PropsPlayground', PropsPlayground)
  },
} satisfies Theme
