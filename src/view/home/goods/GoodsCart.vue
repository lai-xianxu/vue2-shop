<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 按钮 -->
      <el-button
        type="primary"
        style="margin-bottom:20px"
        @click="addDdialogVisibleClick"
      >
        添加分类
      </el-button>
      <!-- 列表内容 -->
      <tree-table
        :data="tableList"
        :columns="columns"
        show-index
        index-text="#"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template
          slot="isOk"
          slot-scope="scope"
        >
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i
            class="el-icon-error"
            v-else
            style="color:red"
          ></i>
        </template>
        <!-- 排序 -->
        <template
          slot="order"
          slot-scope="scope"
        >
          <el-tag v-if="scope.row.cat_level=== 0">一级</el-tag>
          <el-tag
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >二级</el-tag>
          <el-tag
            type="warning"
            v-else
          >三级</el-tag>
        </template>
        <!-- 操作 -->
        <template
          slot="operation"
          slot-scope=""
        >
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
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum "
        :page-sizes="[3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top:20px;"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDdialogVisible"
      width="50%"
      @close="dialogClose"
    >
      <el-form
        :model="addRuleForm"
        :rules="addRules"
        ref="addRuleFormRef"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input v-model="addRuleForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="addDdialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCate"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableList: [], // 列表数组
      total: 0, // 列表数据总数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      }, // 列表查询获取参数
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template', // 表示：将当前列定义为模板列
          template: 'isOk' // 表示当前这一列模板名称
        },
        {
          label: '排序',
          type: 'template', // 表示：将当前列定义为模板列
          template: 'order' // 表示当前这一列模板名称
        },
        {
          label: '操作',
          type: 'template', // 表示：将当前列定义为模板列
          template: 'operation' // 表示当前这一列模板名称
        }
      ], // 列表头及数据
      addDdialogVisible: false, // 添加分类对话框状态
      addRuleForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      }, // 添加对话框双向绑定数据
      addRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }, // 添加分类表单验证规则
      parentCateList: [], // 父类所有数组
      selectedKeys: [], // 绑定用户选择的分类值
      // 配置级联菜单中数据如何展示
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      }
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取列表数据
    getCateList() {
      this.$http.get('categories', { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) { return this.$message.console.error('获取数据列表失败') }
        this.tableList = res.data.data.result
        this.total = res.data.data.total
      })
    },
    // 分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 添加分类
    addDdialogVisibleClick() {
      this.getParentCateList()
      this.addDdialogVisible = true
    },
    // 获取父级分类数据
    getParentCateList() {
      this.$http.get('categories', { params: { type: 2 } }).then((res) => {
        // console.log(res);
        this.parentCateList = res.data.data
        // console.log(this.parentCateList);
      })
    },
    // 级联菜单变化
    parentCateChange() {
      // console.log(this.selectedKeys);
      // 如果用户选择了父级分类
      if (this.selectedKeys.length > 0) {
        // 则将数组中的最后一项设置为父级分类
        this.addRuleForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1]
        // level也要跟着发生变化
        this.addRuleForm.cat_level = this.selectedKeys.length
      } else {
        this.addRuleForm.cat_pid = 0
        this.addRuleForm.cat_level = 0
      }
    },
    // 添加对话框关闭重置表单
    dialogClose() {
      this.$refs.addRuleFormRef.resetFields()
      this.selectedKeys = []
      this.addRuleForm.cat_pid = 0
      this.addRuleForm.cat_level = 0
    },
    // 确认添加分类按钮
    addCate() {
      // console.log(this.selectedKeys);
      this.$refs.addRuleFormRef.validate((val) => {
        if (!val) return
        this.$http.post('categories', this.addRuleForm).then(res => {
          // console.log(res);
          if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
          this.$message.success('创建成功')
          this.getCateList()
          this.addDdialogVisible = false
        })
      })
    }
  }
}
</script>

<style  scoped>
.el-cascader {
  width: 100%;
  height: 100px;
}
/* .el-popper >>> .el-cascader-panel {
  height: 300px;
} */
/* ::v-deep.el-cascader-panel{
  display: flex;
  border-radius: 4px;
  font-size: 14px;
  // width: 500px;
  // height: 600px;
} */
/* .el-scrollbar ::v-deep .el-cascader-menu__wrap {
  height: 200px;
} */
.el-cascader >>> .el-cascader-menu__wrap {
  height: 200px;
}
.el-cascader-el >>> .el-cascader-menu__wrap {
  margin-bottom: -250px;
  margin-right: -34px;
  border: 10px solid red;
}
</style>
