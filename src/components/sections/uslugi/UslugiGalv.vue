<script lang="ts" setup>
import { useUslugiRequirementsExpand } from '@/composables/useUslugiRequirementsExpand'
import UslugiRequirementsAccordion from '@/components/sections/uslugi/UslugiRequirementsAccordion.vue'
import UslugiKeywords from '@/components/sections/uslugi/UslugiKeywords.vue'

const { isRequirementsExpanded, isMobile } = useUslugiRequirementsExpand()

const keywords = [
  'Гальванические покрытия на заказ',
  'Анодирование алюминия',
  'Твёрдое анодирование',
  'Хромирование',
  'Никелирование',
  'Цинкование',
  'Кадмирование',
  'Серебрение',
  'Химическая обработка титана',
]

type GalvanicService = {
  name: string
  thickness: string
  maxSize: string
}

const galvanicServices: GalvanicService[] = [
  {
    name: 'Оксидирование анодное алюминиевых сплавов',
    thickness: '5 … 8',
    maxSize: '5800 х 600 х 1350',
  },
  {
    name: 'Оксидирование химическое алюминиевых сплавов',
    thickness: '5 … 8',
    maxSize: '5800 х 700 х 1450',
  },
  {
    name: 'Оксидирование твердое анодное алюминиевых сплавов',
    thickness: '10 … 40',
    maxSize: '5800 х 600 х 1350',
  },
  {
    name: 'Фосфатирование сталей',
    thickness: '10 … 40',
    maxSize: '1800 х 600 х 750',
  },
  {
    name: 'Цинкование',
    thickness: '1 … 12',
    maxSize: '2800 х 300 х 850',
  },
  {
    name: 'Кадмирование хлористоаммонийное',
    thickness: '1 … 15',
    maxSize: '2800 х 300 х 850',
  },
  {
    name: 'Оксидирование магниевых сплавов',
    thickness: '-',
    maxSize: '1700 х 600 х 900',
  },
  {
    name: 'Химическая обработка нержавеющих сталей',
    thickness: '-',
    maxSize: '2800 х 850 х 950',
  },
  {
    name: 'Фосфатирование сталей',
    thickness: '-',
    maxSize: '1800 х 600 х 750',
  },
  {
    name: 'Кадмирование сернокислое',
    thickness: '1 … 15',
    maxSize: '1000 х 190 х 350',
  },
  {
    name: 'Никелирование сернокислое',
    thickness: '2 … 3',
    maxSize: '1000 х 190 х 350',
  },
  {
    name: 'Никелирование хлористое',
    thickness: '5 … 15',
    maxSize: '1000 х 190 х 350',
  },
  {
    name: 'Покрытие гальвано термический никель-кадмий',
    thickness: '1 … 18',
    maxSize: '1000 х 190 х 350',
  },
  {
    name: 'Олово-висмут',
    thickness: '1 … 20',
    maxSize: '1000 х 190 х 350',
  },
  {
    name: 'Химическая обработка титановых сплавов',
    thickness: '-',
    maxSize: '2800 х 800 х 850',
  },
  {
    name: 'Химическая обработка нержавеющих сталей (трубы)',
    thickness: '-',
    maxSize: 'тр.8х1 х 3900',
  },
  {
    name: 'Хромирование',
    thickness: '10 … 60',
    maxSize: '1400 х 200 х 550',
  },
  {
    name: 'Серебрение',
    thickness: '0,5 … 15',
    maxSize: '1500 х 150 х 30',
  },
]
</script>

<template>
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper uslugi-wrapper--galv">
      <h1 class="uslugi-title">Гальванические покрытия и химическая обработка металлов</h1>

      <div class="uslugi-section">
        <div class="uslugi-text">
          <p>
            Выполняем нанесение гальванических покрытий и химическую обработку металлических деталей
            на заказ. Производственные возможности включают защитные и функциональные покрытия для
            изделий из сталей, алюминиевых, магниевых и титановых сплавов.
          </p>
          <p>
            Покрытия применяются для защиты металла от коррозии, повышения износостойкости и
            улучшения эксплуатационных характеристик изделия. Конкретная технология выбирается с
            учётом материала детали, условий эксплуатации, требований к толщине и функциональным
            свойствам покрытия.
          </p>
          <p>
            Производственные ресурсы позволяют работать в том числе с крупногабаритными изделиями. В
            зависимости от технологического процесса максимальные габариты обрабатываемых деталей
            достигают 5800 × 700 × 1450 мм.
          </p>
          <p>
            Для расчёта заказа передайте чертёж, 3D-модель или техническую документацию. Специалисты
            определят возможность обработки, подходящую технологию и производственный маршрут.
          </p>
        </div>

        <div class="uslugi-image-wrapper">
          <img
            src="/uslugiPages/galv.png"
            alt="Гальванические покрытия и химическая обработка металлов"
            class="uslugi-image"
            width="500"
            height="374"
          />
        </div>
      </div>

      <UslugiKeywords :tags="keywords" />

      <UslugiRequirementsAccordion
        v-if="isMobile"
        v-model:expanded="isRequirementsExpanded"
        title="Виды гальванического покрытия"
        :is-mobile="isMobile"
      >
        <template #mobile>
          <div class="galv-mobile-list">
            <div
              v-for="(service, index) in galvanicServices"
              :key="`${service.name}-${service.thickness}-${index}`"
              class="galv-mobile-list__item"
            >
              <p class="galv-mobile-list__name">{{ service.name }}</p>
              <div class="galv-mobile-list__row">
                <p class="galv-mobile-list__label">Толщина покрытия, мкм:</p>
                <p class="galv-mobile-list__value">{{ service.thickness }}</p>
              </div>
              <div class="galv-mobile-list__row">
                <p class="galv-mobile-list__label">Макс. габ. деталей, мм:</p>
                <p class="galv-mobile-list__value">{{ service.maxSize }}</p>
              </div>
            </div>
          </div>
        </template>
      </UslugiRequirementsAccordion>

      <div v-else class="uslugi-galv-table">
        <div class="uslugi-table-title">Виды гальванического покрытия</div>
        <div class="requirements-table-wrapper">
          <table class="requirements-table requirements-table--middle">
            <colgroup>
              <col style="width: 42%" />
              <col style="width: 29%" />
              <col style="width: 29%" />
            </colgroup>
            <thead>
              <tr>
                <th class="uslugi-table-thead">Вид покрытия</th>
                <th class="uslugi-table-thead">Толщина нанесения покрытия, мкм</th>
                <th class="uslugi-table-thead">Макс. габ. деталей, мм</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(service, index) in galvanicServices"
                :key="`${service.name}-${service.thickness}-${index}`"
              >
                <td>{{ service.name }}</td>
                <td>{{ service.thickness }}</td>
                <td>{{ service.maxSize }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.uslugi-galv-table {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.uslugi-galv-table .uslugi-table-title {
  margin: 0;
}
</style>
