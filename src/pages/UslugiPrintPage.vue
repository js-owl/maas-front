<script lang="ts" setup>
import UslugiPrint from '@/components/sections/uslugi/UslugiPrint.vue'
</script>

<template>
  <div class="main-container">
    <el-row>
      <UslugiPrint />
    </el-row>
  </div>
</template>

<style scoped>
.main-container {
  background-color: var(--bgcolor);
}

.content-wrapper {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  padding: 60px 80px;
}

.main-title {
  font-size: 48px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.main-subtitle {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
  text-align: left;
}
.description-section {
  display: flex;
  gap: 120px;
  margin-bottom: 60px;
  align-items: flex-start;
}

.description-text {
  flex: 1;
  font-size: 22px;
  line-height: 1.6;
  color: #000;
  text-align: justify;
}

.calculator-card {
  display: flex;
  align-items: center;
  background-color: var(--whity);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 400px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.calculator-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.calculator-icon {
  width: 80px;
  height: 80px;
  margin-right: 20px;
  flex-shrink: 0;
}

.calculator-text {
  font-size: 22px;
  font-weight: 500;
  color: #000;
  line-height: 1.4;
}

.technical-requirements {
  margin-top: 40px;
}

.requirements-title {
  font-size: 36px;
  font-weight: 700;
  color: #000;
  text-transform: uppercase;
  margin-bottom: 40px;
  text-align: left;
}

.requirements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.requirement-column {
  display: flex;
  flex-direction: column;
}

.requirement-title {
  font-size: 18px;
  font-weight: 600;
  color: #000;
  margin-bottom: 20px;
  background-color: #d1e5ff;
  padding: 12px 16px;
  border-radius: 6px;
  width: fit-content;
}

.requirement-item {
  font-size: 22px;
  color: #000;
  margin-bottom: 12px;
  line-height: 1.4;
}

.requirement-li {
  font-size: 22px;
  color: #000;
  margin-bottom: 12px;
  line-height: 1.4;
  margin-left: 20px;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 40px;
    margin: 0 0 40px 0;
  }

  .main-title {
    font-size: 28px;
    text-align: center;
    margin-bottom: 30px;
  }
  .main-subtitle {
    font-size: 20px;
  }

  .description-section {
    flex-direction: column;
    gap: 30px;
    margin-bottom: 40px;
  }

  .description-text {
    font-size: 16px;
    text-align: left;
  }
  .requirement-li {
    font-size: 16px;
  }
  .requirement-item {
    font-size: 16px;
  }
  .calculator-card {
    min-width: auto;
    width: 100%;
    padding: 16px;
  }

  .calculator-icon {
    width: 60px;
    height: 60px;
    margin-right: 16px;
  }

  .calculator-text {
    font-size: 16px;
  }

  .requirements-title {
    font-size: 20px;
    /* text-align: center; */
    margin-bottom: 30px;
  }

  .requirements-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .requirement-title {
    font-size: 16px;
    padding: 10px 14px;
    margin-bottom: 16px;
  }

  .requirement-item {
    font-size: 15px;
    margin-bottom: 10px;
  }
}
</style>
