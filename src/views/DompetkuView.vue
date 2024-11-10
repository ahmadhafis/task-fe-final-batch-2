<template>
  <v-app>
    <v-container>
      <v-card class="pa-5" outlined>
        <v-card-title class="text-h4">Dompetku v2 – Expense & Income Money Management</v-card-title>
        <v-divider></v-divider>

        <!-- Form for new entry -->
        <v-form @submit.prevent="addEntry">
          <v-text-field v-model="newEntry.description" label="Keterangan" outlined required></v-text-field>
          <v-text-field v-model.number="newEntry.amount" label="Jumlah Uang" type="number" outlined required></v-text-field>
          <v-select
            v-model="newEntry.category"
            :items="categories"
            label="Kategori"
            outlined
            required
          ></v-select>
          <v-btn type="submit" style="background-color: skyblue;" class="mt-3">Submit</v-btn>
        </v-form>

        <!-- Summary -->
        <v-card-subtitle class="mt-5">
          <strong>Summary:</strong><br>
          Total Entries: {{ entries.length }}<br>
          Total Income: Rp {{ totalIncome }}<br>
          Total Expense: Rp {{ totalExpense }}<br>
          Balance: Rp {{ balance }}
        </v-card-subtitle>

        <!-- List of entries -->
        <v-list class="mt-5">
          <v-subheader>Rekap Keuangan</v-subheader>
          <v-alert v-if="entries.length === 0" type="info">Belum ada data.</v-alert>
          <v-list-item style="background-color: skyblue;"
            v-for="(entry, index) in entries"
            :key="index"
            class="mb-2 d-flex align-center"
          >
            <v-list-item-content class="flex-grow-1">
              <v-list-item-title class="font-weight-medium">
                {{ entry.description }} - Rp {{ entry.amount }} ({{ entry.category }})
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <!-- Square Delete button with text, aligned to the right -->
              <v-btn
                color="red"
                small
                @click="removeEntry(index)"
                class="delete-btn"
              >
                Delete
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <!-- Clear all entries button -->
        <v-btn color="error" class="mt-5" @click="confirmClearAll">
          Hapus Semua Data
        </v-btn>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { loadEntries, saveEntries, clearEntries } from '../stores/store.js'; // Import the storage functions

export default {
  data() {
    return {
      newEntry: {
        description: "",
        amount: null,
        category: "",
      },
      categories: ["Food", "Transport", "Shopping", "Other"],
      entries: loadEntries()  // Load entries from storage on initialization
    };
  },
  computed: {
    totalIncome() {
      return this.entries
        .filter(entry => entry.amount > 0)
        .reduce((sum, entry) => sum + entry.amount, 0);
    },
    totalExpense() {
      return this.entries
        .filter(entry => entry.amount < 0)
        .reduce((sum, entry) => sum + Math.abs(entry.amount), 0);
    },
    balance() {
      return this.totalIncome - this.totalExpense;
    }
  },
  methods: {
    addEntry() {
      if (this.newEntry.description && this.newEntry.amount && this.newEntry.category) {
        this.entries.push({ ...this.newEntry });
        saveEntries(this.entries);  // Save entries after adding a new one
        this.newEntry = { description: "", amount: null, category: "" };
      } else {
        alert("Harap isi keterangan, jumlah uang, dan kategori.");
      }
    },
    removeEntry(index) {
      this.entries.splice(index, 1);
      saveEntries(this.entries);  // Save entries after removing one
    },
    confirmClearAll() {
      if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
        this.clearAllEntries();
      }
    },
    clearAllEntries() {
      this.entries = [];
      clearEntries();  // Use the clearEntries function
    }
  },
  onMounted() {
    this.entries = loadEntries();  // Load entries when component is mounted
  }
};
</script>

<style scoped>
/* Styling for the list and delete button */
.v-btn {
  min-width: 90px; /* Ensure button has enough width */
  text-transform: none; /* Don't transform the text */
  padding: 10px; /* Add padding for better touch area */
}

/* Ensure that delete button is aligned to the right */
.v-list-item-action {
  margin-left: auto;
}

/* Flex styling for better row layout */
.v-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-btn {
  font-size: 14px;
  padding: 6px 12px;
}

/* Make sure text content is aligned properly */
.v-list-item-content {
  flex-grow: 1; /* Allow content to expand to take remaining space */
  margin-right: 10px; /* Add spacing between content and button */
}
</style>
