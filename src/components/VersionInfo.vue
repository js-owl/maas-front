<template>
  <div class="version-info" v-if="buildInfo">
    <el-tooltip content="Build Information" placement="top">
      <el-tag 
        size="small" 
        type="info" 
        class="version-tag"
        @click="showVersionDialog = true"
      >
        v{{ buildInfo.version }}
      </el-tag>
    </el-tooltip>

    <el-dialog
      v-model="showVersionDialog"
      title="Build Information"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="version-details">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Application">
            {{ buildInfo.name }}
          </el-descriptions-item>
          <el-descriptions-item label="Version">
            {{ buildInfo.version }}
          </el-descriptions-item>
          <el-descriptions-item label="API Version">
            {{ buildInfo.apiVersion }}
          </el-descriptions-item>
          <el-descriptions-item label="Build Date">
            {{ buildInfo.buildDateFormatted || formatDate(buildInfo.buildDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="Git Hash">
            <el-text type="info" size="small">{{ buildInfo.gitHash }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="Git Branch">
            <el-text type="info" size="small">{{ buildInfo.gitBranch }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="Environment">
            <el-tag 
              :type="buildInfo.buildEnvironment === 'production' ? 'success' : 'warning'"
              size="small"
            >
              {{ buildInfo.buildEnvironment }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <el-button @click="showVersionDialog = false">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface BuildInfo {
  version: string;
  name: string;
  description: string;
  buildDate: string;
  buildDateFormatted?: string;
  gitHash: string;
  gitBranch: string;
  apiVersion: string;
  nodeVersion: string;
  buildEnvironment: string;
}

const buildInfo = ref<BuildInfo | null>(null);
const showVersionDialog = ref(false);

onMounted(async () => {
  try {
    const response = await fetch('/build-info.json');
    if (response.ok) {
      buildInfo.value = await response.json();
    }
  } catch (error) {
    console.warn('Could not load build info:', error);
  }
});

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString();
}
</script>

<style scoped>
.version-info {
  display: inline-block;
}

.version-tag {
  cursor: pointer;
  user-select: none;
}

.version-tag:hover {
  opacity: 0.8;
}

.version-details {
  margin: 16px 0;
}
</style>
