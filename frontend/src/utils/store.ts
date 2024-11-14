import { IToken } from '../types'
import { batchOptions } from './global-state'

const TOKEN_KEY = '__token'
const FIXED_KEY = '__fixed'
const FIXED_AMOUNT_KEY = '__fixedAmount'

export const setToken = (token: IToken) => {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))
}

export const setFixed = (fixed: boolean) => {
  localStorage.setItem(FIXED_KEY, fixed ? '1' : '0')
}

export const setFixedAmount = (fixedAmount: string) => {
  localStorage.setItem(FIXED_AMOUNT_KEY, fixedAmount.toString())
}

export const restore = () => {
  const tokenStr = localStorage.getItem(TOKEN_KEY)
  const token: IToken = tokenStr ? JSON.parse(tokenStr) : undefined
  batchOptions.value.token = token
  batchOptions.value.tokenAddress = token?.address || ''

  const isFixed = localStorage.getItem(FIXED_KEY) || '1'
  // Default to fixed amount (default true)
  batchOptions.value.isFixed = isFixed === '1'
  const fixedAmount = localStorage.getItem(FIXED_AMOUNT_KEY)
  batchOptions.value.fixedAmount = fixedAmount || ''
}
