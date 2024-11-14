<template>
  <div class="sender">
    <EthConnect :wallet="wallet" @connect="connectWallet('metamask')" />
    <h1 class="title">Bulk Sender</h1>
    <div class="subtitle">Ethereum ERC20 bulk transfers with no extra fees.</div>
    <Prepare v-if="state === 'prepare'" @next="state = 'sending'" />
    <Send v-else-if="state === 'sending'" @back="state = 'prepare'" />
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import EthConnect from './widgets/EthConnect.vue'
import { IWallet } from '../types'
import Footer from './Footer.vue'
import Prepare from './Prepare.vue'
import Send from './Send.vue'
import { useEth } from '../utils/use-eth'

type SendState = 'prepare' | 'sending'

const { reconnectWallet, connectWallet, getBalance, walletConnected, wallets } = useEth()

const wallet = ref<IWallet>()
const state = ref<SendState>('prepare')

watch(walletConnected, async (connected) => {
  const address = wallets.value[0]
  if (connected && address) {
    const balance = await getBalance(address)
    const noBalance = balance === null || balance === undefined

    wallet.value = {
      address,
      eth: noBalance ? '?' : (balance / BigInt(1e18)).toString(),
      tokens: [],
    }
  } else if (!connected) {
    wallet.value = undefined
  }
})

onMounted(() => {
  reconnectWallet('metamask')
})
</script>

<style lang="postcss">
@import '../css/global.postcss';

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.sender {
  background: $bg-dark;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: $font-title;
  max-width: 960px;
  padding: 32px 20px 0 20px;
  margin: 0 auto;
  text-align: center;
}
.title {
  margin-top: 48px;
}
.content-wrap {
  max-width: 480px;
  width: 100%;
  margin-top: 32px;
}
.section-title {
  @mixin title-semibold 14px;
}
.token-wrap {
  display: flex;
  width: 100%;
  align-items: flex-end;
}
.button {
  @mixin title-semibold 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  background-color: rgba($blue, 0.8);
  height: 42px;
  color: black;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 140px;
  &:hover {
    background-color: $blue;
  }
}
.actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.error {
  @mixin text-medium 15px;
  color: $red;
  margin: 16px 0;
  width: 100%;
  text-align: center;
}
.warning {
  @mixin text-medium 15px;
  color: $orange;
  margin: 16px 0;
  width: 100%;
  text-align: center;
}
.next {
  background-color: rgba($orange, 0.9);
  &:hover {
    background-color: $orange;
  }
}
</style>
