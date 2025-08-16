<template>
  <el-row :gutter="20" style="background-color: #eee; padding-top: 30px">
    <el-col :offset="2" :span="7">
      <CadUpload @file-loaded="handleFileLoaded" />
    </el-col>
    <el-col :span="7">
      <CadShow :geometry="currentGeometry" />
    </el-col>
    <el-col :span="7">
      <CadShow2 :geometry="currentGeometry" />
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";
import CadUpload from "../components/CadUpload.vue";
import CadShow from "../components/CadShow.vue";
import CadShow2 from "../components/CadShowById.vue";

const currentGeometry = ref(null);

const handleFileLoaded = (geometry) => {
  currentGeometry.value = geometry;
};
</script>
