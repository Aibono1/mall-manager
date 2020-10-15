<template>
<el-card>
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <el-table height="450" :data="list" style="width: 100%">

        <el-table-column type="index" label="#" widht="40"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" widht="180"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="order_pay" label="是否付款" width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.order_pay==='0'">已付款</span>
                <span type="danger" v-if="scope.order_pay==='1'">未付款</span>
            </template>
        </el-table-column>

        <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
        <el-table-column label="下单时间" width="90">
            <template slot-scope="scope">
                {{scope.row.create_time | fmtdate}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" circle size="mini" plain @click="showEditdia(scope.row)"></el-button>
                <el-button type="danger" icon="el-icon-delete" circle size="mini" plain @click="showDelefirm(scope.row)"></el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="省市区" label-width="120px">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="详细地址" label-width="120px">
                <el-cascader clearable :options="catlist" v-model="form.address" autocomplete="off"></el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="addCate()">确定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
import catlist from './city_data.js'
export default {
    data() {
        return {
            list: [],
            dialogFormVisible: false,
            form: {
                address: ""
            },
            // 级联选择器要用的数据
            catlist: [],
            // 级联选择器选中的数据
            selectedOptions: []
        };
    },
    created() {
        this.getData()
    },
    methods: {
        async getData() {
            const res = await this.$http.get(`orders?pagenum=1&pagesize=10`);
            this.list = res.data.data.goods;
        },
        showEditdia() {
            this.catlist = catlist;
            this.dialogFormVisible = true;
        }
    }
}
</script>

<style>

</style>
