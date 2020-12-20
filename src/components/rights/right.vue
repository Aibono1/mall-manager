<template>
<div>
    <!-- 1. 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <el-card>
        <!-- 2. 表格 -->
        <el-table height="400px" :data="rightlist" border stripe>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column prop="authName" label="权限名称"> </el-table-column>
            <el-table-column prop="path" label="路径"> </el-table-column>
            <el-table-column label="层级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level==='0'">一级</span>
                    <span v-if="scope.row.level==='1'">二级</span>
                    <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            rightlist: [],
        };
    },
    created() {
        this.getRightlist()
    },
    methods: {
        async getRightlist() {
            const {
                data: res
            } = await this.$http.get(`rights/list`)
            if (res.meta.status !== 200) {
                return this.$message.error('获取权限列表失败')
            }
            this.rightlist = res.data
        }
    }
};
</script>

<style>
</style>
