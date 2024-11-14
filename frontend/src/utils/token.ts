import { Contract, TransactionResponse } from '@samatech/vue3-eth'
import { batchOptions } from './global-state'
import { useEth } from './use-eth'
import { batchSendAbi, erc20Abi } from './contract-abi'
import { setToken } from './store'
import { chainData } from './chain-data'
import { computed } from 'vue'

const { getProviderOrConnect, getSignerOrConnect, wallets } = useEth()

export const tokenTotal = computed(() => {
  let total = 0n
  const { batchItems, isFixed } = batchOptions.value
  const fixedAmount = BigInt(batchOptions.value.fixedAmount)
  for (const item of batchItems) {
    if (isFixed) {
      total += fixedAmount
    } else {
      total += BigInt(item.amount)
    }
  }
  return total
})

export const ethToWei = (eth: string, dec?: string) => {
  const decimals = BigInt(dec ?? batchOptions.value.token?.decimals ?? '18')
  const total = BigInt(eth) * 10n ** decimals
  return total
}

export const verifyToken = async (): Promise<string | undefined> => {
  const { tokenAddress } = batchOptions.value
  try {
    const provider = await getProviderOrConnect()

    if (!provider) {
      return 'Please connect (or reconnect) your wallet.'
    } else if (!tokenAddress) {
      return 'Enter a token address'
    }
    const contract = new Contract(tokenAddress, erc20Abi, provider)
    const balance = (await contract.balanceOf(wallets.value[0])).toString()
    const decimals = (await contract.decimals()).toString()
    const name = (await contract.name()).toString()
    const symbol = (await contract.symbol()).toString()

    batchOptions.value.token = {
      symbol,
      name,
      decimals,
      address: tokenAddress,
      balance,
    }
    setToken(batchOptions.value.token)
    return undefined
  } catch (e) {
    batchOptions.value.token = undefined
    console.log('Verify fail:', e)
    return 'Unable to verify token, make sure your wallet is connected and the token address is valid.'
  }
}

export const approveTokens = async (
  totalStr: string,
): Promise<TransactionResponse | undefined> => {
  const { tokenAddress, token } = batchOptions.value

  try {
    const signer = await getSignerOrConnect()

    if (!chainData.value || !token || !signer) {
      throw 'Please connect (or reconnect) your wallet.'
    }
    const contract = new Contract(tokenAddress, erc20Abi, signer)

    const total = ethToWei(totalStr)
    return await contract.approve(chainData.value.batchSendContract, total)
  } catch (e) {
    console.log('Approve fail: ', e)
    throw 'Failed to approve token transfer, please try again.'
  }
}

export const tokenAllowance = async () => {
  const { tokenAddress } = batchOptions.value
  const provider = await getProviderOrConnect()

  if (!chainData.value || !provider) {
    throw 'Please connect (or reconnect) your wallet.'
  } else if (!tokenAddress) {
    throw 'Enter a token address'
  }
  const contract = new Contract(tokenAddress, erc20Abi, provider)

  const allowance = await contract.allowance(
    wallets.value[0],
    chainData.value.batchSendContract,
  )
  return BigInt(allowance)
}

export const batchSend = async (
  tipWei: string,
): Promise<TransactionResponse | undefined> => {
  const { tokenAddress, token, batchItems, isFixed } = batchOptions.value
  const signer = await getSignerOrConnect()

  if (!chainData.value || !token || !signer) {
    throw 'Please connect (or reconnect) your wallet.'
  }
  const contract = new Contract(chainData.value.batchSendContract, batchSendAbi, signer)
  try {
    const options = tipWei && tipWei !== '0' ? { value: tipWei } : {}
    const recipients = batchItems.map((item) => item.address)
    if (isFixed) {
      const amount = ethToWei(batchOptions.value.fixedAmount)
      return await contract.sendFixed(tokenAddress, recipients, amount, options)
    } else {
      const amounts = batchItems.map((item) => ethToWei(item.amount))
      return await contract.sendCustom(tokenAddress, recipients, amounts, options)
    }
  } catch (e) {
    console.log('Approve fail: ', e)
    throw 'Failed to approve token transfer, please try again.'
  }
}
