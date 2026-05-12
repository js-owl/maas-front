export type OrderTypeOption = {
  label: string
  value: string
  routePath: string
  serviceId: string
}

export const orderTypeOptions = [
  { label: 'мехобработка', value: 'milling', routePath: '/milling', serviceId: 'cnc-milling' },
  { label: '3D-печать', value: 'printing', routePath: '/printing', serviceId: 'printing' },
  { label: 'прочее', value: 'other', routePath: '/other', serviceId: 'other' },
] satisfies OrderTypeOption[]
