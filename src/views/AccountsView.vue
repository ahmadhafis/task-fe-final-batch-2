<template>
  <v-container class="d-flex align-center justify-center" style="min-height: 100vh;">
    <v-card width="100%" class="pa-5">
      <v-card-title class="justify-center">Account List</v-card-title>

      <!-- Account List -->
      <v-data-table style="background-color: silver;"
        :headers="headers"
        :items="accounts"
        item-value="name"
        class="elevation-1"
      >
      <template v-slot:top>
          <!-- Row Titles (Column Headers) -->
          <v-row style="padding-top: 10px" class="mb-4">
            <v-col cols="4" class="font-weight-bold" >Account Name</v-col>
            <v-col cols="4" class="font-weight-bold">Balance</v-col>
            <v-col cols="4" class="font-weight-bold">Actions</v-col>
          </v-row>
        </template>
        <!-- Scoped Slot for actions (edit button) -->
        <template v-for="(account, index) in accounts" :key="index">
          <v-row>
            <v-col cols="12" md="4">
              <span>{{ account.name }}</span>
            </v-col>
            <v-col cols="12" md="4">
              <span>{{ account.balance }}</span>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn
                color="primary"
                small
                @click="editAccount(account)"
              >
                Edit
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-data-table>

      <!-- Create Account Button -->
      <v-btn color="success" @click="openCreateAccountDialog" class="mt-4" block>
        Create New Account
      </v-btn>

      <!-- Create Account Dialog -->
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ isEditing ? 'Edit Account' : 'Create Account' }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" @submit.prevent="isEditing ? updateAccount() : createAccount()">
              <v-text-field
                v-model="currentAccount.name"
                label="Account Name"
                outlined
                dense
                required
              ></v-text-field>
              <v-text-field
                v-model="currentAccount.balance"
                label="Balance"
                type="number"
                outlined
                dense
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue" text @click="closeDialog">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="isEditing ? updateAccount() : createAccount()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const dialog = ref(false);
const isEditing = ref(false); // Track if we're editing an existing account
const currentAccount = ref({
  name: '',
  balance: 0,
  referral_account_id: null,
});
const accounts = ref([]);
const headers = [
  { text: 'Account Name', align: 'start', key: 'name', sortable: true },
  { text: 'Balance', align: 'start', key: 'balance', sortable: true },
];

// Fetch accounts from the backend
const fetchAccounts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/account/list');
    accounts.value = response.data.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }
};

// Open dialog to create new account
const openCreateAccountDialog = () => {
  isEditing.value = false;
  currentAccount.value = { name: '', balance: 0,};
  dialog.value = true;
};

// Open dialog to edit an existing account
const editAccount = (account) => {
  isEditing.value = true;
  currentAccount.value = { ...account }; // Populate form with existing account data
  dialog.value = true;
};

// Close the dialog
const closeDialog = () => {
  dialog.value = false;
};



// Create a new account
const createAccount = async () => {
  try {
    const accountData = {
      name: currentAccount.value.name,
      balance: parseFloat( currentAccount.value.balance), // Ensure balance is a number
    };

    const response = await axios.post(
      'http://localhost:8080/account/create',
      accountData, // Send the data with balance as a number
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    alert('Account created successfully!');
    closeDialog();
    fetchAccounts();  // Refresh the account list
  } catch (error) {
    console.error('Error creating account:', error);
    alert('Failed to create account');
  }
};

// Update an existing account
const updateAccount = async () => {
  try {
    await axios.patch(`http://localhost:8080/account/update/${currentAccount.value.account_id}`, currentAccount.value);
    alert('Account updated successfully!');
    closeDialog();
    fetchAccounts();  // Refresh the account list
  } catch (error) {
    console.error('Error updating account:', error);
    alert('Failed to update account');
  }
};

// Fetch accounts when the component is mounted
fetchAccounts();
</script>

<style scoped>
.custom-table {
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 20px;  /* Add margin-top for spacing above the table */
  margin-bottom: 10px;  /* Add margin-bottom for spacing below the table */
}

.v-data-table {
  margin-top: 20px;
  text-align: center; /* Center the text inside the table */
}

.v-btn {
  margin-right: 10px;
}

.v-btn.small {
  font-size: 0.875rem; /* Smaller font size */
  padding: 6px 12px;    /* Smaller padding */
}

.v-dialog {
  margin-top: 20px;
}

.v-container {
  text-align: center; /* Ensure the entire container is centered */
}

.v-row {
  max-height: 40px; /* Limit the row height */
}

.v-card {
  width: 80%; /* Set a fixed width for the card */
}
</style>
