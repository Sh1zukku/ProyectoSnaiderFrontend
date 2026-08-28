export type Item = {
  /** 38503 */
  id: string
  /** ARGENTAGRO S.R.L. */
  client: string
  /** AGRO CHACO SRL */
  counterparty: string
  /** 06 RESISTENCIA */
  branchCode: string
  branchName: string
  /** 3 */
  quantity: number
  /** 0.00 */
  amountA: number
  /** 293917.00 */
  amountB: number
  /** N */
  flag: 'N' | 'S'
  /** 20/08/2026 18:14 */
  date: string
  /** 1 */
  status: number
}

export const items: Item[] = [
  {
    id: '38503',
    client: 'ARGENTAGRO S.R.L.',
    counterparty: 'AGRO CHACO SRL',
    branchCode: '06',
    branchName: 'RESISTENCIA',
    quantity: 3,
    amountA: 0,
    amountB: 293917,
    flag: 'N',
    date: '20/08/2026 18:14',
    status: 1,
  },
  {
    id: '38504',
    client: 'CEREALES DEL NORTE S.A.',
    counterparty: 'TRANSPORTES LOPEZ SRL',
    branchCode: '01',
    branchName: 'BUENOS AIRES',
    quantity: 12,
    amountA: 15400,
    amountB: 1284500,
    flag: 'S',
    date: '20/08/2026 17:42',
    status: 1,
  },
  {
    id: '38505',
    client: 'AGROSERVICIOS PAMPEANOS',
    counterparty: 'MOLINOS RIO SRL',
    branchCode: '04',
    branchName: 'ROSARIO',
    quantity: 7,
    amountA: 0,
    amountB: 87200.5,
    flag: 'N',
    date: '20/08/2026 16:08',
    status: 0,
  },
  {
    id: '38506',
    client: 'SEMILLERA DON JOSE S.R.L.',
    counterparty: 'ACOPIO SAN MARTIN',
    branchCode: '06',
    branchName: 'RESISTENCIA',
    quantity: 1,
    amountA: 2300,
    amountB: 45900,
    flag: 'N',
    date: '19/08/2026 11:55',
    status: 2,
  },
  {
    id: '38507',
    client: 'LA CHACRA GRANDE S.A.',
    counterparty: 'AGRO CHACO SRL',
    branchCode: '09',
    branchName: 'CORDOBA',
    quantity: 24,
    amountA: 118750,
    amountB: 2984300,
    flag: 'S',
    date: '19/08/2026 09:30',
    status: 1,
  },
  {
    id: '38508',
    client: 'INSUMOS DEL LITORAL SRL',
    counterparty: 'DISTRIBUIDORA CENTRO',
    branchCode: '02',
    branchName: 'SANTA FE',
    quantity: 5,
    amountA: 0,
    amountB: 61044.75,
    flag: 'N',
    date: '18/08/2026 20:17',
    status: 0,
  },
  {
    id: '38509',
    client: 'FERTIL SUR S.A.',
    counterparty: 'PUERTO SUR LOGISTICA',
    branchCode: '11',
    branchName: 'BAHIA BLANCA',
    quantity: 18,
    amountA: 64200,
    amountB: 1750980,
    flag: 'S',
    date: '18/08/2026 14:03',
    status: 1,
  },
  {
    id: '38510',
    client: 'CAMPO ABIERTO S.R.L.',
    counterparty: 'AGRO CHACO SRL',
    branchCode: '06',
    branchName: 'RESISTENCIA',
    quantity: 2,
    amountA: 0,
    amountB: 19850,
    flag: 'N',
    date: '17/08/2026 08:21',
    status: 2,
  },
]

export const statusLabels: Record<number, { label: string; tone: 'active' | 'pending' | 'closed' }> = {
  0: { label: 'Pendiente', tone: 'pending' },
  1: { label: 'Activo', tone: 'active' },
  2: { label: 'Cerrado', tone: 'closed' },
}

export function formatAmount(value: number) {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
