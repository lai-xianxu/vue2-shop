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
      <el-table
        :data="rightsList"
        border
        style="width: 100%"
      >
        <el-table-column
          type="index"
          label="#"
        >
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
        >
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径"
        >
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级"
        >
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [], // 权限列表数据
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    //   权限列表数据获取
    getRightsList() {
      this.$http.get("rights/list").then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg);
        }
        this.rightsList = res.data.data;
        // console.log(this.rightsList);
      });
    },
  },
};
</script>

<style lang="less" scoped>
</style>