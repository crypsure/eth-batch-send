import { ref } from 'vue'
import { IBatchOptions } from '../types'

export const duplicates = ref<[string, number][]>([])

export const batchOptions = ref<IBatchOptions>({
  isFixed: true,
  tokenAddress: '',
  token: undefined,
  fixedAmount: '',
  batchItems: [{ address: '', amount: '' }],
})
