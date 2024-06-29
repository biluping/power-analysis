<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue';
import { EChartsType } from 'echarts';
import { queryDateRangeData, queryHouseInfo, queryOneDayData } from './utils/http';
import dayjs from 'dayjs';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';

const chart = ref(null);
const powerChart = ref<EChartsType>()
const totalUsed = ref<string>()
const surplusDay = ref<number>()
const restElectricity = ref<string>()
const option = reactive<any>({
  grid: {
    top: '10px',
    left: '2%',
    right: '7%',
    bottom: '0%',
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    },
    backgroundColor: "#fff"
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLine: {
      lineStyle: {
        color: '#000',
        width: 2,//这里是为了突出显示加上的
      }
    },
    axisPointer: {
      lineStyle: {
        color: 'red'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#ff5252', // 设置横向网格线的颜色
        type: 'dashed' // 设置横向网格线的线条类型，可以是 'solid', 'dashed', 'dotted'
      }
    },
    axisPointer: {
      lineStyle: {
        color: 'red'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#000',
        width: 2,//这里是为了突出显示加上的
      }
    },
  },
  series: [
    {
      name: 'Electricity',
      type: 'line',
      smooth: true,
      data: [],
      lineStyle: {
        // 设置线条上点的颜色（和图例的颜色）
        normal: {
          color: '#FD7272',
        },
      },
      itemStyle: {
        // 设置线条上点的颜色（和图例的颜色）
        normal: {
          color: '#FD7272',
        },
      }
    }
  ]
})

function updateHouseInfo() {
  queryHouseInfo().then(resp => {
    console.log(resp)
    surplusDay.value = resp.data.data.records[0].surplusDay
    restElectricity.value = resp.data.data.records[0].meterAddForms[0].residualElectricity
  })
}

function loadData(startDate: string, endDate?: string) {
  let respPromise = null
  if (endDate) {
    respPromise = queryDateRangeData(startDate, endDate)
  } else {
    respPromise = queryOneDayData(startDate)
  }
  respPromise.then(resp => {
    // 进行累加操作，使图表每小时用电量转成总用电量趋势，看起来更加直观
    const usedList = resp.data.data.usedList.map(parseFloat)
    for (let i = 1; i < usedList.length; i++) {
      usedList[i] = usedList[i - 1] + usedList[i]
    }
    option.series[0].data = usedList
    option.xAxis.data = resp.data.data.dateList
    totalUsed.value = resp.data.data.totalUsed
    powerChart.value?.setOption(option)
  })

  updateHouseInfo()

}

let timerId: number
onMounted(() => {
  loadData(dayjs().format('YYYY-MM-DD'))
  timerId = setInterval(() => {
    updateHouseInfo()
  }, 120000)
});

onBeforeUnmount(() => {
  powerChart.value?.dispose()
  clearInterval(timerId)
})


const currentTab = ref<string>('one')
const dateRange = ref<string[]>([dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')])
const currentDate = ref<string>(dayjs().format('YYYY-MM-DD'))

function tabChange(name: string) {
  powerChart.value?.dispose()
  powerChart.value = echarts.init(chart.value)
  currentTab.value = name
  if (name === 'one') {
    currentDate.value = dayjs().format('YYYY-MM-DD')
    loadData(currentDate.value)
  } else if (name === 'seven') {
    dateRange.value[0] = dayjs().add(-1, 'week').format('YYYY-MM-DD')
    dateRange.value[1] = dayjs().format('YYYY-MM-DD')
    loadData(dateRange.value[0], dateRange.value[1])
  } else if (name === 'month') {
    dateRange.value[0] = dayjs().startOf('month').format('YYYY-MM-DD')
    dateRange.value[1] = dayjs().format('YYYY-MM-DD')
    loadData(dateRange.value[0], dateRange.value[1])
  }
}

function dateConfirm(date: string) {
  currentDate.value = date
  loadData(currentDate.value)
}

function dateRangeConfirm(range: string[]) {
  dateRange.value = range
  loadData(dateRange.value[0], dateRange.value[1])
}

const isShowCharts = ref(false)
function switchShowCharts() {
  isShowCharts.value = !isShowCharts.value
  if (isShowCharts.value) {
    if (!powerChart.value) {
      powerChart.value = echarts.init(chart.value)
    }
  }
  tabChange('one')
  if (!isShowCharts.value) {
    appWindow.setSize(new LogicalSize(500, 40));
  } else {
    appWindow.setSize(new LogicalSize(500, 350));
  }
}

</script>

<template>
  <div>
    <header class="header-info">
      <div class="rest-electricity head-box no-select" data-tauri-drag-region>
        剩余电量: {{ restElectricity }} 度
      </div>

      <div class="total-used head-box no-select" @click="switchShowCharts">
        总用电量: {{ totalUsed }} 度
      </div>

      <div class="surplus-day head-box no-select" data-tauri-drag-region>
        剩余租期: {{ surplusDay }} 天
      </div>
    </header>

    <body v-show="isShowCharts">
      <nav>
        <div class="tab">
          <n-button size="tiny" class="tab-btn" :color="currentTab === 'one' ? '#10ac84' : '#95afc0'"
            @click="tabChange('one')">1天</n-button>
          <n-button size="tiny" class="tab-btn" :color="currentTab === 'seven' ? '#10ac84' : '#95afc0'"
            @click="tabChange('seven')">7天</n-button>
          <n-button size="tiny" class="tab-btn" :color="currentTab === 'month' ? '#10ac84' : '#95afc0'"
            @click="tabChange('month')">本月</n-button>
        </div>
        <div class="date-picker-div">
          <n-date-picker class="date-picker" size="tiny" v-if="currentTab === 'one'" type="date"
            :formatted-value="currentDate" :on-update:formatted-value="dateConfirm" />
          <n-date-picker class="date-picker" size="tiny" v-else type="daterange" :formatted-value="dateRange"
            :on-update:formatted-value="dateRangeConfirm" />
        </div>
      </nav>

      <div ref="chart" :style="{ width: '500px', height: '250px' }">
      </div>
    </body>
  </div>
</template>

<style scoped>
.no-select {
  user-select: none;
  /* 标准属性 */
  -webkit-user-select: none;
  /* 兼容 Safari */
  -moz-user-select: none;
  /* 兼容 Firefox */
  -ms-user-select: none;
  /* 兼容 Internet Explorer/Edge */
}

header {
  width: 500px;
  display: flex;
  justify-content: space-between;
}

.head-box {
  width: 150px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 12px;
}

.total-used {
  background-color: #badc58;
  cursor: pointer;
}

.rest-electricity {
  background-color: #ffbe76;
  cursor: grab;
}

.surplus-day {
  background-color: #ff7979;
  cursor: grab;
}

nav {
  display: flex;
  margin: 10px 0;
}

.tab {
  display: flex;
  width: 200px;
  justify-content: space-between;

  margin-right: 10px;
}

.tab-btn {
  width: 60px;
}

.date-picker {
  width: 270px;
}
</style>
