<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { req_json_auth, API_BASE } from "../api";
import { useProfileStore } from "../stores/profile.store";

type DocumentInfo = {
  id: number;
  original_filename: string;
};

// Two-way binding with parent via v-model:document-ids
const documentIds = defineModel<number[]>("documentIds", { default: [] });

const profileStore = useProfileStore();
const isLoading = ref<boolean>(false);
const allDocuments = ref<DocumentInfo[]>([]);

const filteredDocuments = computed<DocumentInfo[]>(() => {
  const ids = new Set(documentIds.value ?? []);
  return allDocuments.value.filter((d) => ids.has(d.id));
});

async function ensureProfileLoaded() {
  if (!profileStore.profile) await profileStore.getProfile();
}

async function loadUserDocuments() {
  isLoading.value = true;
  try {
    await ensureProfileLoaded();
    const userId = (profileStore.profile as unknown as { id?: number })?.id;
    if (!userId) {
      isLoading.value = false;
      return;
    }
    const r = await req_json_auth(`/users/${userId}/documents`, "GET");
    const data = (await r?.json()) as Array<{
      id: number;
      original_filename: string;
    }>;
    allDocuments.value = Array.isArray(data)
      ? data.map((d) => ({ id: d.id, original_filename: d.original_filename }))
      : [];
  } catch (e) {
    console.error(e);
  }
  isLoading.value = false;
}

function openDocument(id: number) {
  const url = `${API_BASE}/documents/${id}/download`;
  window.open(url, "_blank");
}

function removeDocument(id: number) {
  if (!Array.isArray(documentIds.value)) return;
  const idx = documentIds.value.indexOf(id);
  if (idx >= 0) documentIds.value.splice(idx, 1);
}

onMounted(loadUserDocuments);
watch(
  () => documentIds.value,
  () => {
    // react if ids change externally
  }
);
</script>

<template>
  <div>
    <el-skeleton :loading="isLoading" animated>
      <template #default>
        <div
          v-if="filteredDocuments.length === 0"
          style="color: #577aad; font-size: 14px"
        >
          Документы не выбраны
        </div>
        <div v-else>
          <div v-for="doc in filteredDocuments" :key="doc.id" class="doc-row">
            <span class="doc-name">{{ doc.original_filename }}</span>
            <span class="doc-actions">
              <el-button size="small" link @click="openDocument(doc.id)">
                <span class="action-link">⤴</span>
              </el-button>
              <el-button size="small" link @click="removeDocument(doc.id)">
                <span class="action-remove">✖</span>
              </el-button>
            </span>
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped>
.doc-row {
  padding: 6px 0;
}

.doc-name {
  color: white;
  font-size: 14px;
  padding-right: 10px;
}

.doc-actions {
  padding-right: 10px;
}

.action-link {
  color: #577aad;
  font-weight: 700;
}

.action-remove {
  color: #bc2b55;
  font-weight: 700;
}
</style>
