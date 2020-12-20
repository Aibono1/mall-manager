<template>
<div>
    <!-- 1. 面包屑 -->
    <my-bread level1="用户管理" level2="用户列表"></my-bread>
    <el-card class="box-card">
        <!-- 2. 搜索 -->
        <el-row class="searchRow" :gutter="20">
            <el-col :span='6'>
                <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query">
                    <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="success" @click="showAddUserDia">添加用户</el-button>
            </el-col>
        </el-row>
        <!-- 3. 表格 -->
        <el-table stripe border :data="userlist">
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="80">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="mobile" label="电话">
            </el-table-column>
            <el-table-column label="创建日期">
                <template slot-scope="scope">
                    {{scope.row.create_time | fmtDate}}
                </template>
            </el-table-column>
            <el-table-column label="用户状态">
                <template slot-scope="scope">
                    <el-switch @change="changeMgState(scope.row)" v-model="scope.row.mg_state">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle @click="showEditUserDia(scope.row)"></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle @click="showDeleUserBoxDia(scope.row.id)"></el-button>
                    <el-button size="mini" plain type="success" icon="el-icon-check" circle @click="showSetRoleDia(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 4. 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[2, 4, 6, 8]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 对话框 -->
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
            <el-form :model="form">
                <el-form-item label="用户名" label-width="100px">
                    <el-input v-model="form.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" label-width="100px">
                    <el-input v-model="form.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" label-width="100px">
                    <el-input v-model="form.email" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="电话" label-width="100px">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
                <el-button type="primary" @click="AddUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 编辑用户的对话框 -->
        <el-dialog title="编辑用户" :visible.sync="editDialogVisible" @close="editDialogClosed()">
            <el-form :model="form" ref="editUserFormRef" label-width="100px">
                <el-form-item label="用户名">
                    <el-input disabled v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="电话">
                    <el-input v-model="form.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 分配角色的对话框 -->
        <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol" @close="setRoleDialogClosed">
            <el-form :model="userInfo">
                <el-form-item label="用户名" label-width="100px">
                    {{userInfo.username}}
                </el-form-item>
                <el-form-item label="角色" label-width="100px">
                    <!-- 
                    如果select绑定的数据的值和option的value值一样，
                    就会显示该option的label值
                 -->
                    <el-select v-model="selectRoleId">
                        <el-option label="请选择" :value="-1"></el-option>
                        <el-option :label="item.roleName" :value="item.id" v-for="(item,i) in roles" :key="i"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
                <el-button type="primary" @click="setRole()">确 定</el-button>
            </div>
        </el-dialog>

    </el-card>
</div>
</template>

<script>
export default {
    data() {
        return {
            // 获取用户列表的请求的查询参数
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 每页显示的数据数量
                pagesize: 2
            },
            // 表格绑定的数据
            userlist: [],
            // 分页相关数据
            total: -1,
            // 添加对话框的属性
            dialogFormVisibleAdd: false,
            editDialogVisible: false,
            dialogFormVisibleRol: false,
            // 添加用户的表单数据
            form: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 所有角色的数据列表
            userInfo: {},
            // 保存所有角色数据
            roles: [],
            // 已选中的角色Id值
            selectRoleId: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表的请求
        async getUserList() {
            const {
                data: res
            } = await this.$http.get('users', {
                params: this.queryInfo
            })
            if (res.meta.status === 200) {
                // 1. 给表格数据赋值
                this.userlist = res.data.users
                // 2. 给total赋值
                this.total = res.data.total
            } else {
                // 提示
                this.$message.warning(res.meta.msg)
            }
        },
        // 分配角色 - 打开对话框
        async showSetRoleDia(user) {
            this.userInfo = user
            // 获取所有的角色
            const {
                data: res
            } = await this.$http.get(`roles`)
            if (res.meta.status !== 200) {
                return this.$message.error('获取角色列表失败！')
            }
            this.roles = res.data
            // 获取当前用户的角色id
            // const res = await this.$http.get(`users/${user.id}`)
            // this.selectRoleId = res.data.data.rid
            this.dialogFormVisibleRol = true
        },
        // 分配角色 - 修改并发送请求
        async setRole() {
            if (!this.selectRoleId) {
                return this.$message.error('请选择要分配的角色')
            }
            const {
                data: res
            } = await this.$http.put(`users/${this.userInfo.id}`, {
                rid: this.selectRoleId
            })
            if (res.meta.status !== 200) {
                return this.$message.error('更新用户角色失败！')
            }
            this.$message.success('更新角色成功')
            this.getUserList()
            this.dialogFormVisibleRol = false
        },
        setRoleDialogClosed() {
            this.selectRoleId = ''
            this.userInfo = {}
        },
        // 修改状态
        async changeMgState(user) {
            // 发送请求
            const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        },
        // 编辑用户 - 显示对话框
        showEditUserDia(user) {
            // 获取用户数据
            this.form = user
            this.editDialogVisible = true
        },
        editDialogClosed() {
            this.$refs.editUserFormRef.resetFields()
            this.getUserList()

        },
        // 编辑用户 - 发送请求
        async editUser() {
            const {
                data: res
            } = await this.$http.put(`users/${this.form.id}`, this.form)
            if (res.meta.status !== 200) {
                this.$message.error('更新用户信息失败!')
            }
            // 1. 关闭对话框并更新视图
            this.editDialogVisible = false
            this.$message.success('更新用户信息成功！')
            this.getUserList()
        },
        // 删除用户 - 打开消息盒子
        async showDeleUserBoxDia(userId) {
            const confirmDelete = await this.$confirm('是否确定删除用户?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 点击确定 返回值为：confirm
            // 点击取消 返回值为：cancel
            if (confirmDelete !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const {
                data: res
            } = await this.$http.delete(`users/${userId}`)
            if (res.meta.status === 200) {
                this.queryInfo.pagenum = 1
                this.$message.success('删除用户成功！')
                this.getUserList()
            } else {
                this.$message.error('删除用户失败')
            }
        },
        // 添加用户
        showAddUserDia() {
            this.form = {}
            this.dialogFormVisibleAdd = true
        },
        // 添加用户 - 发送请求
        async AddUser() {
            const {
                data: res
            } = await this.$http.post(`users`, this.form)
            if (res.meta.status === 201) {
                // 提示成功
                this.$message.success(res.meta.msg)
                this.getUserList()
                // 清空对话框
                this.form = {}
                this.dialogFormVisibleAdd = false;
            } else {
                this.$message.warning(res.meta.msg)
            }

        },
        // 分页相关的方法
        handleSizeChange(val) {
            this.queryInfo.pagesize = val
            this.queryInfo.pagenum = 1
            this.getUserList()
        },
        handleCurrentChange(val) {
            this.queryInfo.pagenum = val
            this.getUserList()
        }
    }
}
</script>

<style>
</style>
