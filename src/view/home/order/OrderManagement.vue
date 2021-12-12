<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 顶部输入框 -->
    <el-card class="box-card">
      <el-input
        placeholder="请输入内容"
        v-model="searchInput"
        class="input-with-select"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 表格区域 -->
      <el-table :data="tableData" style="width: 100%; margin-top: 15px" border>
        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否支付">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0"
              >未支付</el-tag
            >
            <el-tag v-else type="success">已支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改地址"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editAddress(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流状态"
              placement="top"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                circle
                @click="showProgressBox(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editAddressDialogVisible"
      width="800px"
      @close="closeEditAddress"
    >
      <el-form
        :model="editRuleForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editRuleForm.address1"
            :options="catydata"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editRuleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdiltAdress"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流对话框 -->
    <el-dialog
      title="查看物流"
      :visible.sync="CKDialogVisible"
      width="800px"
    >
      <span slot="footer" class="dialog-footer">
        <el-button @click="CKDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CKDialogVisible"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import catydata from './catydata.js'
export default {
  data() {
    return {
      catydata,
      searchInput: '',
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      total: 10,
      editAddressDialogVisible: false,
      editRuleForm: {
        address1: '',
        address2: ''
      },
      editRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      orderId: '',
      CKDialogVisible: false
    }
  },
  created() {
    this.getOrderDataList()
  },
  methods: {
    // 获取订单数据列表
    getOrderDataList() {
      const params = {
        pagenum: this.currentPage,
        pagesize: this.pageSize
      }
      this.$http.get('orders', { params: params }).then((res) => {
        this.tableData = res.data.data.goods
        this.total = res.data.data.total
      })
    },
    // 分页当前页条数
    handleSizeChange(e) {
      this.pageSize = e
      this.getOrderDataList()
    },
    // 分页当前所在页
    handleCurrentChange(e) {
      this.currentPage = e
      this.getOrderDataList()
    },
    // 修改地址
    editAddress(row) {
      this.orderId = row.order_id
      this.editAddressDialogVisible = true
    },
    // 添加地址级联选择器改变事件
    handleChange(value) {},
    // 确认修改地址
    confirmEdiltAdress() {
      this.$refs.editRuleForm.validate((val) => {
        if (val) {
          this.editAddressDialogVisible = false
        }
      })
    },
    // 关闭修改地址对话框
    closeEditAddress() {
      this.$refs.editRuleForm.resetFields()
    },
    // 查看物流事件
    CKDialogVisibleClick(row) {
      // this.$http.get('/kuaidi/1106975712662').then(res => {
      //   console.log(res)
      // })
      this.CKDialogVisible = true
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      // this.progressInfo = res.data
      // this.progressDialogVisible = true
      //   console.log(this.progressInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.el-input {
  width: 500px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader {
  width: 500px;
}
</style>
