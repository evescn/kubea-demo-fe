import { inject, provide, ref } from 'vue'

export function provideMenu() {
  const isMenuVisiable = ref(false)
  const showMenu = () => {
    isMenuVisiable.value = true
  }
  provide('menu', {
    isMenuVisiable,
    showMenu
  })

  return {
    isMenuVisiable,
    showMenu
  }
}

export function injectMenu() {
  const { isMenuVisiable, showMenu } = inject('menu')

  return { isMenuVisiable, showMenu }
}
