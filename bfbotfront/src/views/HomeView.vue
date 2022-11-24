<script setup>
import { ref, watchEffect } from 'vue'
import socket from '@/plugins/wss'

let aggregate = ref([])
socket.on('aggregate', data => {
  if (aggregate.value.length >= 10) {
    aggregate.value.pop()
    aggregate.value = [data, ...aggregate.value]
  } else {
    aggregate.value = [data, ...aggregate.value]
  }
})

let mark = ref(null)
socket.on('markprice', data => {
  if (data) mark.value = data
})

socket.on('balanceposition', data => {
  if (data) console.log(data)
})

const parseDate = (timestamp, time = true) => {
  const date = new Date(timestamp)
  const day = date.getDay()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const isDate = `${day < 10 ? '0'+ day : day}/${month < 10 ? '0'+ month : month}/${year}`
  const isTime = `${hours < 10 ? '0'+ hours : hours}:${minutes < 9 ? '0'+ minutes : minutes}:${seconds < 9 ? '0'+ seconds : seconds}`
  return `${isDate} ${time ? isTime : ''}`
}
</script>

<template>
  <div class="w-100 min-vh-100 p-3">
    <div class="position-absolute" v-if="mark" style="bottom:0.5rem;right:0.5rem">{{ parseDate(mark.time, false) }}</div>
    <div class="d-flex gap-2">
      <div v-if="mark">
        <div class="d-flex flex-column">
          <span class="fw-bold">{{ mark.pair }}</span>
          <span class="text-decoration-underline">{{ parseFloat(mark.markPrice).toFixed(2) }}</span>
        </div>
      </div>
      <div v-if="aggregate.length > 0" class="flex-grow-1">
        <table class="table table-borderless w-50">
          <tbody>
            <tr v-for="(tmp, i) in aggregate" :key="i">
              <td :class="tmp.isBuyer ? 'text-success' : 'text-danger'">
                <div class="text-sm fw-bold">{{ tmp.pair }}</div>
              </td>
              <td :class="tmp.isBuyer ? 'text-success' : 'text-danger'">
                <div class="text-sm">{{ tmp.qty }}</div>
              </td>
              <td :class="tmp.isBuyer ? 'text-success' : 'text-danger'">
                <div class="text-sm">{{ tmp.markPrice }}</div>
              </td>
              <td :class="tmp.isBuyer ? 'text-success' : 'text-danger'">
                <div class="float-end text-sm">
                  {{ parseDate(tmp.time) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style>
  .table>:not(caption)>*>* {
    padding-bottom: 0 !important;
    padding-top: 5px !important;
  }
</style>