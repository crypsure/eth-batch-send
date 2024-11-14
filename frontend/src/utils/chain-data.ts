import { computed } from 'vue'
import { useEth } from './use-eth'

interface IChainData {
  batchSendContract: string
  name: string
  explorer: string
}

const { chainId } = useEth()

const localhost: IChainData = {
  batchSendContract: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  name: 'localhost',
  explorer: '',
}

const sepolia: IChainData = {
  batchSendContract: '0x46a959d39096DA45AFfa5334641C7A4D20FE33d8',
  name: 'Sepolia',
  explorer: 'https://sepolia.etherscan.io',
}

const mainnet: IChainData = {
  batchSendContract: '',
  name: 'Mainnet',
  explorer: 'https://etherscan.io',
}

export const chainData = computed(() => {
  let id = chainId.value || window.ethereum.chainId
  id = id ? parseInt(id) : id
  if (id === 1337) {
    return localhost
  } else if (id === 11155111) {
    return sepolia
  } else if (id === 1) {
    return mainnet
  }
})
