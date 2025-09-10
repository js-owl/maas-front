<script lang="ts" setup>
import { onMounted, ref, watch, computed } from "vue";
import { req_json_auth, API_BASE } from "../api";
import { useProfileStore } from "../stores/profile.store";

type DocumentInfo = {
  id: number;
  filename: string;
};

const props = defineProps<{ documentIds: number[]; color?: string }>();
const emit = defineEmits<{ (e: "remove", id: number): void }>();

const profileStore = useProfileStore();
const isLoading = ref<boolean>(false);
const allDocuments = ref<DocumentInfo[]>([]);

const filteredDocuments = computed<DocumentInfo[]>(() => {
  const ids = new Set(props.documentIds ?? []);
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
    const data = (await r?.json()) as Array<{ id: number; filename: string }>; 
    allDocuments.value = Array.isArray(data)
      ? data.map((d) => ({ id: d.id, filename: d.filename }))
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
  emit("remove", id);
}

onMounted(loadUserDocuments);
watch(
  () => props.documentIds,
  () => {
    // подгружать список при изменении ids (если понадобится в будущем)
  }
);
</script>

<template>
  <div>
    <el-skeleton :loading="isLoading" animated>
      <template #default>
        <div v-if="filteredDocuments.length === 0" style="color: #577aad; font-size: 14px">
          Документы не выбраны
        </div>
        <div v-else>
          <div
            v-for="doc in filteredDocuments"
            :key="doc.id"
            class="doc-row"
          >
            <span class="doc-icon">PDF</span>
            <span class="doc-name">{{ doc.filename }}</span>
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
  display: grid;
  grid-template-columns: 40px 1fr 60px;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.doc-icon {
  width: 36px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  background: #e8eef8;
  color: #577aad;
  font-weight: 700;
  font-size: 10px;
}

.doc-name {
  color: #283d5b;
  font-size: 14px;
}

.doc-actions {
  display: inline-flex;
  gap: 6px;
  justify-content: flex-end;
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


