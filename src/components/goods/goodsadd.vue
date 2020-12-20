<template>
<div>
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>

    <el-card>
        <!-- 提示 el-alert -->
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

        <!-- 步骤条 el-steps -->
        <el-steps :space="200" :active="active" finish-status="success" simple align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>

        <!-- Tab栏 -->
        <el-form label-position="top" label-width="100px" :model="form">
            <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left">
                <el-tab-pane name="1" label="基本信息">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <!-- 级联选择器 -->
                        <el-cascader clearable v-model="selectedOptions" :props="defaultProp" :options="options"></el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="2" label="商品参数">
                    <!-- 显示该三级分类的商品参数 -->
                    <el-form-item :label="item1.attr_name" :key="i" v-for="(item1,i) in arrDyparams">
                        <!-- 复选框组 -->
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox border :label="item2" :key="i" v-for="(item2,i) in item1.attr_vals"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="3" label="商品属性">
                    <el-form-item :label="item.attr_name" v-for="item in arrStaticparams" :key="item.attr_id">
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="4" label="商品图片">
                    <el-form-item>
                        <!-- baseUrl 是给axios发送的请求 -->
                        <el-upload action="http://localhost:8888/api/private/v1/upload" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane name="5" label="商品内容">
                    <el-form-item>
                        <!-- 富文本 -->
                        <quill-editor v-model="form.goods_introduce"></quill-editor>
                        <!-- 表单元素 -->
                        <el-button class="btnAdd" type="primary" @click="addGoods()">添加商品</el-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: "1",
            // 添加商品的表单数据
            // this.$http.post(url,this.form)
            form: {
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                goods_introduce: "",
                pics: [],
                attrs: []
            },
            // 级联选择器绑定的数据
            options: [],
            selectedOptions: [1, 3, 6],
            defaultProp: {
                label: "cat_name",
                value: "cat_id",
                children: "children"
            },
            // 动态参数的数据数组
            arrDyparams: [],
            // 静态参数的数据数组
            arrStaticparams: [],
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        }
    },
    created() {
        this.getGoodCate()
    },
    methods: {
        // 添加商品 - 发送请求
        async addGoods() {
            // 在发请求之前，处理this.form中的未处理数据
            // goods_cats
            this.form.goods_cat = this.selectedOptions.join(',')

            // pics 在上传和移除图片时 进行赋值和删除 [].findIndex

            // attrs [{attr_id:?,attr_value:?}]
            // 动态参数数组+静态参数数组   需要遍历+取值+放在一个新数组中
            let arr1 = this.arrDyparams.map((item) => {
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
            })
            let arr2 = this.arrStaticparams.map((item) => {
                return {
                    arr_id: item.attr_id,
                    attr_value: item.attr_vals
                }
            })
            this.form.attrs = [...arr1, ...arr2]

            const res = await this.$http.post(`goods`, this.form)
            // 回到商品列表
            this.$router.push({
                name: "goods"
            })
        },
        // 图片上传时的相关方法
        // file形参里面是当前操作的图片的相关信息（图片名/图片路径）
        handlePreview(file) {},
        handleRemove(file) {
            // 从this.form.pics移除当前x掉的图片
            // 先获取当前操作的图片的索引
            // findIndex()遍历数组 把符合条件的元素的索引进行返回
            let index = this.form.pics.findIndex((item) => {
                return item.pic === file.response.data.tmp_path
            })
            this.form.pics.splice(index, 1)
        },
        // 监听图片上传成功事件
        handleSuccess(file) {
            // 给this.form.pics
            this.form.pics.push({
                pic: file.data.tmp_path
            })
        },
        // 点击不同的tab时触发的方法
        async tabChange() {
            var vm = this;
            // 如果点击的是第二个tab 首先要判断三级分类是否有值
            if (this.active === "2") {
                if (this.selectedOptions.length !== 3) {
                    vm.$message.warning('请先选择商品的三级分类')
                    return;
                }
                // 获取数据
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                this.arrDyparams = res.data.data;
                // this.arrDyparams这个数组中的每个对象中的.attr_vals字符串转成数组 这样才好用v-for去遍历
                this.arrDyparams.forEach(item => {
                    // 并不是所有的三级分类都有动态参数  空字符串变成数组遍历会报错
                    item.attr_vals =
                        item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',');
                })
            } else if (this.active === "3") {
                if (this.selectedOptions.length !== 3) {
                    vm.$message.warning('请先选择商品的三级分类')
                    return;
                }
                // 获取静态参数的数据
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                this.arrStaticparams = res.data.data;
            }
        },
        // 获取三级分类的信息
        async getGoodCate() {
            const res = await this.$http.get(`categories?type=3`)
            this.options = res.data.data;
        }
    }
}
</script>

<style>
.el-checkbox {
    margin: 0 8px 0 0 !important;
}
.btnAdd{
  margin-top: 15px
}
.ql-editor {
    min-height: 300px;
}
</style>
