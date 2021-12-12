<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 1250px;height:600px;"></div>
      <!-- <div id="main2" style="width: 650px;height:300px;margin-top:50px"></div> -->
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    const myCharts = echarts.init(document.getElementById('main'))
    this.$http.get('reports/type/1').then(res => {
      const result = _.merge(res.data.data, this.options)
      myCharts.setOption(result)
    })

    // 以下实例模仿数据纯手写
    const Echarts = echarts.init(document.getElementById('main2'))
    Echarts.setOption({
      // 头部标签
      title: {
        text: '用户来源'
      },
      // 顶部line线分类
      legend: {
        data: ['华东', '华南', '华北', '西部', '其他']
      },
      // 图示区调整
      grid: {
        bottom: '3%',
        left: '3%',
        right: '4%',
        containLabel: true // 防止标签溢出
      },
      // 鼠标移动至grid区域时提示
      tooltip: {
        trigger: 'axis', // 开启提示
        // 坐标轴指示器配置
        axisPointer: {
          type: 'cross', // 十字准星指示器
          label: {
            backgroundColor: '#E9EEF3' // 鼠标所处坐标轴的刻度文本颜色
          }
        }
      },
      xAxis: {
        type: 'category', // 类目轴
        data: ['2017-12-27',
          '2017-12-28',
          '2017-12-29',
          '2017-12-30',
          '2017-12-31',
          '2018-1-1'],
        boundaryGap: false // 紧靠y轴开始
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '华东',
          stack: '总量',
          type: 'line',
          // line线下方区域填充样式，为normal：{}时使用默认颜色填充下方
          areaStyle: {
            normal: {}
          },
          data: [2999, 3111, 4100, 3565, 3528, 6000]
        },
        {
          name: '华南',
          stack: '总量',
          type: 'line',
          areaStyle: {
            normal: {}
          },
          data: [5090, 2500, 3400, 6000, 6400, 7800]
        },
        {
          name: '华北',
          stack: '总量',
          type: 'line',
          areaStyle: {
            normal: {}
          },
          data: [6888, 4000, 8010, 12321, 13928, 12984]
        },
        {
          name: '西部',
          stack: '总量',
          type: 'line',
          areaStyle: {
            normal: {}
          },
          data: [9991, 4130, 7777, 12903, 13098, 14028]
        },
        {
          name: '其他',
          stack: '总量',
          type: 'line',
          areaStyle: {
            normal: {}
          },
          data: [100000, 5800, 10241, 14821, 15982, 14091]
        }
      ]
    })
  }
}
</script>

<style lang="less" scoped>

</style>
