import { IBatchItem } from './i-batch-item'
import { IToken } from './i-token'

export interface IBatchOptions {
  isFixed: boolean
  tokenAddress: string
  token: IToken | undefined
  fixedAmount: string
  batchItems: IBatchItem[]
}
