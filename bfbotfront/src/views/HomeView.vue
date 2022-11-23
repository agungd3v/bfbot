<script setup>
import { ref, watchEffect } from 'vue'
import socket from '@/plugins/wss'

let tempData = ref([])
socket.on('aggregate', data => {
  if (tempData.value.length >= 20) {
    tempData.value.pop()
    tempData.value = [data, ...tempData.value]
  } else {
    tempData.value = [data, ...tempData.value]
  }
})
</script>

<template>
  <div v-if="tempData.length > 0">
    <table style="width:100%">
      <tbody>
        <tr v-for="(tmp, i) in tempData" :key="i">
          <td style="width:100%">{{ tmp.pair }}</td>
          <td style="width:100%">{{ tmp.isBuyer }}</td>
          <td style="width:100%">{{ tmp.qty }}</td>
          <td style="width:100%">{{ tmp.markPrice }}</td>
          <td style="width:100%">{{ tmp.time }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
