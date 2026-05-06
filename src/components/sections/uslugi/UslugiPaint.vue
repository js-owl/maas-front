<script lang="ts" setup>
import { ref } from 'vue'
import IconArrowDown from '@/icons/IconArrowDown.vue'

const isRequirementsExpanded = ref(false)

const examples = [
  '/uslugiPages/paint-example-1.png',
  '/uslugiPages/paint-example-2.png',
  '/uslugiPages/paint-example-3.png',
  '/uslugiPages/paint-example-4.png',
]

const ralPaletteGroups = [
  ['1000', '1001', '1002', '1003', '1004', '1005', '1006', '1007', '1011', '1012', '1013', '1014', '1015', '1016', '1017', '1018', '1019', '1020', '1021', '1023', '1024', '1027', '1028', '1032', '1033', '1034'],
  ['2000', '2001', '2002', '2003', '2004', '2008', '2009', '2010', '2011', '2012'],
  ['3000', '3001', '3002', '3003', '3004', '3005', '3007', '3009', '3011', '3012', '3013', '3014', '3015', '3016', '3017', '3018', '3020', '3022', '3027', '3031'],
  ['4001', '4002', '4003', '4004', '4005', '4006', '4007', '4008', '4009', '4010'],
  ['5000', '5001', '5002', '5003', '5004', '5005', '5007', '5008', '5009', '5010', '5011', '5012', '5013', '5014', '5015', '5017', '5018', '5019', '5020', '5021', '5022', '5023', '5024'],
  ['6000', '6001', '6002', '6003', '6004', '6005', '6006', '6007', '6008', '6009', '6010', '6011', '6012', '6013', '6014', '6015', '6016', '6017', '6018', '6019', '6020', '6021', '6022', '6024', '6025', '6026', '6027', '6028', '6029', '6032', '6033', '6034'],
  ['7000', '7001', '7002', '7003', '7004', '7005', '7006', '7008', '7009', '7010', '7011', '7012', '7013', '7015', '7016', '7021', '7022', '7023', '7024', '7026', '7030', '7031', '7032', '7033', '7034', '7035', '7036', '7037', '7038', '7039', '7040', '7042', '7043', '7044', '7045', '7046', '7047'],
  ['8000', '8001', '8002', '8003', '8004', '8007', '8008', '8011', '8012', '8014', '8015', '8016', '8017', '8019', '8022', '8023', '8024', '8025', '8028'],
  ['9001', '9002', '9003', '9004', '9005', '9010', '9011', '9016', '9017', '9018'],
]

