<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { req_json_auth } from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Edit, Plus, RefreshRight } from '@element-plus/icons-vue'
import DialogRegistration from './dialog/DialogRegistration.vue'
import DialogEditUser from './dialog/DialogEditUser.vue'

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

// Loading state for sync operation
const syncLoading = ref(false)

// State to control registration dialog visibility
const isRegistrationVisible = ref(false)

// State to control edit dialog visibility
const isEditDialogVisible = ref(false)

// Selected user for editing
const selectedUser = ref<IUser | null>(null)

// Fetch users from the API endpoint /users using authenticated request
// This function can be called to reload the user list
const fetchUsers = async () => {
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
}

// Load users when component is mounted
onMounted(() => {
  fetchUsers()
})

// Watch for registration dialog close to refresh user list
// This ensures the list is updated after successful registration
watch(isRegistrationVisible, async (newValue, oldValue) => {
  // If dialog was closed (changed from true to false), refresh the user list
  if (oldValue === true && newValue === false) {
    await fetchUsers()
  }
})

// Handler to open registration dialog
const handleAddUser = () => {
  isRegistrationVisible.value = true
}

// Handler to open edit dialog with selected user data
const handleEdit = (user: IUser) => {
  selectedUser.value = user
  isEditDialogVisible.value = true
}

// Handler for when user is updated - refresh the list
const handleUserUpdated = async () => {
  await fetchUsers()
}

// Handler to process sync - calls POST /sync/process endpoint
const handleSyncProcess = async () => {
  syncLoading.value = true
  try {
    // Make authenticated POST request to /sync/process endpoint
    const response = await req_json_auth('/sync/process', 'POST')
    if (response && response.ok) {
      ElMessage.success('Синхронизация успешно запущена')
      // Optionally refresh users list after sync
      await fetchUsers()
    } else {
      ElMessage.error('Ошибка при запуске синхронизации')
    }
  } catch (error) {
    console.error('Error processing sync:', error)
    ElMessage.error('Ошибка при запуске синхронизации')
  } finally {
    syncLoading.value = false
  }
}

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

// Delete user function - shows confirmation dialog and sends DELETE request
// Removes user from local state after successful deletion
const handleDelete = async (user: IUser) => {
  if (!user.id) {
    ElMessage.error('Не удалось определить ID пользователя')
    return
  }

  try {
    // Show confirmation dialog before deleting
    await ElMessageBox.confirm(
      `Вы уверены, что хотите удалить пользователя "${user.username || user.email || user.id}"?`,
      'Подтверждение удаления',
      {
        confirmButtonText: 'Удалить',
        cancelButtonText: 'Отмена',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      }
    )

    // Make DELETE request to /users/{id} endpoint
    loading.value = true
    const response = await req_json_auth(`/users/${user.id}`, 'DELETE')

    if (response && response.ok) {
      // Remove user from local state after successful deletion
      users.value = users.value.filter((u) => u.id !== user.id)
      ElMessage.success('Пользователь успешно удален')
    } else {
      ElMessage.error('Ошибка при удалении пользователя')
    }
  } catch (error: any) {
    // User cancelled the confirmation dialog - this is expected behavior
    // ElMessageBox rejects with action string when user clicks cancel
    if (error === 'cancel' || error === 'close' || error?.action === 'cancel') {
      return
    }
    console.error('Error deleting user:', error)
    ElMessage.error('Ошибка при удалении пользователя')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-row :gutter="20" style="background-color: #fff; padding: 10px 0 0px 20px; min-height: 100px">
    <el-col :offset="0" :span="24">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <h1>Пользователи</h1>
        <div style="display: flex; gap: 10px">
          <el-button
            type="default"
            :icon="RefreshRight"
            @click="handleSyncProcess"
            :disabled="loading || syncLoading"
            :loading="syncLoading"
          >
            Синхронизация
          </el-button>
          <el-button type="primary" :icon="Plus" @click="handleAddUser" :disabled="loading">
            Добавить пользователя
          </el-button>
        </div>
      </div>
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

        <!-- Actions column - displays edit and delete buttons for each user -->
        <el-table-column label="Действия" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              :icon="Edit"
              type="primary"
              size="small"
              circle
              @click="handleEdit(row)"
              :disabled="loading || !row.id"
              :title="`Редактировать пользователя ${row.username || row.email || row.id}`"
              style="margin-right: 8px"
            />
            <el-button
              :icon="Delete"
              type="danger"
              size="small"
              circle
              @click="handleDelete(row)"
              :disabled="loading || !row.id"
              :title="`Удалить пользователя ${row.username || row.email || row.id}`"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <DialogRegistration v-model="isRegistrationVisible" />
  <DialogEditUser v-model="isEditDialogVisible" :user="selectedUser" @updated="handleUserUpdated" />
</template>

<style scoped>
/* Component-specific styles are minimal as Element Plus handles most styling */
/* Additional custom styles can be added here if needed */
</style>

