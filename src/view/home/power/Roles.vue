<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 按钮 -->
      <el-button
        type="primary"
        @click="addRulesClick"
      >
        添加角色
      </el-button>
      <!-- 列表 -->
      <el-table
        :data="rolesList"
        border
        style="width: 100%"
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['baBottom',i1 === 0 ? 'baTop' : '','venter'] "
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限渲染 -->
              <el-col :span="5">
                <el-tag
                  @close="handleClose(scope.row,item1.id)"
                  closable
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二、三级权限渲染 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'baTop','venter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限渲染 -->
                  <el-col :span="6">
                    <el-tag
                      @close="handleClose(scope.row,item2.id)"
                      closable
                      type="success"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限渲染 -->
                  <el-col :span="18">
                    <el-tag
                      @close="handleClose(scope.row,item3.id)"
                      closable
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                {{scope.row}}
            </pre> -->
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
        >
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="330"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRule(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="disRightsDialogVisibleClick(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeAddRole"
    >
      <el-form
        :model="addRules"
        :rules="addRulesRules"
        ref="addFRulesRef"
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="addRules.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="addRules.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRole"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        :model="editList"
        :rules="addRulesRules"
        ref="editRuleForm"
        label-width="80px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input v-model="editList.roleName"></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input v-model="editList.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editConfirmClick"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="disRightsDialogVisible"
      width="30%"
      @close="closeRightsDialogVisible"
    >
      <el-tree
        :data="treeRightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="elTreeRights"
      ></el-tree>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="disRightsDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [], // 列表数据
      addDialogVisible: false, // 添加角色对话框状态
      //   添加角色表单数据
      addRules: {
        roleName: "",
        roleDesc: "",
      },
      //   添加角色表单验证规则
      addRulesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 6 到 30 个字符",
            trigger: "blur",
          },
        ],
      },
      editDialogVisible: false, // 修改对话框状态
      editList: {
        roleName: "",
        roleDesc: "",
      },
      disRightsDialogVisible: false, // 分配权限对话框状态
      treeRightsList: [], // 树形权限数据列表
      treeProps: {
        children: "children",
        label: "authName",
      }, // 树形结构的数据对象
      defKeys: [], // 默认勾选的子节点值数组
      roleId: '', // 当前即将分配的角色权限id
    };
  },
  created() {
    this.getrulesList();
  },
  methods: {
    // 获取列表数据
    getrulesList() {
      this.$http.get("roles").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg);
        }
        this.rolesList = res.data.data;
        console.log(this.rolesList);
      });
    },
    // 添加角色
    addRulesClick() {
      this.addDialogVisible = true;
    },
    // 确认添加角色
    addRole() {
      this.$refs.addFRulesRef.validate((val) => {
        if (!val) return this.$message.error("请填写完整用户信息");
        this.$http.post("roles", this.addRules).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg);
          }
          this.$message.success(res.data.meta.msg);
          this.addDialogVisible = false;
          this.getrulesList();
        });
      });
    },
    // 添加对话框关闭重置
    closeAddRole() {
      this.$refs.addFRulesRef.resetFields();
    },
    // 编辑角色
    editRule(id) {
      this.$http.get(`roles/${id}`).then((res) => {
        console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg);
        }
        this.$message.success(res.data.meta.msg);
        this.editList = res.data.data;
        console.log(this.editList);
      });
      this.editDialogVisible = true;
    },
    // 编辑对话框关闭重置
    editClose() {
      this.$refs.editRuleForm.resetFields();
    },
    // 确定编辑成功
    editConfirmClick() {
      this.$refs.editRuleForm.validate((val) => {
        if (!val) return this.$message.error("请填写完整用户信息");
        this.$http
          .put("roles/" + this.editList.roleId, this.editList)
          .then((res) => {
            console.log(res);
            if (res.data.meta.status != 200) {
              return this.$message.error(res.data.meta.msg);
            }
            this.getrulesList();
            this.$message.success("修改成功");
            this.editDialogVisible = false;
          });
      });
    },
    // 删除角色
    deleteRole(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`roles/${id}`).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getrulesList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除权限小标签
    handleClose(roleId, rightId) {
      this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(roleId);
          // console.log(rightId);
          this.$http
            .delete(`roles/${roleId.id}/rights/${rightId}`)
            .then((res) => {
              console.log(res);
              if (res.data.meta.status !== 200)
                return this.$message.error("删除权限失败");
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //无需再重新加载所有权限
              //只需要对现有的角色权限进行更新即可
              roleId.children = res.data.data;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配权限方法
    disRightsDialogVisibleClick(role) {
      this.roleId = role.id;
      this.$http.get("rights/tree").then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取权限数据失败");
        this.treeRightsList = res.data.data;
        // 调用递归
        this.getListKeys(role, this.defKeys);
        this.disRightsDialogVisible = true;
      });
    },
    // 默认展开的子节点获取
    //该函数会获取到当前角色的所有三级权限id并添加到defKeys中
    //如果当前节点不包含children属性，则表示node为三级权限
    getListKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      // 递归调用
      node.children.forEach((item) => {
        this.getListKeys(item, arr);
      });
    },
    // 关闭权限对话框时清空
    closeRightsDialogVisible() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    allotRights(){
      const keys = [
        ...this.$refs.elTreeRights.getCheckedKeys(),
        ...this.$refs.elTreeRights.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      // console.log(idStr);
      this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) return this.$message.error('更新权限失败');
        this.$message.success(res.data.meta.msg)
        this.getrulesList()
        this.disRightsDialogVisible = false
      })
    }
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin: 10px;
}
.baTop {
  border-top: 1px solid #ccc;
}
.baBottom {
  border-bottom: 1px solid #ccc;
}
.venter {
  display: flex;
  align-items: center;
}
</style>