const ralColorsMeta = [
  { code: '1000', bg: '#ccc58f', text: '#000000' }, { code: '1001', bg: '#d1bc8a', text: '#000000' }, { code: '1002', bg: '#d2b773', text: '#000000' }, { code: '1003', bg: '#f7ba0b', text: '#000000' }, { code: '1004', bg: '#e2b007', text: '#000000' }, { code: '1005', bg: '#c89f04', text: '#000000' }, { code: '1006', bg: '#e1a100', text: '#000000' }, { code: '1007', bg: '#e79c00', text: '#000000' }, { code: '1011', bg: '#af8a54', text: '#000000' }, { code: '1012', bg: '#d9c022', text: '#000000' }, { code: '1013', bg: '#e9e5ce', text: '#000000' }, { code: '1014', bg: '#ded09f', text: '#000000' }, { code: '1015', bg: '#eadebd', text: '#000000' }, { code: '1016', bg: '#eaf044', text: '#000000' }, { code: '1017', bg: '#f4b752', text: '#000000' }, { code: '1018', bg: '#f3e03b', text: '#000000' }, { code: '1019', bg: '#a4957d', text: '#000000' }, { code: '1020', bg: '#9a9464', text: '#000000' }, { code: '1021', bg: '#eec900', text: '#000000' }, { code: '1023', bg: '#f0ca00', text: '#000000' }, { code: '1024', bg: '#b89c50', text: '#000000' }, { code: '1027', bg: '#a38c15', text: '#000000' }, { code: '1028', bg: '#ffab00', text: '#000000' }, { code: '1032', bg: '#ddb20f', text: '#000000' }, { code: '1033', bg: '#faab21', text: '#000000' }, { code: '1034', bg: '#edab56', text: '#000000' },
  { code: '2000', bg: '#dd7907', text: '#ffffff' }, { code: '2001', bg: '#be4e24', text: '#ffffff' }, { code: '2002', bg: '#c63927', text: '#ffffff' }, { code: '2003', bg: '#fa842b', text: '#ffffff' }, { code: '2004', bg: '#e75b12', text: '#ffffff' }, { code: '2008', bg: '#f3752c', text: '#ffffff' }, { code: '2009', bg: '#e15501', text: '#ffffff' }, { code: '2010', bg: '#d4652f', text: '#ffffff' }, { code: '2011', bg: '#ec7c25', text: '#ffffff' }, { code: '2012', bg: '#db6a50', text: '#ffffff' },
  { code: '3000', bg: '#ab2524', text: '#ffffff' }, { code: '3001', bg: '#a02128', text: '#ffffff' }, { code: '3002', bg: '#a1232b', text: '#ffffff' }, { code: '3003', bg: '#8d1d2c', text: '#ffffff' }, { code: '3004', bg: '#701f29', text: '#ffffff' }, { code: '3005', bg: '#5e2028', text: '#ffffff' }, { code: '3007', bg: '#402225', text: '#ffffff' }, { code: '3009', bg: '#703731', text: '#ffffff' }, { code: '3011', bg: '#7e292c', text: '#ffffff' }, { code: '3012', bg: '#cb8d73', text: '#ffffff' }, { code: '3013', bg: '#9c322e', text: '#ffffff' }, { code: '3014', bg: '#d47479', text: '#ffffff' }, { code: '3015', bg: '#e1a6ad', text: '#ffffff' }, { code: '3016', bg: '#ac4034', text: '#ffffff' }, { code: '3017', bg: '#d3545f', text: '#ffffff' }, { code: '3018', bg: '#d14152', text: '#ffffff' }, { code: '3020', bg: '#c1121c', text: '#ffffff' }, { code: '3022', bg: '#d56d56', text: '#ffffff' }, { code: '3027', bg: '#b42041', text: '#ffffff' }, { code: '3031', bg: '#ac323b', text: '#ffffff' },
  { code: '4001', bg: '#8a5a83', text: '#ffffff' }, { code: '4002', bg: '#933d50', text: '#ffffff' }, { code: '4003', bg: '#d15b8f', text: '#ffffff' }, { code: '4004', bg: '#691639', text: '#ffffff' }, { code: '4005', bg: '#83639d', text: '#ffffff' }, { code: '4006', bg: '#992572', text: '#ffffff' }, { code: '4007', bg: '#4a203b', text: '#ffffff' }, { code: '4008', bg: '#904684', text: '#ffffff' }, { code: '4009', bg: '#a38995', text: '#ffffff' }, { code: '4010', bg: '#c63678', text: '#ffffff' },
  { code: '5000', bg: '#384c70', text: '#ffffff' }, { code: '5001', bg: '#1f4764', text: '#ffffff' }, { code: '5002', bg: '#2b2c7c', text: '#ffffff' }, { code: '5003', bg: '#2a3756', text: '#ffffff' }, { code: '5004', bg: '#1d1f2a', text: '#ffffff' }, { code: '5005', bg: '#154889', text: '#ffffff' }, { code: '5007', bg: '#41678d', text: '#ffffff' }, { code: '5008', bg: '#313c48', text: '#ffffff' }, { code: '5009', bg: '#2e5978', text: '#ffffff' }, { code: '5010', bg: '#13447c', text: '#ffffff' }, { code: '5011', bg: '#232c3f', text: '#ffffff' }, { code: '5012', bg: '#3481b8', text: '#ffffff' }, { code: '5013', bg: '#232d53', text: '#ffffff' }, { code: '5014', bg: '#6c7c98', text: '#ffffff' }, { code: '5015', bg: '#2874b2', text: '#ffffff' }, { code: '5017', bg: '#0e518d', text: '#ffffff' }, { code: '5018', bg: '#21888f', text: '#ffffff' }, { code: '5019', bg: '#1a5784', text: '#ffffff' }, { code: '5020', bg: '#0b4151', text: '#ffffff' }, { code: '5021', bg: '#07737a', text: '#ffffff' }, { code: '5022', bg: '#2f2a5a', text: '#ffffff' }, { code: '5023', bg: '#4d668e', text: '#ffffff' }, { code: '5024', bg: '#6a93b0', text: '#ffffff' },
  { code: '6000', bg: '#327662', text: '#ffffff' }, { code: '6001', bg: '#28713e', text: '#ffffff' }, { code: '6002', bg: '#276235', text: '#ffffff' }, { code: '6003', bg: '#4b573e', text: '#ffffff' }, { code: '6004', bg: '#0e4243', text: '#ffffff' }, { code: '6005', bg: '#0f4336', text: '#ffffff' }, { code: '6006', bg: '#40433b', text: '#ffffff' }, { code: '6007', bg: '#283424', text: '#ffffff' }, { code: '6008', bg: '#35382e', text: '#ffffff' }, { code: '6009', bg: '#26392f', text: '#ffffff' }, { code: '6010', bg: '#3e753b', text: '#ffffff' }, { code: '6011', bg: '#66825b', text: '#ffffff' }, { code: '6012', bg: '#31403d', text: '#ffffff' }, { code: '6013', bg: '#797c5a', text: '#ffffff' }, { code: '6014', bg: '#444337', text: '#ffffff' }, { code: '6015', bg: '#3d403a', text: '#ffffff' }, { code: '6016', bg: '#026a52', text: '#ffffff' }, { code: '6017', bg: '#468641', text: '#ffffff' }, { code: '6018', bg: '#48a43f', text: '#ffffff' }, { code: '6019', bg: '#b7d9b1', text: '#ffffff' }, { code: '6020', bg: '#354733', text: '#ffffff' }, { code: '6021', bg: '#86a47c', text: '#ffffff' }, { code: '6022', bg: '#3e3c32', text: '#ffffff' }, { code: '6024', bg: '#008754', text: '#ffffff' }, { code: '6025', bg: '#53753c', text: '#ffffff' }, { code: '6026', bg: '#005d52', text: '#ffffff' }, { code: '6027', bg: '#81c0bb', text: '#ffffff' }, { code: '6028', bg: '#2d5546', text: '#ffffff' }, { code: '6029', bg: '#007243', text: '#ffffff' }, { code: '6032', bg: '#0f8558', text: '#ffffff' }, { code: '6033', bg: '#478a84', text: '#ffffff' }, { code: '6034', bg: '#7fb0b2', text: '#ffffff' },
  { code: '7000', bg: '#7e8b92', text: '#ffffff' }, { code: '7001', bg: '#8f999f', text: '#ffffff' }, { code: '7002', bg: '#817f68', text: '#ffffff' }, { code: '7003', bg: '#7a7b6d', text: '#ffffff' }, { code: '7004', bg: '#9ea0a1', text: '#ffffff' }, { code: '7005', bg: '#6b716f', text: '#ffffff' }, { code: '7006', bg: '#756f61', text: '#ffffff' }, { code: '7008', bg: '#746643', text: '#ffffff' }, { code: '7009', bg: '#5b6259', text: '#ffffff' }, { code: '7010', bg: '#575d57', text: '#ffffff' }, { code: '7011', bg: '#555d61', text: '#ffffff' }, { code: '7012', bg: '#596163', text: '#ffffff' }, { code: '7013', bg: '#555548', text: '#ffffff' }, { code: '7015', bg: '#51565c', text: '#ffffff' }, { code: '7016', bg: '#373f43', text: '#ffffff' }, { code: '7021', bg: '#2e3234', text: '#ffffff' }, { code: '7022', bg: '#4b4d46', text: '#ffffff' }, { code: '7023', bg: '#818479', text: '#ffffff' }, { code: '7024', bg: '#474a50', text: '#ffffff' }, { code: '7026', bg: '#374447', text: '#ffffff' }, { code: '7030', bg: '#939388', text: '#ffffff' }, { code: '7031', bg: '#5d6970', text: '#ffffff' }, { code: '7032', bg: '#b9b9a8', text: '#ffffff' }, { code: '7033', bg: '#818979', text: '#ffffff' }, { code: '7034', bg: '#939176', text: '#ffffff' }, { code: '7035', bg: '#cbd0cc', text: '#ffffff' }, { code: '7036', bg: '#9a9697', text: '#ffffff' }, { code: '7037', bg: '#7c7f7e', text: '#ffffff' }, { code: '7038', bg: '#b4b8b0', text: '#ffffff' }, { code: '7039', bg: '#6b695f', text: '#ffffff' }, { code: '7040', bg: '#9da3a6', text: '#ffffff' }, { code: '7042', bg: '#8f9695', text: '#ffffff' }, { code: '7043', bg: '#4e5451', text: '#ffffff' }, { code: '7044', bg: '#bdbdb2', text: '#ffffff' }, { code: '7045', bg: '#91969a', text: '#ffffff' }, { code: '7046', bg: '#82898e', text: '#ffffff' }, { code: '7047', bg: '#cfd0cf', text: '#ffffff' },
  { code: '8000', bg: '#887142', text: '#ffffff' }, { code: '8001', bg: '#9c6b30', text: '#ffffff' }, { code: '8002', bg: '#7b5141', text: '#ffffff' }, { code: '8003', bg: '#80542f', text: '#ffffff' }, { code: '8004', bg: '#8f4e35', text: '#ffffff' }, { code: '8007', bg: '#6f4a2f', text: '#ffffff' }, { code: '8008', bg: '#6f4f28', text: '#ffffff' }, { code: '8011', bg: '#5a3a29', text: '#ffffff' }, { code: '8012', bg: '#673831', text: '#ffffff' }, { code: '8014', bg: '#49392d', text: '#ffffff' }, { code: '8015', bg: '#633a34', text: '#ffffff' }, { code: '8016', bg: '#4c2f26', text: '#ffffff' }, { code: '8017', bg: '#44322d', text: '#ffffff' }, { code: '8019', bg: '#3f3a3a', text: '#ffffff' }, { code: '8022', bg: '#211f20', text: '#ffffff' }, { code: '8023', bg: '#a65e2f', text: '#ffffff' }, { code: '8024', bg: '#79553c', text: '#ffffff' }, { code: '8025', bg: '#755c49', text: '#ffffff' }, { code: '8028', bg: '#4e3b2b', text: '#ffffff' },
  { code: '9001', bg: '#efebdc', text: '#000000' }, { code: '9002', bg: '#ddded4', text: '#000000' }, { code: '9003', bg: '#f4f8f4', text: '#000000' }, { code: '9004', bg: '#2e3032', text: '#ffffff' }, { code: '9005', bg: '#0a0a0d', text: '#ffffff' }, { code: '9010', bg: '#f7f9ef', text: '#000000' }, { code: '9011', bg: '#292c2f', text: '#ffffff' }, { code: '9016', bg: '#f7fbf5', text: '#000000' }, { code: '9017', bg: '#2a2d2f', text: '#ffffff' }, { code: '9018', bg: '#cfd3cd', text: '#000000' },
]

