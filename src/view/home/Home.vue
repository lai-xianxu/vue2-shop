<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img
          src="@/assets/heima.png"
          alt=""
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="exit"
      >退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边区域 -->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="aside-lider" @click="asideLideer">|||</div>
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4b8fc8"
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
          router
          :default-active="active"
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + inx.path" v-for="inx in item.children" :key="inx.id"
            @click="activeItem('/' + inx.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{inx.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',

  data() {
    return {
      menuList: [], // 左侧菜单数据
      iconList: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }, // 左侧菜单图标
      iscollapse: false, // 默认左侧菜单折叠
      active: '' // 二级菜单点击取得值
    }
  },
  created() {
    this.getListMenus()
    this.active = window.sessionStorage.getItem('active')
  },
  methods: {
    // 退出
    exit() {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 左侧菜单权限 运用await简化promise
    async getListMenus() {
      await this.$http.get('menus').then(res => {
        if (res.data.meta.status !== 200) return this.$message.console.error(res.meta.msg)
        // console.log(res);
        this.menuList = res.data.data
        // console.log(this.menuList[0].authName);
      })
    },
    // 点击折叠
    asideLideer() {
      this.iscollapse = !this.iscollapse
    },
    // 二级菜单点击高亮
    activeItem(active) {
      // 获取到的path值保存到本地
      window.sessionStorage.setItem('active', active)
      this.active = active
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0px;
  background-color: #363d40;
  > div {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 18px;
    span {
      padding-left: 15px;
    }
  }
}
.el-aside {
  background-color: #313743;
  .aside-lider {
    background-color: #475163;
    color: #fff;
    font-size: 14px;
    line-height: 28px;
    text-align: center;
    letter-spacing: 0.5px;
    cursor: pointer;
  }
}
.el-main {
  background-color: #e9edf1;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border-right: none;
}
</style>
