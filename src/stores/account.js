import { defineStore } from 'pinia'
import axios from 'axios'

export const useAccountStore = defineStore('account', {
  state: () => ({
    accounts: [],
    loading: false
  }),

  actions: {
    async fetchAccounts() {
      this.loading = true
      try {
        const response = await axios.get('/api/accounts')
        this.accounts = response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async createAccount(data) {
      this.loading = true
      try {
        const response = await axios.post('/account/create', data)
        this.accounts.push(response.data)
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateAccount(id, data) {
      this.loading = true
      try {
        const response = await axios.put(`/api/account/edit/${id}`, data)
        const index = this.accounts.findIndex(acc => acc.id === id)
        if (index !== -1) {
          this.accounts[index] = response.data
        }
        return response.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
