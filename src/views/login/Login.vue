<template>
  <div class="h-full w-full flex justify-center items-center">
    <ElForm ref="ruleFormRef" :model="loginForm" :rules="loginRules">
      <ElFormItem>
        <img src="@/assets/gs-logo.png" alt="" />
      </ElFormItem>
      <ElFormItem label="Email" prop="email" label-width="80">
        <ElInput v-model="loginForm.email" />
      </ElFormItem>
      <ElFormItem label="Password" prop="password" label-width="80">
        <ElInput v-model="loginForm.password" type="password" />
      </ElFormItem>
      <ElButton class="basic-button w-full" style="height: 36px" @click="signIn(ruleFormRef)"
        >Sign In</ElButton
      >
    </ElForm>
  </div>
</template>

<style></style>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import authService from '@/api/authService'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useRouter } from 'vue-router'
interface LoginInputForm {
  email: string
  password: string
}
const emit = defineEmits(['to-register'])

const userStore = useUserStoreWithOut()

const { push } = useRouter()

const ruleFormRef = ref<FormInstance>()

const loginForm = reactive<LoginInputForm>({
  email: '',
  password: ''
})

const loginRules = reactive<FormRules<LoginInputForm>>({
  email: [
    {
      required: true,
      message: 'This is required',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: 'This is required',
      trigger: 'blur'
    }
  ]
})

// const remember = ref(userStore.getRememberMe)

const initLoginInfo = () => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~ mode : ', import.meta.env.MODE)
  if (import.meta.env.MODE !== 'production') {
    loginForm.email = 'vanillabrain@gmail.com'
    loginForm.password = 'vb123123'
  }
}
onMounted(() => {
  initLoginInfo()
})

const signIn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  const isValid = await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      return true
    } else {
      console.log('error submit!', fields)
      return false
    }
  })
  if (!isValid) return
  try {
    const res = await authService.login(loginForm)
    // //
    console.log('~~~~~~~~~~~~~~~~~~~~~~ res : ', res)
    //  user store에 token 정보 넣기.
    userStore.setToken(res.data.accessToken)
    userStore.setRefreshToken(res.data.refreshToken)

    //  user store에 Login User 정보 넣기.
    userStore.setUserInfo(res.data.user)

    //  user store에 isLoggedIn 정보 true로 넣기.
    userStore.setIsLoggedIn(true)

    //  Admin 메인 화면으로 이동 하기.
    push('/member/memberMgnt')
  } catch (err) {
    // const alertStore = useAlertStore();
    // alertStore.error(error);
    console.log(err)
    // return err
  }

  console.log('~~~~~~~~~~~~~~~~~ login button click')
}
</script>
