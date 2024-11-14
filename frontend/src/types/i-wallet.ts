import { IToken } from './i-token'

export interface IWallet {
  address: string
  eth: string
  tokens: IToken[]
}