const ralColorsMap = Object.fromEntries(ralColorsMeta.map((item) => [item.code, item]))

const getRalStyle = (code: string) => {
  const color = ralColorsMap[code]

  if (!color) {
    return {
      backgroundColor: '#d1d6da',
      color: '#1f1f1f',
    }
  }

  return {
    backgroundColor: color.bg,
    color: color.text,
  }
}
</script>

<template>
  <!-- Лакокрасочные материалы -->
  <el-col :offset="3" :span="18" :xs="{ span: 24, offset: 0 }">
    <div class="uslugi-wrapper">
      <div class="uslugi-title">Лакокрасочные материалы</div>

      <div class="uslugi-section">
        <div class="uslugi-text">
          <p class="paint-lead">
            <span>Материалы:</span>
            акриловые и уретановые краски, порошковые краски, эпоксидные краски, защитные лаки
          </p>
          <p>
            Мы предлагаем покраску профессиональным оборудованием, которое позволяет создать
            равномерное покрытие высокого качества.
          </p>
          <p>
            Различные типы покрытий подойдут для широкого спектра задач, позволяя не только улучшать
            эстетику, но и защитные свойства изделий (в том числе - химические и температурные).
          </p>
          <p class="paint-lead">
            <span>Материалы:</span>
            металл (черные и цветные сплавы), композитные изделия, углепластики и стеклопластики на
            эпоксидном связующем.
          </p>
        </div>

        <div class="uslugi-image-wrapper">
          <img src="/uslugiPages/paint-main.png" alt="Порошковая покраска" class="uslugi-image" />
        </div>
      </div>

      <div class="paint-examples">
        <div class="uslugi-table-title">Примеры работ</div>
        <div class="examples-grid">
          <img v-for="(example, index) in examples" :key="index" :src="example" alt="Пример работ ЛКМ" />
        </div>
      </div>

      <div class="technical-requirements">
        <div class="requirements-header" @click="isRequirementsExpanded = !isRequirementsExpanded">
          <div class="uslugi-table-title requirements-title">Библиотека цветов RAL</div>
          <el-icon class="requirements-arrow" :class="{ expanded: isRequirementsExpanded }">
            <IconArrowDown />
          </el-icon>
        </div>

        <div v-if="isRequirementsExpanded" class="requirements-table-wrapper">
          <div class="ral-groups">
            <div v-for="(group, groupIndex) in ralPaletteGroups" :key="groupIndex" class="ral-group">
              <div class="ral-grid">
                <div v-for="color in group" :key="color" class="ral-tag" :style="getRalStyle(color)">
                  {{ color }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-col>
</template>

<style scoped>
.uslugi-wrapper {
  box-shadow: 0 10px 15px 0 var(--button-bg);
  padding: 40px;
}

.uslugi-title {
  line-height: 1;
  margin-bottom: 20px;
}

.technical-requirements {
  margin-top: 20px;
}

.requirements-header {
  align-items: center;
  background-color: var(--bgcolor);
  height: 64px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 0 20px;
}

.requirements-title {
  margin-bottom: 0;
}

.paint-examples {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.examples-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);
}

