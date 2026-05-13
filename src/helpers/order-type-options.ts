export type OrderTypeOption = {
  label: string
  value: string
  routePath: string
  serviceId: string
}

export const orderTypeOptions = [
  { label: 'Механическая обработка', value: 'milling', routePath: '/milling', serviceId: 'cnc-milling' },
  { label: '3D-печать', value: 'printing', routePath: '/printing', serviceId: 'printing' },
  { label: 'ПКМ', value: 'composite', routePath: '/composite', serviceId: 'composite' },
  { label: 'Гальваника', value: 'galvanic', routePath: '/galvanic', serviceId: 'electroplating' },
  { label: 'Прочее', value: 'other', routePath: '/other', serviceId: 'other' },
] satisfies OrderTypeOption[]
