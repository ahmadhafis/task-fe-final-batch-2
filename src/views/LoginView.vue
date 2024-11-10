<template>
  <v-container fluid fill-height>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-center pa-4">
            Login
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleLogin" ref="form">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="[v => !!v || 'Username is required']"
                required
                :prepend-icon= mdiAccount
              />

              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? mdiEye : mdiEyeOff"
                @click:append="showPassword = !showPassword"
                :rules="[v => !!v || 'Password is required']"
                required
                :prepend-icon = mdiLock
              />
            </v-form>
          </v-card-text>

          <v-card-actions class="pa-4">
            <v-btn
              color="primary"
              block
              size="large"
              :loading="authStore.loading"
              @click="handleLogin"
            >
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="showError"
      color="error"
      timeout="3000"
    >
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { mdiAccount, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

const router = useRouter()
const authStore = useAuthStore()

const form = ref(null)
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!form.value.validate()) return

  try {
    await authStore.login({
      username: username.value,
      password: password.value
    })
    router.push('/')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Login failed'
    showError.value = true
  }
}
</script>
