<template>
  <div class="flex-col content-wrap">
    <div class="address-label section-title">Token Address</div>
    <div class="address-view">{{ batchOptions.tokenAddress }}</div>
    <TokenStatus class="send-status" />
    <div class="refresh-allowance" @click="refreshToken">Refresh Token</div>
    <div class="send-info">
      <div>
        Recipients: <span>{{ batchOptions.batchItems.length }}</span>
      </div>
      <div class="token-total">
        Total tokens: <span>{{ tokenTotal.toLocaleString() }}</span>
      </div>
      <div v-if="approved" class="approved">Approved ✔</div>
    </div>
    <div class="send-recipients">
      <div v-for="item in batchOptions.batchItems" class="send-recipient">
        <div class="send-address">{{ item.address }}</div>
        <div v-if="!batchOptions.isFixed">{{ item.amount }}</div>
      </div>
    </div>
    <div v-if="showSend && batchOptions.batchItems.length > 500" class="warning">
      If execution fails, try splitting into smaller batches.
    </div>
    <div v-if="txHash" class="tx-result">
      <div class="tx-hash">
        {{ txHash }}
      </div>
      <div class="explorer-link">
        <a
          v-if="chainData?.explorer"
          target="_blank"
          :href="`${chainData.explorer}/tx/${txHash}`"
        >
          Etherscan ↗
        </a>
      </div>
    </div>
    <div class="error">
      {{ error }}
    </div>
    <div v-if="showSend" class="tip-wrap">
      <div class="tip-text">Please consider a small tip to support development.</div>
      <div class="tip-input">
        <EthInput v-model="tip" placeholder="Tip" class="tip" />
        <div class="tip-eth">ETH</div>
      </div>
    </div>
    <div class="actions">
      <div v-if="txHash && loading" class="button back" @click="cancelPoll">Cancel</div>
      <div v-else class="button back" @click="emit('back')">Back</div>
      <EbsButton
        v-if="showSend"
        :animate="loading"
        text="Send"
        class="next"
        @click="send"
      />
      <EbsButton
        v-else-if="!txHash"
        :animate="loading"
        :disabled="approved === undefined"
        text="Approve"
        class="next"
        @click="approve"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { parseEther } from '@samatech/vue3-eth'
import TokenStatus from './widgets/TokenStatus.vue'
import {
  approveTokens,
  batchOptions,
  batchSend,
  chainData,
  ethToWei,
  tokenAllowance,
  tokenTotal,
  verifyToken,
} from '../utils'
import EbsButton from './widgets/EbsButton.vue'
import { useEth } from '../utils/use-eth'
import EthInput from './widgets/EthInput.vue'

const error = ref()
const txHash = ref()
const loading = ref(false)
const approved = ref()
const tip = ref('0.005')

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { pollTransaction, cancelPoll } = useEth()

const showSend = computed(() => {
  return approved.value && (!txHash.value || loading.value)
})

const approve = async () => {
  loading.value = true
  error.value = undefined
  try {
    const response = await approveTokens(tokenTotal.value.toString())
    if (response) {
      const complete = await pollTransaction(response.hash)
      if (complete) {
        approved.value = true
      } else {
        error.value = 'Failed to confirm transaction'
      }
    }
  } catch (e) {
    error.value = e
  }
  loading.value = false
}

const verifyAllowance = async () => {
  try {
    const allowance = await tokenAllowance()
    const totalWei = ethToWei(tokenTotal.value.toString())
    approved.value = allowance >= totalWei
  } catch (e) {
    error.value = 'Unable to verify token, make sure your wallet is connected.'
  }
}

const refreshToken = async () => {
  await verifyAllowance()
  await verifyToken()
}

const parseTip = () => {
  const tipStr = tip.value || '0'
  const tipEth = parseFloat(tipStr)
  if (isNaN(tipEth)) {
    error.value = 'Tip must be a number'
  }
  return parseEther(tipStr)
}

const send = async () => {
  error.value = undefined
  loading.value = true
  try {
    const tipWei = parseTip()
    if (tip === undefined) {
      return
    }
    const response = await batchSend(tipWei.toString())
    if (response) {
      txHash.value = response.hash
      const complete = await pollTransaction(response.hash)
      if (complete) {
        await refreshToken()
      }
    } else {
      error.value = 'Unknown error, please try again or create a Github issue.'
    }
  } catch (e) {
    console.log('Send fail:', e)
    error.value = 'Failed to send tokens, please try again.'
  }
  loading.value = false
}

onMounted(async () => {
  error.value = undefined
  await verifyAllowance()
})
</script>

<style lang="postcss">
@import '../css/global.postcss';

.back {
  background-color: $bg-grey;
}
.address-view {
  @mixin text-medium 14px;
  margin-top: 8px;
  color: $text-med;
}
.send-info {
  @mixin title-regular 15px;
  display: flex;
  margin: 12px 0 0;
  span {
    font-weight: bold;
  }
}
.approved {
  margin-left: 16px;
  color: $green;
}
.refresh-allowance {
  @mixin title-regular 15px;
  margin-top: 12px;
  color: $orange;
  text-decoration: underline;
  cursor: pointer;
  user-select: none;
}
.token-total {
  margin-left: 16px;
}

.send-status {
  margin-top: 12px;
}
.send-recipients {
  @mixin text-medium 14px;
  width: 100%;
  color: $text-med2;
  margin-top: 8px;
  max-height: 200px;
  min-height: 80px;
  overflow: auto;
  box-shadow: inset 0 0 0.5px 1px hsla(0, 0%, 100%, 0.175);
  padding: 6px 10px 0;
}
.send-recipient {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}
.tx-hash {
  @mixin title-regular 14px;
  color: $green;
  margin-top: 12px;
}
.explorer-link a {
  @mixin title-regular 14px;
  margin-top: 8px;
  text-decoration: underline;
}
.tip-wrap {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 0 12px;
}
.tip-text {
  @mixin title-semibold 13px;
}
.tip-input {
  margin-top: 6px;
  position: relative;
}
.tip input {
  width: 180px;
  padding-right: 40px;
}
.tip-eth {
  @mixin text-medium 13px;
  position: absolute;
  top: 13px;
  right: 10px;
  color: $text-med2;
}
</style>
