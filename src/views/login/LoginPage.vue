<script setup>
import {ref} from 'vue'

let a = ref({
  username: '',
  password: ''
});

</script>
<template>
  login
  <div >
    <input v-model="a.username" placeholder="Username">
    <input v-model="a.password" placeholder="Password" type="password">
    <button @click="login">Login</button>
  </div>
</template>