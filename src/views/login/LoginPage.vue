<script setup>
import { userLogin } from '@/api/rbac/rbac'
import { ref, watch } from 'vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const isRegister = ref(false)
const form = ref()

// 整个的用于提交的form数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur'
    }
  ]
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  const res = await userLogin(formModel.value)
  userStore.setToken(res.data.token)
  userStore.setUser(res.data)

  Message.success('登录成功')
  router.push('/')
}

// 切换的时候，重置表单内容
watch(isRegister, () => {
  formModel.value = ''
})
</script>

<template>
  <a-row class="login-page">
    <a-col :span="12" class="bg"></a-col>
    <a-col :offset="3" :span="6" class="form">
      <!-- 登录相关表单 -->
      <a-form ref="form" :model="formModel" :rules="rules" autocomplete="off" size="large">
        <a-form-item>
          <h1>登录</h1>
        </a-form-item>
        <a-form-item prop="username">
          <a-input
            v-model="formModel.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></a-input>
        </a-form-item>
        <a-form-item prop="password">
          <a-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            name="password"
            placeholder="请输入密码"
            type="password"
          ></a-input>
        </a-form-item>
        <a-form-item class="flex">
          <div class="flex">
            <a-checkbox>记住我</a-checkbox>
            <a-link :underline="false" type="primary">忘记密码？</a-link>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button auto-insert-space class="button" type="primary" @click="login">登录</a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
