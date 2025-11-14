<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { req_json_auth } from '../api'

// User interface - defines the structure of user data returned from the API
// This interface represents a user object with common fields like id, username, email, etc.
interface IUser {
  id?: number
  user_id?: number
  username?: string
  email?: string
  full_name?: string
  user_type?: string
  created_at?: string
  [key: string]: any // Allow additional fields from API
}

// Reactive reference to store the list of users fetched from the API
const users = ref<IUser[]>([])

// Loading state to track when data is being fetched
const loading = ref(false)

// Fetch users from the API endpoint /users using authenticated request
// This function is called when the component is mounted to load initial data
onMounted(async () => {
  loading.value = true
  try {
    // Make authenticated GET request to /users endpoint
    // req_json_auth handles authentication token automatically
    const response = await req_json_auth('/users', 'GET')
    if (response) {
      // Parse JSON response and cast to array of user objects
      users.value = (await response.json()) as IUser[]
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
})

// Format date string to readable format (DD-MM-YYYY)
// This function converts ISO date strings to a more user-friendly format
const formatDate = (_row: any, _column: any, cellValue: string) => {
  if (!cellValue) return ''
  const date = new Date(cellValue)
  if (Number.isNaN(date.getTime())) return cellValue
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear())
  return `${day}-${month}-${year}`
}

// Format user type to readable Russian text
// Maps internal user type codes to display-friendly labels
const formatUserType = (userType: string | undefined): string => {
  if (!userType) return '-'
  const typeMap: Record<string, string> = {
    individual: 'Физическое лицо',
    legal: 'Юридическое лицо',
  }
  return typeMap[userType] || userType
}
</script>

<template>
  <el-row :gutter="20" style="background-color: #fff; padding: 10px 0 0px 20px; min-height: 100px">
    <el-col :offset="0" :span="24">
      <h1>Пользователи</h1>
    </el-col>
  </el-row>
  <el-row :gutter="20" style="background-color: #fff; padding-top: 0px; min-height: 500px">
    <el-col :offset="0" :span="24">
      <!-- Element Plus table component to display users in a structured format -->
      <!-- Loading state shows spinner while data is being fetched -->
      <el-table
        v-loading="loading"
        stripe
        :data="users || []"
        :default-sort="{ prop: 'id', order: 'descending' }"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
        empty-text="Нет данных"
      >
        <!-- User ID column - displays unique identifier for each user -->
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="user_id" label="ID пользователя" width="120" v-if="users.some(u => u.user_id)" />

        <!-- Username column - displays the user's login name -->
        <el-table-column prop="username" label="Логин" width="150" />

        <!-- Email column - displays the user's email address -->
        <el-table-column prop="email" label="Email" width="200" />

        <!-- Full name column - displays the user's full name if available -->
        <el-table-column prop="full_name" label="Полное имя" width="200" />

        <!-- User type column - displays whether user is individual or legal entity -->
        <el-table-column prop="user_type" label="Тип пользователя" width="150">
          <template #default="{ row }">
            {{ formatUserType(row.user_type) }}
          </template>
        </el-table-column>

        <!-- Created date column - displays when the user account was created -->
        <el-table-column
          prop="created_at"
          label="Дата создания"
          :formatter="formatDate"
          width="150"
        />
      </el-table>
    </el-col>
  </el-row>
</template>

<style scoped>
/* Component-specific styles are minimal as Element Plus handles most styling */
/* Additional custom styles can be added here if needed */
</style>

