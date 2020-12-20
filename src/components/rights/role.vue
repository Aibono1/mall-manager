<template>
  <div>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <el-card>
      <el-row class="addRoleBtn">
        <el-col>
          <el-button type="info" @click="AddRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="rolelist" border stripe>
        <el-table-column type="expand" width="150">
          <template slot-scope="scope">
            <el-row v-for="(item1, i) in scope.row.children" :key="i">
              <el-col :span="4">
                <el-tag
                  @close="deleRight(scope.row, item1.id)"
                  closable
                  type="success"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row v-for="(item2, i) in item1.children" :key="i">
                  <el-col :span="4">
                    <el-tag
                      @close="deleRight(scope.row, item2.id)"
                      closable
                      type="info"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag
                      v-for="(item3, i) in item2.children"
                      :key="i"
                      @close="deleRight(scope.row, item3.id)"
                      closable
                      type="warning"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- 无权限的提示 -->
            <span v-if="scope.row.children.length === 0">未分配权限</span>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="150"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              type="primary"
              icon="el-icon-edit"
              circle
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="danger"
              icon="el-icon-delete"
              circle
              @click="removeRoleById(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              plain
              type="success"
              icon="el-icon-check"
              circle
              @click="showSetRightDia(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改权限的对话框 -->
      <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
        <!-- 树形结构 -->
        <el-tree
          ref="tree"
          :data="treelist"
          show-checkbox
          node-key="id"
          :default-expanded-keys="arrexpand"
          :default-checked-keys="arrcheck"
          :props="defaultProps"
        >
        </el-tree>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
          <el-button type="primary" @click="setRoleRight">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible">
        <el-form :model="addRoleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible">
        <el-form :model="editRoleForm">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoles">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      AddRoleDialogVisible: false,
      editRoleDialogVisible: false,
      addRoleForm: {},
      editRoleForm: {},
      // 树形结构的数据
      treelist: [],
      defaultProps: {
        label: "authName",
        children: "children",
      },
      arrexpand: [],
      arrcheck: [],
      currRoleId: -1,
    };
  },
  created() {
    this.getRolelist()
  },
  methods: {
    // 修改权限-发送请求
    async setRoleRight() {
      // roleId 当前要修改权限的角色id
      // rids 树形节点中 所有全选和半选的label的id
      // 获取全选的id的数组arr1   getCheckedKeys
      let arr1 = this.$refs.tree.getCheckedKeys()
      // 获取半选的id的数组arr2   getHalfCheckedKeys
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      // arr1.concat(arr2)
      // arr = arr1 + arr2
      let arr = [...arr1, ...arr2]

      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(","),
      })
      // 更新视图
      this.getRolelist()
      // 关闭对话框
      this.dialogFormVisibleRight = false
    },
    // 修改/分配 权限 - 打开对话框
    async showSetRightDia(role) {
      // 给currRoleId赋值
      this.currRoleId = role.id

      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`)
      this.treelist = res.data.data

      var arrtemp1 = []
      this.treelist.forEach((item1) => {
        arrtemp1.push(item1.id)
        item1.children.forEach((item2) => {
          arrtemp1.push(item2.id)
          item2.children.forEach((item3) => {
            arrtemp1.push(item3.id)
          })
        })
      })
      this.arrexpand = arrtemp1

      // 获取当前角色role的权限id
      let arrtemp2 = []
      role.children.forEach((item1) => {
        // arrtemp2.push(item1.id)
        item1.children.forEach((item2) => {
          // arrtemp2.push(item2.id)
          item2.children.forEach((item3) => {
            arrtemp2.push(item3.id)
          })
        })
      })
      this.arrcheck = arrtemp2

      this.dialogFormVisibleRight = true
    },
    async deleRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      // 删除成功，返回了200和该角色的剩余权限
      role.children = res.data.data
    },
    async getRolelist() {
      const res = await this.$http.get(`roles`)
      this.rolelist = res.data.data
    },
    // 添加角色
    async addRoles() {
      const { data: res } = await this.$http.post("roles", this.addRoleForm)
      if (res.meta.status !== 201) {
        return this.$message.error("添加角色失败！")
      }
      this.$message.success("添加角色成功！")
      this.AddRoleDialogVisible = false
      this.getRolelist()
    },
    // 编辑角色
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("roles/" + id)
      if (res.meta.status !== 200)
        return this.$message.error("查询角色信息失败！")
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    async editRoles() {
      const { data: res } = await this.$http.put(
        "roles/" + this.editRoleForm.roleId,
        {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc,
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色信息失败！")
      }
      // 隐藏编辑角色对话框
      this.editRoleDialogVisible = false
      this.$message.success("更新角色信息成功")
      this.getRolelist()
    },
    // 删除角色
    async removeRoleById(id) {
      const confimResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err)
      if (confimResult !== "confirm") {
        return this.$message.info("已取消删除")
      }
      const { data: res } = await this.$http.delete("roles/" + id)
      if (res.meta.status !== 200) return this.$message.error("删除角色失败！")
      this.$message.success("删除用户成功！")
      this.getRolelist()
    },
  },
};
</script>

<style>
el-tag {
  margin: 7px
}

.addRoleBtn {
  margin-top: 20px
}
</style>
