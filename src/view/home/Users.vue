<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <div style="margin:10px 0 25px 0">

        <el-row :gutter="20">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="listData.query"
              clearable
              @clear="queryList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="queryList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              @click="addDialogVisible = true"
            >添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <!-- 列表框 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          label="#"
          type="index"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
        >
        </el-table-column>
        <el-table-column
          prop="mg_state"
          label="状态"
        >
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="statusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogVisibleClick(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteClick(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setDiaLogVisible(scope.row)"
              ></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listData.pagenum"
          :page-sizes="[1,2,4]"
          :page-size="listData.pagesize"
          background=""
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item
          label="用户姓名"
          prop="username"
        >
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          type="email"
        >
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="mobile"
        >
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addUser"
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
        :rules="addFormRules"
        ref="editRuleForm"
        label-width="80px"
      >
        <el-form-item label="用户名">
          <el-input
            v-model="editList.username"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input v-model="editList.email"></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input v-model="editList.mobile"></el-input>
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
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="roleDialogVisible"
      width="50%"
    >
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色：<el-select
            v-model="selectRoleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="roleDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义的校验规则
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的手机号码"));
    };
    return {
      tableData: [], // 列表数据
      total: 0, // 列表总数
      //   列表数据参数
      listData: {
        query: "",
        // 当前页
        pagenum: 1,
        // 当前页数
        pagesize: 2,
      },
      addDialogVisible: false, // 添加对话框状态
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, // 添加用户表单数据
      //   对话框表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 30 个字符",
            trigger: "blur",
          },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible: false, // 修改用户对话框状态
      editList: {}, // 添加用户列表
      roleDialogVisible: false, // 分配角色对话框状态
      userInfo: {}, // 正在被操作角色用户信息
      userList: [], // 保存所有用户角色数组
      selectRoleId: "", // select绑定用户角色id
    };
  },
  created() {
    this.queryList();
  },
  methods: {
    //   用户获取
    queryList() {
      this.$http.get("users", { params: this.listData }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取用户列表失败！");
        }
        this.tableData = res.data.data.users;
        console.log(this.tableData);
        this.total = res.data.data.total;
      });
    },
    //   分页
    // 监听pageSize变化
    handleSizeChange(val) {
      //   console.log(`每页 ${val} 条`);
      this.listData.pagesize = val;
      this.queryList();
    },
    handleCurrentChange(val) {
      //   console.log(`当前页: ${val}`);
      this.listData.pagenum = val;
      this.queryList();
    },
    // 用户状态修改
    statusChange(userInfo) {
      this.$http
        .put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error(res.data.meta.msg);
          }
          return this.$message.success(res.data.meta.msg);
        });
    },
    // 关闭对话框清空内容
    closeDialog() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击确定添加用户
    addUser() {
      this.$refs.addFormRef.validate((obj) => {
        // console.log(obj);
        if (!obj) return this.$message.error("请填写完整用户信息");
        this.$http.post("users", this.addForm).then((res) => {
          // console.log(res);
          // console.log(res.data.meta.status);
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg);
          }
          this.$message.success(res.data.meta.msg);
          this.addDialogVisible = false;
          this.queryList();
        });
      });
    },
    // 点击弹出修改对话框
    editDialogVisibleClick(id) {
      // console.log(id);
      this.$http.get(`users/${id}`).then((res) => {
        console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message.error(res.data.meta.msg);
        }
        this.$message.success(res.data.meta.msg);
        this.editList = res.data.data;
        // console.log(this.editList);
      });
      this.editDialogVisible = true;
    },
    // 关闭修改对话框重置
    editClose() {
      this.$refs.editRuleForm.resetFields();
    },
    editConfirmClick() {
      // 校验表单
      this.$refs.editRuleForm.validate((val) => {
        // console.log(val);
        if (!val) return this.$message.error("请填写正确的表单");
        this.$http
          .put("users/" + this.editList.id, {
            mobile: this.editList.mobile,
            email: this.editList.email,
          })
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status != 200) {
              return this.$message.error(res.data.meta.msg);
            }
            this.queryList();
            this.$message.success(res.data.meta.msg);
          });
        this.editDialogVisible = false;
      });
    },
    // 删除按钮
    deleteClick(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`users/${id}`).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error("删除不成功");
            }
            this.queryList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配角色点击事件
    setDiaLogVisible(userInfo) {
      this.userInfo = userInfo;
      // console.log(userInfo);
      this.$http.get("roles").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("获取用户角色失败");
        this.userList = res.data.data;
      });
      this.roleDialogVisible = true;
    },
    // 确认修改角色
    confirmRole() {
      if (!this.selectRoleId) return this.$message.error("请先选择角色");
      this.$http
        .put(`users/${this.userInfo.id}/role`, { rid: this.selectRoleId })
        .then((res) => {
          if (res.data.meta.status !== 200)
            return this.$message.error("修改用户角色失败");
          this.$message.success("修改用户角色成功");
          this.queryList();
          this.roleDialogVisible = false;
        });
    },
  },
};
</script>

<style scoped>
.block {
  margin-top: 15px;
}
</style>