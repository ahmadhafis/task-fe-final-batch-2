<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card>
          <v-card-title>Change Password</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleChangePassword" ref="form">
              <v-text-field
                v-model="newPassword"
                label="New Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? mdiEye : mdiEyeOff"
                @click:append="showPassword = !showPassword"
                :rules="passwordRules"
                required
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
                :type="showPassword ? 'text' : 'password'"
                :rules="[...passwordRules, confirmPasswordRule]"
                required
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="handleChangePassword"
              :loading="loading"
            >
              Change Password
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="3000"
    >
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { mdiEye, mdiEyeOff } from '@mdi/js';

const form = ref(null)
const loading = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters'
]

const confirmPasswordRule = v => v === newPassword.value || 'Passwords must match'

const handleChangePassword = async () => {
  if (!form.value.validate()) return

  loading.value = true
  try {
    await axios.post('/api/auth/upsert', {
      newPassword: newPassword.value
    })

    snackbar.value = {
      show: true,
      text: 'Password changed successfully',
      color: 'success'
    }
    form.value.reset()
  } catch (error) {
    snackbar.value = {
      show: true,
      text: error.response?.data?.message || 'Failed to change password',
      color: 'error'
    }
  } finally {
    loading.value = false
  }
}
</script>