.examples-grid img {
  border-radius: 10px;
  height: 240px;
  object-fit: cover;
  width: 100%;
}

.paint-lead {
  margin: 0;
}

.paint-lead span {
  font-family: 'Montserrat-SemiBold', sans-serif;
  font-size: 24px;
}

.requirements-arrow {
  transition: transform 0.2s ease;
  transform: rotate(0deg);
}

.requirements-arrow.expanded {
  transform: rotate(-180deg);
}

.requirements-table-wrapper {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--button-bg);
  background-color: var(--whity);
  padding: 20px;
}

.ral-groups {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ral-group {
  background-color: #fff;
  border-radius: 10px;
  padding: 8px;
}

.ral-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.ral-tag {
  align-items: center;
  background-color: #d1d6da;
  border-radius: 5px;
  color: #1f1f1f;
  display: inline-flex;
  font-family: 'Montserrat-Medium', sans-serif;
  font-size: 18px;
  line-height: 1.1;
  justify-content: center;
  min-height: 55px;
  min-width: 110px;
  padding: 8px 10px;
}

.uslugi-text {
  display: flex;
  flex-direction: column;
  gap: 12px;
  line-height: 1.35;
}

.uslugi-text p {
  margin: 0;
}

.uslugi-section {
  align-items: stretch;
  margin-bottom: 80px;
}

.uslugi-image-wrapper {
  flex: 0 0 590px;
}

.uslugi-image {
  box-shadow: none;
  height: 100%;
  width: 100%;
}

@media (max-width: 767px) {
  .uslugi-wrapper {
    padding: 20px;
  }

  .uslugi-section {
    margin-bottom: 40px;
  }

  .paint-lead span {
    font-size: 20px;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .examples-grid img {
    height: 200px;
  }

  .requirements-header {
    height: 56px;
    padding: 0 16px;
  }

  .ral-tag {
    font-size: 16px;
    min-height: 44px;
    min-width: 90px;
  }
}
</style>
