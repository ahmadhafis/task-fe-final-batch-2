<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card width="400" class="pa-5">
      <v-card-title class="justify-center">Change Password</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="changePassword" ref="form" lazy-validation>
          <v-text-field
            label="New Password"
            v-model="newPassword"
            type="password"
            outlined
            dense
            prepend-inner-icon="mdi-lock"
            :rules="passwordRules"
            required
          ></v-text-field>

          <v-text-field
            label="Confirm Password"
            v-model="confirmPassword"
            type="password"
            outlined
            dense
            prepend-inner-icon="mdi-lock-check"
            :rules="[passwordMatchRule]"
            required
          ></v-text-field>

          <v-btn
            color="primary"
            block
            class="mt-4"
            :loading="loading"
            @click="submitForm"
          >
            Change Password
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const newPassword = ref('')
const confirmPassword = ref('')
const userStore = useUserStore()
const loading = ref(false)
const router = useRouter()

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => v.length >= 6 || 'Password must be at least 6 characters'
];
const passwordMatchRule = (v) => v === newPassword.value || 'Passwords do not match';

const changePassword = async () => {
  loading.value = true;
  if (newPassword.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:8080/auth/change-password',
      {
        new_password: newPassword.value,  // Use 'new_password' to match the backend
        confirm_new_password: confirmPassword.value  // Use 'confirm_new_password' to match the backend
      },
      {
      headers: {
        Authorization: userStore.token // Include the token in the request headers
      }
    }
    );
    alert(response.data.message || "Password changed successfully!");
    router.push({ name: 'home' })
  } catch (error) {
    console.error("Error changing password:", error);
    alert("Failed to change password");
  } finally {
    loading.value = false;
  }
};
const submitForm = () => {
  if (newPassword.value && confirmPassword.value) {
    changePassword();
  }
};
</script>
