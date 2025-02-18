import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,

  // 自定义规则
  {
    name: 'app/custom-rules',
    rules: {
      // prettier 规则
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 单引号
          semi: false, // 无分号
          printWidth: 80, // 每行宽度至多 80 字符
          trailingComma: 'none', // 不加对象|数组最后逗号
          endOfLine: 'auto', // 兼容不同系统的换行符
        },
      ],

      // Vue 规则
      // 'vue/multi-word-component-names': [
      //   'warn',
      //   { ignores: ['index'] }, // 忽略 index.vue 组件名称
      // ],
      // 'vue/no-setup-props-destructure': 'off', // 允许 props 解构

      // JavaScript 规则
      'no-undef': 'error', // 禁止未定义变量
    },
  },
]
