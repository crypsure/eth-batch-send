<template>
  <div class="flex-col content-wrap">
    <div class="address-label section-title">Token Address</div>
    <div class="token-wrap">
      <EthInput
        v-model="batchOptions.tokenAddress"
        placeholder="Address"
        class="token-address"
        @update:modelValue="batchOptions.token = undefined"
      />
      <div v-if="batchOptions.token" class="verified button">✔</div>
      <div v-else :animate="checking" class="check button" @click="verify">Check</div>
    </div>
    <TokenStatus />
    <form class="amount-option">
      <div class="option">
        <input
          type="radio"
          id="amount-fixed"
          name="amount"
          value="fixed"
          :checked="batchOptions.isFixed"
          @input="radioSelect(true)"
        />
        <label for="amount-fixed">Fixed amount per address</label>
      </div>
      <div class="option">
        <input
          type="radio"
          id="amount-custom"
          name="amount"
          value="custom"
          :checked="!batchOptions.isFixed"
          @input="radioSelect(false)"
        />
        <label for="amount-custom">Custom amount per address</label>
      </div>
    </form>
    <div v-if="batchOptions.isFixed" class="flex-col fixed-wrap">
      <div class="fixed-label section-title">Tokens Per Address</div>
      <EthInput v-model="batchOptions.fixedAmount" placeholder="Tokens" class="tokens" />
    </div>
    <div class="title-wrap">
      <div class="address-label section-title">Recipients</div>
      <Plus class="plus" @click="addRecipient" />
      <div class="recipient-count">
        {{ batchOptions.batchItems.length }}
      </div>
    </div>
    <div class="flex-col recipients">
      <div v-if="batchOptions.batchItems.length > 1000" class="warning">
        Transfers to over addresses 1,000 may exceed gas limit. Try splitting into smaller
        batches.
      </div>
      <div v-for="(item, index) in batchOptions.batchItems" class="address-wrap">
        <EthInput v-model="item.address" placeholder="Address" class="address" />
        <EthInput
          v-if="!batchOptions.isFixed"
          v-model="item.amount"
          placeholder="Amount"
          class="amount"
        />
        <Minus class="remove" @click="removeRecipient(index)" />
      </div>
    </div>
    <div v-if="duplicates.length > 0" class="duplicates flex-col">
      <div class="section-title">Duplicates</div>
      <div v-for="dup in duplicates" class="duplicate">
        <div>{{ dup[0] }}</div>
        <div>{{ dup[1] }}</div>
      </div>
      <Checkbox
        v-if="!batchOptions.isFixed"
        v-model="addDuplicates"
        label="Add token values when merging. If unchecked, the first value will be used."
        class="add-duplicates"
      />
      <div class="button merge-button" @click="mergeDuplicates">Merge</div>
    </div>
    <div class="error">
      {{ error }}
    </div>
    <div class="actions">
      <FileUpload @selectFile="selectCsv">
        <div class="button">Upload CSV</div>
      </FileUpload>
      <EbsButton :animate="loading" text="Next" class="button next" @click="next" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import EthInput from './widgets/EthInput.vue'
import FileUpload from './widgets/FileUpload.vue'
import Minus from './widgets/Minus.vue'
import Plus from './widgets/Plus.vue'
import {
  batchOptions,
  cleanItems,
  duplicates,
  loadFile,
  mergeDuplicates,
  restore,
  setFixed,
  setFixedAmount,
  amountInvalid,
  verifyItems,
  verifyToken,
} from '../utils'
import Checkbox from './widgets/Checkbox.vue'
import TokenStatus from './widgets/TokenStatus.vue'
import EbsButton from './widgets/EbsButton.vue'
import { useEth } from '../utils/use-eth'

const emit = defineEmits<{
  (e: 'next'): void
}>()

const error = ref()
const loading = ref(false)
const checking = ref(false)
const addDuplicates = ref(false)
const { walletConnected } = useEth()

watch(walletConnected, async (connected) => {
  if (connected && batchOptions.value.tokenAddress) {
    verify()
  } else {
    batchOptions.value.token = undefined
  }
})

