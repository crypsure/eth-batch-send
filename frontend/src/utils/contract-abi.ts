export const erc20Abi = [
  {
    type: 'function',
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string', internalType: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address', internalType: 'address' },
      { name: 'spender', type: 'address', internalType: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address', internalType: 'address' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
]

export const batchSendAbi = [
  {
    type: 'function',
    name: 'sendCustom',
    inputs: [
      { name: 'token', type: 'address', internalType: 'contract IERC20' },
      { name: 'recipients', type: 'address[]', internalType: 'address[]' },
      { name: 'values', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'sendCustomSimple',
    inputs: [
      { name: 'token', type: 'address', internalType: 'contract IERC20' },
      { name: 'recipients', type: 'address[]', internalType: 'address[]' },
      { name: 'values', type: 'uint256[]', internalType: 'uint256[]' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'sendFixed',
    inputs: [
      { name: 'token', type: 'address', internalType: 'contract IERC20' },
      { name: 'recipients', type: 'address[]', internalType: 'address[]' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'sendFixedSimple',
    inputs: [
      { name: 'token', type: 'address', internalType: 'contract IERC20' },
      { name: 'recipients', type: 'address[]', internalType: 'address[]' },
      { name: 'amount', type: 'uint256', internalType: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
]
