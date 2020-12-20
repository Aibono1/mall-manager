<template>
<div>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <el-card>
    <div id="main" class="echarts"></div>
</el-card>
</div>
</template>

<script>
var echarts = require("echarts");
export default {
    data() {
        return {}
    },
    mounted() {
        this.useEchart()
    },
    methods: {
        async useEchart() {
            // init
            var mycharts = echarts.init(document.getElementById("main"));

            // 获取数据
            const res = await this.$http.get(`reports/type/1`)
            let option2 = res.data.data

            // option
            let option1 = {
                title: {
                    text: '用户来源'
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
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
            }
            let option = {
                ...option1,
                ...option2
            }
            // setOption
            mycharts.setOption(option);
        }
    }
}
</script>

<style>
.echarts {
    width: 600px;
    height: 400px;
}
</style>
