<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card class="pa-6 rounded-lg shadow-lg" max-width="500px">
      <v-card-title class="text-center">
        <span class="headline">{{ isEditing ? 'Edit Account' : 'Create Account' }}</span>
      </v-card-title>

      <!-- Form for creating or editing an account -->
      <v-form ref="form" @submit.prevent="isEditing ? updateAccount() : createAccount">
        <v-card-text>
          <!-- Account Name Field -->
          <v-text-field
            v-model="currentAccount.name"
            label="Account Name"
            outlined
            dense
            required
          ></v-text-field>

          <!-- Balance Field -->
          <v-text-field
            v-model="currentAccount.balance"
            label="Balance"
            type="number"
            outlined
            dense
            required
          ></v-text-field>


        </v-card-text>

        <v-card-actions>
          <!-- Cancel Button -->
          <v-btn color="blue" text @click="cancel">Cancel</v-btn>

          <!-- Save Button -->
          <v-btn color="green" type="submit">
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive state for form fields
const currentAccount = ref({
  name: '',
  balance: 0,
  referral_account_id: null,
});

const isEditing = ref(false); // Track if the form is for editing
const form = ref(null); // Reference to the form for validation

// Function to open the form for creating an account
const openCreateAccountForm = () => {
  isEditing.value = false;
  currentAccount.value = { name: '', balance: 0}; // Clear form
};

// Function to open the form for editing an account
const openEditAccountForm = (account) => {
  isEditing.value = true;
  currentAccount.value = { ...account }; // Populate the form with existing account data
};

// Cancel button action
const cancel = () => {
  router.push('/account-list'); // Redirect back to the account list or previous page
};

// Create a new account
const createAccount = async () => {
  try {
    const response = await axios.post('http://localhost:8080/account/create', currentAccount.value);
    alert('Account created successfully!');
    router.push('/account-list');  // Redirect to the account list page
  } catch (error) {
    console.error('Error creating account:', error);
    alert('Failed to create account');
  }
};

// Update an existing account
const updateAccount = async () => {
  try {
    const response = await axios.patch(`http://localhost:8080/account/update/${currentAccount.value.account_id}`, currentAccount.value);
    alert('Account updated successfully!');
    router.push('/accounts');  // Redirect to the account list page
  } catch (error) {
    console.error('Error updating account:', error);
    alert('Failed to update account');
  }
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}

.v-btn {
  transition: background-color 0.3s ease;
}

.v-btn:hover {
  background-color: #1976D2;
}

.v-form {
  max-width: 100%;
}

.v-text-field {
  margin-bottom: 1rem;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
}

.v-card-title {
  font-weight: bold;
}
</style>
