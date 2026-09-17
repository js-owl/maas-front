<script lang="ts" setup>
import UslugiKeywords from '@/components/sections/uslugi/UslugiKeywords.vue'
import { usePageBreakpoints } from '@/composables/usePageBreakpoints'

const { isMobile } = usePageBreakpoints()

const keywords = [
  'Сварочные работы на заказ',
  'Аргонодуговая сварка',
  'Сварка титана',
  'Сварка алюминия',
  'Автоматическая сварка кольцевых швов',
  'Контактная сварка',
]

type WeldType = {
  name: string
  thickness: string[]
}

const weldTypes: WeldType[] = [
  { name: 'Сварка кольцевых швов', thickness: ['до 10 … 15 мм'] },
  { name: 'Сварка продольные швов', thickness: ['до 10 … 15 мм'] },
  { name: 'Сварка сильфона', thickness: ['до 10 … 15 мм'] },
  {
    name: 'Сварка плавящимся электродом в углекислом газе углеродистых сталей',
    thickness: ['до 10 … 15 мм'],
  },
  {
    name: 'Аргонодуговая сварка легированных сталей, титановых сплавов и алюминиевых сплавов',
    thickness: ['до 10 … 15 мм'],
  },
  {
    name: 'Контактная точечная сварка легированных сталей, титановых и алюминиевых сплавов',
    thickness: ['до 3 мм'],
  },
  {
    name: 'Контактная шовная сварка легированных сталей, титановых сплавов',
    thickness: ['до 3 мм'],
  },
  {
    name: 'Контактная шовная сварка сильфонов и мембранных узлов',
    thickness: ['до 3 мм'],
  },
  { name: 'Автоматическая сварка (кольцевых швов)', thickness: ['диаметр 80 … 1200 мм'] },
  {
    name: 'Передвижная установка для аргонно-дуговой сварки (стали коррозионно-стойкие (жаропрочные), титановые сплавы)',
    thickness: ['толщиной до 2,5 мм'],
  },
  {
    name: 'Сварка продольных швов (стали коррозионно-стойкие, титановые сплавы, алюминиевые сплавы)',
    thickness: [
      'диаметр – 350 … 1200 мм',
      'длина – 50 … 2300 мм',
      'толщина стенки – 0,5 … 10 мм',
    ],
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <template v-if="isMobile">
      <div class="uslugi-weld-cards">
        <div class="uslugi-wrapper uslugi-wrapper--weld-intro">
          <h1 class="uslugi-title">Сварочные работы</h1>
          <div class="uslugi-text">
            <p>
              Выполняем сварочные работы на заказ для деталей, узлов и цилиндрических изделий из
              сталей, титана и алюминиевых сплавов. Доступны ручная и автоматическая аргонодуговая
              сварка, полуавтоматическая сварка плавящимся электродом в углекислом газе, контактная
              точечная и шовная сварка, автоматическая сварка кольцевых и продольных швов.
            </p>
            <p>
              Отдельная компетенция — сварка сильфонов и мембранных узлов. Для расчёта необходимы
              материал, толщина, геометрия соединения и требования к шву.
            </p>
          </div>
          <div class="uslugi-image-wrapper">
            <img
              src="/uslugiPages/weld.png"
              alt="Сварочные работы"
              class="uslugi-image"
              width="308"
              height="200"
            />
          </div>
          <UslugiKeywords :tags="keywords" />
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
                <td>
                  <p
                    v-for="(line, index) in weldType.thickness"
                    :key="`${weldType.name}-${index}`"
                    class="weld-mobile-table__line"
                  >
                    {{ line }}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <div v-else class="uslugi-wrapper uslugi-wrapper--weld">
      <h1 class="uslugi-title">Сварочные работы</h1>

      <div class="uslugi-section">
        <div class="uslugi-text">
          <p>
            Выполняем сварочные работы на заказ для деталей, узлов и цилиндрических изделий из
            сталей, титана и алюминиевых сплавов. Доступны ручная и автоматическая аргонодуговая
            сварка, полуавтоматическая сварка плавящимся электродом в углекислом газе, контактная
            точечная и шовная сварка, автоматическая сварка кольцевых и продольных швов.
          </p>
          <p>Отдельная компетенция — сварка сильфонов и мембранных узлов.</p>
        </div>

        <div class="uslugi-image-wrapper">
          <img
            src="/uslugiPages/weld.png"
            alt="Сварочные работы"
            class="uslugi-image"
            width="500"
            height="380"
          />
        </div>

        <UslugiKeywords :tags="keywords" />
      </div>

      <div class="uslugi-weld-table">
        <div class="uslugi-table-title">Виды сварки</div>
        <div class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--middle">
            <thead>
              <tr>
                <th class="uslugi-table-thead">Тип сварки</th>
                <th class="uslugi-table-thead">Свариваемые толщины</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="weldType in weldTypes" :key="weldType.name">
                <td>{{ weldType.name }}</td>
                <td>
                  <template v-for="(line, index) in weldType.thickness" :key="line">
                    <br v-if="index > 0" />{{ line }}
                  </template>
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
.uslugi-weld-table {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.uslugi-weld-table .uslugi-table-title {
  margin: 0;
}

.weld-mobile-table__line {
  margin: 0;
}

.weld-mobile-table__line + .weld-mobile-table__line {
  margin-top: 4px;
}
</style>
