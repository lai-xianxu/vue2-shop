<template>
  <div class="login-content">
    <div class="login-box">
      <!-- 登录头像 -->
      <div class="login-logo">
        <img
          src="@/assets/jks.png"
          alt=""
        >
      </div>
      <!-- 登录表单 -->
      <el-form
        :model="loginFrom"
        label-width="0"
        class="login-from"
        :rules="loginFromRules"
        ref="loginFromRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginFrom.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginFrom.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login-btn">
          <el-button type="primary" @click="login" :plain="true">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录数据
      loginFrom: {
        username: "admin",
        password: "123456"
      },
      // 表单验证规则
      loginFromRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 重置按钮
    reset(){
      console.log(this);
      this.$refs.loginFromRef.resetFields();
    },
    // 登录预验证
    login(){
      this.$refs.loginFromRef.validate((bol) => {
        // console.log(bol);
        // 如果bol为false就不发起请求
        if(!bol) return;
        this.$http.post('login',this.loginFrom).then(res => {
          // console.log(res);
          // console.log(res.status);
          if(res.data.meta.status != 200) return this.$message.error('登录失败');
          this.$message.success('登录成功');
          // 登录成功保存token，用于身份验证
          window.sessionStorage.setItem('token',res.data.data.token);
          // 跳转到home页面
          this.$router.push('/home');
        })
      });
      /* this.$refs.loginFromRef.validate(async vaild => {
        if(!vaild) return;
        const { data:res } =await this.$http.post('login',this.loginFrom);
        if(res.meta.status != 200) return console.log('登录失败');
        console.log('登录成功');
      }) */
    }
  }
};
</script>

<style lang="less" scoped>
.login-content {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;
  .login-box {
    position: relative;
    position: absolute;
    top: 50%;
    left: 50%;
    color:#2b4b6b;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    .login-logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;
      padding: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login-from {
  margin-top: 110px;
  padding: 0 20px;
}
.login-btn {
  display: flex;
  justify-content: flex-end;
}
</style>