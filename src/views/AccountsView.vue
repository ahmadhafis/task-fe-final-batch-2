<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountStore } from '@/stores/account'
import { mdiEye, mdiEyeOff } from '@mdi/js';

const route = useRoute()
const router = useRouter()
const accountStore = useAccountStore()

const form = ref(null)
const showPassword = ref(false)
const isEdit = computed(() => !!route.params.id)

const formData = ref({
  username: '',
  password: '',
  role: 'user',
  balance: 0
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

onMounted(async () => {
  if (isEdit.value) {
    const account = accountStore.accounts.find(acc => acc.id === route.params.id)
    if (account) {
      formData.value = {
        username: account.username,
        balance: account.balance
      }
    } else {
      // If account not found in store, fetch accounts
      try {
        await accountStore.fetchAccounts()
        const account = accountStore.accounts.find(acc => acc.id === route.params.id)
        if (account) {
          formData.value = {
            username: account.username,
            balance: account.balance
          }
        } else {
          snackbar.value = {
            show: true,
            text: 'Account not found',
            color: 'error'
          }
          router.push('/accounts')
        }
      } catch (error) {
        snackbar.value = {
          show: true,
          text: error.response?.data?.message || 'Failed to fetch account',
          color: 'error'
        }
        router.push('/accounts')
      }
    }
  }
})

const handleSubmit = async () => {
  if (!form.value.validate()) return

  try {
    if (isEdit.value) {
      await accountStore.updateAccount(route.params.id, {
        username: formData.value.username,
        balance: formData.value.balance
      })
      snackbar.value = {
        show: true,
        text: 'Account updated successfully',
        color: 'success'
      }
    } else {
      await accountStore.createAccount({
        username: formData.value.username,
        password: formData.value.password,
        balance: formData.value.balance
      })
      snackbar.value = {
        show: true,
        text: 'Account created successfully',
        color: 'success'
      }
    }
    router.push('/accounts')
  } catch (error) {
    snackbar.value = {
      show: true,
      text: error.response?.data?.message || `Failed to ${isEdit.value ? 'update' : 'create'} account`,
      color: 'error'
    }
  }
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            {{ isEdit ? 'Edit' : 'Create' }} Account
          </v-card-title>

          <v-card-text>
            <v-form ref="form">
              <v-text-field
                v-model="formData.username"
                label="Username"
                :rules="[v => !!v || 'Username is required']"
                required
              />

              <v-text-field
                v-if="!isEdit"
                v-model="formData.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? mdiEye : mdiEyeOff"
                @click:append="showPassword = !showPassword"
                :rules="[v => !!v || 'Password is required']"
                required
              />

              <v-text-field
                v-model.number="formData.balance"
                label="Balance"
                type="number"
                :rules="[v => v >= 0 || 'Balance must be positive']"
                required
              />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              text
              @click="router.back()"
            >
              Cancel
            </v-btn>
            <v-btn
              color="primary"
              :loading="accountStore.loading"
              @click="handleSubmit"
            >
              {{ isEdit ? 'Update' : 'Create' }}
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
