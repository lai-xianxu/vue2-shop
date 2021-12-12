<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            @clear="getGoodsList"
            v-model="listInfo.query"
            @change="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <el-table
        :data="goodsList"
        style="width: 100%;margin-top:20px"
        border
      >
        <el-table-column
          type="index"
          width="70"
        >
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="110"
        >
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="80"
        >
        </el-table-column>
        <el-table-column
          prop="add_time"
          label="创建时间"
          width="140"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="goodsListHandleSizeChange"
        @current-change="goodsListHandleCurrentChange"
        :current-page="listInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="listInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="goodsTital"
        style="margin-top:20px"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      }, // 列表查询参数
      goodsList: [], // 商品列表数据
      goodsTital: 0 // 商品数据总数
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页商品列表查询
    getGoodsList() {
      this.$http.get('goods', { params: this.listInfo }).then((res) => {
        // console.log(res);
        this.goodsList = res.data.data.goods
        this.goodsTital = res.data.data.total
      })
    },
    // 分页
    goodsListHandleSizeChange(val) {
      this.listInfo.pagesize = val
      this.getGoodsList()
    },
    goodsListHandleCurrentChange(val) {
      this.listInfo.pagenum = val
      this.getGoodsList()
    },
    // 删除操作
    deleteGoods(row) {
      this.$confirm('此操作将永久删除该商品列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete(`goods/${row.goods_id}`).then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg)
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getGoodsList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 添加商品事件
    goAddGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style>
</style>
