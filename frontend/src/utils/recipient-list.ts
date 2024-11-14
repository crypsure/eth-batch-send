import { IBatchItem } from '../types'
import { batchOptions, duplicates } from './global-state'
import { isAddress } from '@samatech/vue3-eth'

export const mergeDuplicates = () => {
  const dups = new Set<string>()
  const record: IBatchItem[] = []
  for (const item of batchOptions.value.batchItems) {
    const addr = item.address.toLowerCase()
    const dup = dups.has(addr)
    if (!dup) {
      dups.add(addr)
      record.push(item)
    }
  }
  batchOptions.value.batchItems = record
  duplicates.value = []
}

export const cleanItems = (items: IBatchItem[], isFixed: boolean): IBatchItem[] => {
  return items.map(({ address, amount }) => ({
    address: address.startsWith('0x') ? address : `0x${address}`,
    amount: isFixed ? batchOptions.value.fixedAmount : amount,
  }))
}

export const amountInvalid = (amount: string): boolean => {
  return isNaN(parseInt(amount))
}

export const verifyItems = (items: IBatchItem[]): string | undefined => {
  if (!items.length) {
    return 'At least one recipient is required.'
  }
  for (let i = 0; i < items.length; i += 1) {
    const { amount, address } = items[i]
    if (!address || !isAddress(address)) {
      return `Line ${i + 1} address is invalid`
    } else if (amountInvalid(amount)) {
      return `Line ${i + 1} amount is invalid`
    }
  }
}
