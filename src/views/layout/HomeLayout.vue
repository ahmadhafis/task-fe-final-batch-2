<template>
  <v-responsive>
    <v-app id="app">
      <v-navigation-drawer v-model="drawer">
        <!-- sidebar -->
        <v-sheet class="pa-4" color="secondary">
          <div class="font-weight-bold">Hello, {{ userStore.user?.name }}</div>
          <div class="font-weight-bold">Your balance:</div>
          <div class="font-weight-bold">Rp.{{ userStore.user?.balance }}</div>
        </v-sheet>

        <v-divider></v-divider>

        <v-list>
          <RouterLink
            v-for="{ icon, text, route, click } in sidebarLinks"
            :key="route"
            :to="route"
            custom
          >
            <v-list-item
              :prepend-icon="icon"
              :title="text"
              link
              @click="click"
              v-if="click"
            ></v-list-item>
            <v-list-item :prepend-icon="icon" :title="text" link :to="route" v-else></v-list-item>
          </RouterLink>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-img class="" max-width="100" :src="logo" @click="goHome"></v-img>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main id="main">
        <RouterView />
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
import { ref } from 'vue'
import logo from '@/assets/Lazada.png'
import {
  mdiAccount,
  mdiFormTextarea,
  mdiHome,
  mdiKeyChange,
  mdiLogout,
  mdiWallet,
} from '@mdi/js'
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const goHome = () => {
  router.push('/')
}
const userStore = useUserStore()
const router = useRouter()

const drawer = ref(null)

function logout() {
  userStore.logout()
  router.push({ name: 'login' })
}

const sidebarLinks = [
  { icon: mdiHome, text: 'Home', route: '/' },
  { icon: mdiKeyChange, text: 'Change Password', route: '/change-password' },
  { icon: mdiAccount, text: 'Account List', route: '/account-list' },
  { icon: mdiFormTextarea, text: 'Account Form', route: '/account-form' },
  { icon: mdiWallet, text: 'Dompetku', route: '/dompetku' },
  { icon: mdiLogout, text: 'Logout', route: '/login', click: logout },
]
</script>
