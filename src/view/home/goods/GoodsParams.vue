<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 警示区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 商品分类区域 -->
      <el-row class="row-bot">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品分类的级联选择器 -->
          <el-cascader
            v-model="CateValue"
            :options="cateList"
            :props="CateProps"
            @change="CateHandleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页区域 -->
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isAddDisabled"
            @click="ClickDynamicDialogVisible"
          >添加参数</el-button>
          <!-- 动态参数表格列表 -->
          <el-table
            :data="manyTableData"
            style="width: 100%"
          >
            <el-table-column
              type="expand"
              width="80"
            >
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closeSmallTag(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加小标签按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editDynamicDialogVisible(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteDynamic(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            size="mini"
            :disabled="isAddDisabled"
            @click="ClickDynamicDialogVisible"
          >添加属性</el-button>
          <!-- 静态参数表格列表 -->
          <el-table
            :data="onlyTableData"
            style="width: 100%"
          >
            <el-table-column
              type="expand"
              width="80"
            >
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="closeSmallTag(i,scope.row)"
                >{{item}}</el-tag>
                <!-- 添加小标签按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              width="80"
            >
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="`添加${this.titleText}`"
      :visible.sync="dynamicDialogVisible"
      width="50%"
      @close="closeDynamicDialogVisible"
    >
      <el-form
        :model="dynamicRuleForm"
        :rules="dynamicRules"
        ref="dynamicRuleFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="this.titleText"
          prop="attr_name"
        >
          <el-input v-model="dynamicRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dynamicDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="queryDynamicDialogVisible"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="closeeditDialogVisible"
    >
      <el-form
        :model="editRuleForm"
        :rules="editRules"
        ref="editRuleFormRef"
        label-width="100px"
      >
        <el-form-item
          :label="this.titleText"
          prop="attr_name"
        >
          <el-input v-model="editRuleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="queryeditDialogVisible"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [], // 商品分类列表
      CateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }, // 商品级联选择器属性
      CateValue: [], // 用户在级联下拉菜单中选中的分类id
      activeName: 'many', // 默认的标签页
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态参数数据
      dynamicDialogVisible: false, // 动态添加对话框状态
      dynamicRuleForm: {
        attr_name: ''
      }, // 动态添加表单双向数组
      dynamicRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }, // 动态添加表单验证规则
      editDialogVisible: false, // 动态添加对话框状态
      editRuleForm: {
        attr_name: ''
      }, // 动态添加表单双向数组
      editRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 1,
            max: 15,
            message: '长度在 3 到 15 个字符',
            trigger: 'blur'
          }
        ]
      }, // 动态添加表单验证规则
      inputVisible: false, // 添加标签页显示隐藏
      inputValue: '' // 添加输入框数据
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表数据
    getCateList() {
      this.$http.get('categories').then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) { return this.$message.error(res.data.meta.msg) }
        this.cateList = res.data.data
      })
    },
    // 商品分类级联选择器点击触发
    CateHandleChange() {
      // console.log(this.CateValue);
      this.getParamsData()
    },
    // 标签页点击事件
    handleClick() {
      //   console.log(this.activeName);
      this.getParamsData()
    },
    // 获取动态参数列表
    getParamsData() {
      if (this.CateValue.length !== 3) {
        this.cateList = []
        return this.$message.error('请选择至三级分类')
      }
      console.log(this.CateValue)
      this.$http
        .get(`categories/${this.isCartId}/attributes`, {
          params: { sel: this.activeName }
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          //   console.log(res);
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          //   console.log(res);
          if (this.activeName === 'many') {
            this.manyTableData = res.data.data
            console.log(this.manyTableData)
          } else {
            this.onlyTableData = res.data.data
            console.log(this.onlyTableData)
          }
        })
    },
    // 打开动态添加对话框
    ClickDynamicDialogVisible() {
      this.dynamicDialogVisible = true
    },
    // 关闭动态添加对话框时重置表单
    closeDynamicDialogVisible() {
      this.$refs.dynamicRuleFormRef.resetFields()
    },
    // 确认动态添加对话框
    queryDynamicDialogVisible() {
      this.$refs.dynamicRuleFormRef.validate((val) => {
        if (!val) return this.$message.error('请先完成表单')
      })
      this.$http
        .post(`categories/${this.isCartId}/attributes`, {
          attr_name: this.dynamicRuleForm.attr_name,
          attr_sel: this.activeName
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
          this.getParamsData()
          this.dynamicDialogVisible = false
        })
    },
    // 编辑列表
    editDynamicDialogVisible(attrId) {
      this.$http
        .get(`categories/${this.isCartId}/attributes/${attrId}`, {
          attr_sel: this.activeName
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.editRuleForm = res.data.data
          this.editDialogVisible = true
        })
    },
    // 确认修改对话框
    queryeditDialogVisible() {
      this.$refs.editRuleFormRef.validate((val) => {
        if (!val) return this.$message.error('请先填写完整表单')
      })
      this.$http
        .put(
          `categories/${this.isCartId}/attributes/${this.editRuleForm.attr_id}`,
          {
            attr_name: this.editRuleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        .then((res) => {
          // console.log(res);
          this.editRuleForm.attr_name = res.data.data.attr_name
          this.getParamsData()
          this.editDialogVisible = false
        })
    },
    // 关闭修改对话框时重置表单
    closeeditDialogVisible() {
      this.$refs.editRuleFormRef.resetFields()
    },
    // 删除列表对应参数
    deleteDynamic(id) {
      this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(`categories/${this.isCartId}/attributes/${id}`)
            .then((res) => {
              this.$message.success('删除参数成功')
              this.getParamsData()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加小标签事件
    showInput(row) {
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则将输入的值添加
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.setSaveAttrvals()
    },
    // 删除小标签
    closeSmallTag(i, row) {
      row.attr_vals.splice(i, 1)
      this.setSaveAttrvals()
      // 并发起异步请求保存到数据库中
      this.$http
        .put(`categories/${this.isCartId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        })
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
        })
    },
    // 封装的动态编辑小标签函数
    setSaveAttrvals(row) {
    }
  },
  computed: {
    //   控制添加按钮是否禁用
    isAddDisabled() {
      if (this.CateValue.length !== 3) return true
      return false
    },
    // 动态获取分类ID
    isCartId() {
      if (this.CateValue.length === 3) {
        return this.CateValue[this.CateValue.length - 1]
      }
      return null
    },
    // 动态展示添加对话框title
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.row-bot {
  margin: 20px 0;
}
::v-deep .el-scrollbar__wrap {
  height: 400px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
