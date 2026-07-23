<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useWindowSize } from '@vueuse/core'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)

const isRequirementsExpanded = ref(false)

type WeldType = {
  name: string
  thickness: string
  thicknessHtml?: boolean
}

const weldTypes: WeldType[] = [
  { name: 'Сварка кольцевых швов', thickness: 'до 10 … 15 мм' },
  { name: 'Сварка продольные швов', thickness: 'до 10 … 15 мм' },
  { name: 'Сварка сильфона', thickness: 'до 10 … 15 мм' },
  {
    name: 'Сварка плавящимся электродом в углекислом газе углеродистых сталей',
    thickness: 'до 10 … 15 мм',
  },
  {
    name: 'Аргонодуговая сварка легированных сталей, титановых сплавов и алюминиевых сплавов',
    thickness: 'до 10 … 15 мм',
  },
  {
    name: 'Контактная точечная сварка легированных сталей, титановых и алюминиевых сплавов',
    thickness: 'до 3 мм',
  },
  {
    name: 'Контактная шовная сварка легированных сталей, титановых сплавов',
    thickness: 'до 3 мм',
  },
  {
    name: 'Контактная шовная сварка сильфонов и мембранных узлов',
    thickness: 'до 3 мм',
  },
  { name: 'Автоматическая сварка (кольцевых швов)', thickness: 'диаметр 80 … 1200 мм' },
  {
    name: 'Передвижная установка для аргонно-дуговой сварки (стали коррозионно-стойкие (жаропрочные), титановые сплавы)',
    thickness: 'толщиной до 2,5 мм.',
  },
  {
    name: 'Сварка продольных швов (стали коррозионно-стойкие, титановые сплавы, алюминиевые сплавы)',
    thickness: 'диаметр – 350 … 1200 мм<br />длина – 50 … 2300 мм<br />толщина стенки – 0,5 … 10 мм',
    thicknessHtml: true,
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <template v-if="isMobile">
      <div class="uslugi-weld-cards">
        <div class="uslugi-wrapper uslugi-wrapper--weld-intro">
          <div class="uslugi-weld-intro">
            <div class="uslugi-weld-content">
              <div class="uslugi-title">Сварка металла</div>
              <div class="uslugi-text">
                <p>
                  Сварка отличается от склеивания тем, что зазор между соединяемыми деталями заполняется
                  материалом свариваемых деталей (в том числе с участием присадочного материала), в
                  результате чего первоначальная граница раздела исчезает, превращаясь в переходный слой.
                </p>
                <p>&nbsp;</p>
                <p>
                  Взаимное растворение и диффузия материала детали и припоя происходят в том числе и при
                  пайке. Но граница между соединяемыми деталями заполняется припоем.
                </p>
              </div>
            </div>

            <div class="uslugi-image-wrapper">
              <img src="/uslugiPages/weld.png" alt="Сварка металла" class="uslugi-image" />
            </div>
          </div>
        </div>

        <div class="uslugi-wrapper uslugi-wrapper--weld-table">
          <table class="weld-mobile-table">
            <colgroup>
              <col />
              <col class="col-thickness" />
            </colgroup>
            <thead>
              <tr>
                <th>Тип сварки</th>
                <th>Свариваемые толщины</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="weldType in weldTypes" :key="weldType.name">
                <td>{{ weldType.name }}</td>
                <td v-if="weldType.thicknessHtml" v-html="weldType.thickness" />
                <td v-else>{{ weldType.thickness }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <div v-else class="uslugi-wrapper">
      <div class="uslugi-title">Сварка металла</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          Сварка отличается от склеивания тем, что зазор между соединяемыми деталями заполняется материалом
          свариваемых деталей (в том числе с участием присадочного материала), в результате чего первоначальная
          граница раздела исчезает, превращаясь в переходный слой.
          <br />
          <br />
          Взаимное растворение и диффузия материала детали и припоя происходят в том числе и при пайке.
          Но граница между соединяемыми деталями заполняется припоем.
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/weld.png" alt="Сварка металла" class="uslugi-image" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isRequirementsExpanded = !isRequirementsExpanded">
          <div class="uslugi-table-title">Виды сварки</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRequirementsExpanded" class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--compact">
            <colgroup>
              <col class="col-type" />
              <col class="col-thickness" />
            </colgroup>
            <thead>
              <tr>
                <th>Тип сварки</th>
                <th>Свариваемые толщины</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Сварка кольцевых швов</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Сварка продольные швов</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Сварка сильфона</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Сварка плавящимся электродом в углекислом газе углеродистых сталей</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Аргонодуговая сварка легированных сталей, титановых сплавов и алюминиевых сплавов</td>
                <td>до 10 ... 15 мм</td>
              </tr>
              <tr>
                <td>Контактная точечная сварка легированных сталей, титановых и алюминиевых сплавов</td>
                <td>до 3 мм</td>
              </tr>
              <tr>
                <td>Контактная шовная сварка легированных сталей, титановых сплавов</td>
                <td>до 3 мм</td>
              </tr>
              <tr>
                <td>Контактная шовная сварка сильфонов и мембранных узлов</td>
                <td>до 3 мм</td>
              </tr>
              <tr>
                <td>Автоматическая сварка (кольцевых швов)</td>
                <td>диаметр 80 ... 1200 мм</td>
              </tr>
              <tr>
                <td>
                  Передвижная установка для аргонно-дуговой сварки (стали коррозионно-стойкие (жаропрочные),
                  титановые сплавы)
                </td>
                <td>толщиной до 2,5 мм.</td>
              </tr>
              <tr>
                <td>
                  Сварка продольных швов (стали коррозионно-стойкие, титановые сплавы, алюминиевые сплавы)
                </td>
                <td>
                  диаметр – 350 ... 1200 мм<br />
                  длина – 50 ... 2300 мм<br />
                  толщина стенки – 0,5 ... 10 мм
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.technical-requirements {
  margin-top: 0;
  width: 100%;
}

.requirements-header {
  min-height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.requirements-header :deep(.uslugi-table-title) {
  margin-bottom: 0;
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
}

.requirements-arrow {
  transition: transform 0.2s ease;
  transform: rotate(0deg);
  font-size: 24px;
  color: #000;
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  margin-top: 20px;
  border-radius: 0;
  overflow: hidden;
  border: 1px solid var(--button-bg);
  background-color: var(--whity);
}

.requirements-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.col-type {
  width: calc(100% - 350px);
}

.col-thickness {
  width: 350px;
}

.requirements-table th {
  background-color: var(--bgcolor);
  font-family: 'Montserrat-Medium', sans-serif;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  text-align: left;
  border-bottom: 1px solid var(--button-bg);
  border-right: 1px solid var(--button-bg);
  vertical-align: top;
}

.requirements-table td {
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #000;
  padding: 12px 20px;
  text-align: left;
  border-bottom: 1px solid var(--button-bg);
  border-right: 1px solid var(--button-bg);
  vertical-align: top;
}

.requirements-table th:last-child {
  border-right: none;
}

.requirements-table td:last-child {
  border-right: none;
}

@media (max-width: 768px) {
  .requirements-header :deep(.uslugi-table-title) {
    font-size: 20px;
  }

  .requirements-table th {
    font-size: 16px;
  }
}
</style>