const radioSelect = (fixed: boolean) => {
  batchOptions.value.isFixed = fixed
  setFixed(fixed)
  if (!fixed) {
    const { batchItems, fixedAmount } = batchOptions.value
    batchOptions.value.batchItems = batchItems.map(({ address }) => ({
      address,
      amount: fixedAmount,
    }))
  }
}

const removeRecipient = (index: number) => {
  batchOptions.value.batchItems.splice(index, 1)
}

const addRecipient = () => {
  batchOptions.value.batchItems.unshift({ address: '', amount: '' })
}

const checkDuplicates = () => {
  const dups: Record<string, number> = {}
  for (const item of batchOptions.value.batchItems) {
    const addr = item.address.toLowerCase()
    const dup = dups[addr]
    dups[addr] = dup !== undefined ? dup + 1 : 0
    if (dups[addr] > 0) {
    }
  }
  duplicates.value = Object.entries(dups).filter((dup) => dup[1] > 0)
}

const selectCsv = async (file: File) => {
  error.value = undefined
  const text = await loadFile(file)

  if (text) {
    const lines = text.split('\n')
    batchOptions.value.batchItems = []
    for (const line of lines) {
      const row = line.split(',')
      batchOptions.value.batchItems.push({
        address: row[0] ?? '',
        amount: row[1] ?? '',
      })
    }
    checkDuplicates()
  } else {
    error.value = 'Unable to load file'
  }
}

const verify = async () => {
  checking.value = true
  error.value = await verifyToken()
  checking.value = false
}

const next = async () => {
  const { isFixed, fixedAmount, batchItems } = batchOptions.value
  error.value = undefined

  loading.value = true
  const cleanedItems = cleanItems(batchItems, isFixed)
  await verify()
  if (error.value) return

  if (isFixed && amountInvalid(fixedAmount)) {
    error.value = 'Token amount must be a valid number.'
  } else if (isFixed && !fixedAmount) {
    error.value = 'Enter a fixed amount of tokens to send each address.'
  } else {
    const itemError = verifyItems(cleanedItems)
    if (itemError) {
      error.value = itemError
    } else {
      setFixedAmount(batchOptions.value.fixedAmount)
      emit('next')
    }
  }
  loading.value = false
}

onMounted(() => {
  restore()
})
</script>

<style lang="postcss">
@import '../css/global.postcss';

.check {
  margin-left: 8px;
  width: 68px;
}
.button.verified {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $green;
  margin-left: 8px;
  width: 68px;
  font-size: 24px;
  user-select: none;
  &:hover {
    background-color: $green;
    cursor: unset;
  }
}
.token-address {
  margin-top: 10px;
}
.amount-option {
  @mixin text-medium 14px;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
}
.fixed-wrap {
  margin-top: 24px;
}
.tokens {
  margin-top: 10px;
}
.recipients {
  width: 100%;
  max-height: 500px;
  overflow: auto;
}
.recipient-count {
  @mixin text-medium 13px;
  padding-right: 40px;
  margin-left: auto;
}
.title-wrap {
  display: flex;
  align-items: center;
  margin-top: 16px;
  width: 100%;
}
.plus {
  margin-left: 16px;
  cursor: pointer;
}
.address-wrap {
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 100%;
}
.address {
  flex-grow: 1;
}
.amount {
  width: 120px;
  margin-left: 8px;
  .eth-input {
    padding: 0 8px;
  }
}
.remove {
  margin-left: 8px;
  cursor: pointer;
}
.option {
  display: flex;
  flex-direction: row;
  margin-top: 12px;
  input {
    cursor: pointer;
  }
  label {
    cursor: pointer;
    padding-left: 6px;
    margin-top: 2px;
  }
}
.content-wrap .duplicates {
  @mixin text-medium 14px;
  align-items: center;
  margin-top: 20px;
  border: 1px solid #ccc;
  width: 100%;
  padding: 8px 12px;
}
.duplicate {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 6px 0;
  color: $red;
}
.add-duplicates {
  max-width: 340px;
}
.button.merge-button {
  background-color: rgba($red, 0.8);
  width: 80px;
  margin-top: 12px;
  justify-content: center;
  &:hover {
    background-color: $red;
  }
}
</style>
