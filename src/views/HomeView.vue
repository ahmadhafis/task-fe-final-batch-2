<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-center mb-4">
          <!-- Button to load more data -->
          <!-- <v-btn @click="fetchList" color="primary">Load Accounts</v-btn> -->
        </div>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title style="background-color: beige;">
            <span class="headline">Account List</span>
          </v-card-title>
          <v-card-text style="margin: 2rem;">
            <v-row>
              <v-col
                v-for="list in lists"
                :key="list.list_id"
                cols="12"
                md="6"
                lg="4"
              >
                <v-card variant="elevated" class="mb-4" style="background-color: beige;">
                  <v-card-title>{{ list.name }}</v-card-title>
                  <v-card-subtitle>Balance: {{ list.balance }}</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card class="mt-4" style="background-color: blanchedalmond;">
          <v-card-title>
            <span class="headline">Account Statistics</span>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="statistics in stats"
                :key="statistics.stats_id"
                cols="12"
                md="4"
              >
                <v-card class="mb-4" style="background-color: beige;">
                  <v-card-title>Total Users: {{ statistics.total_user }}</v-card-title>
                  <v-card-title>Total Balance: {{ statistics.total_balance }}</v-card-title>
                  <v-card-title>Average Balance: {{ statistics.average_balance }}</v-card-title>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user';

const stats = ref([]) // Array to store account data
const lists = ref([])
const userStore = useUserStore()
// Function to fetch account data from backend
const fetchStats = async () => {
  try {

    const response = await axios.get('http://localhost:8080/account/statistics', {
      headers: {
        Authorization: userStore.token // Include the token in the request headers
      }
    })


    console.log('Full response:', response) // Log the full response for inspection

    // Access the accounts array from response.data
    stats.value = response.data// Assign the accounts data directly from response.data
    console.log('Fetched stats:', stats.value)
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
}

const fetchList = async () => {
  try {

    const response = await axios.get('http://localhost:8080/account/list')


    console.log('Full response:', response) // Log the full response for inspection

    // Access the accounts array from response.data
    lists.value = response.data.data// Assign the accounts data directly from response.data
    console.log('Fetched stats:', lists.value)
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchStats()
  fetchList()
})
</script>

<style scoped></style>
