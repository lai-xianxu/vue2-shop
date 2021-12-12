<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 头部面包屑 -->
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        :closable="false"
        show-icon
        center
      >
      </el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 侧边标签页区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane
            label="基本信息"
            name="0"
          >
            <el-form-item
              label="商品名称"
              prop="goods_name"
            >
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item
              label="商品价格"
              prop="goods_price"
            >
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item
              label="商品重量"
              prop="goods_weight"
            >
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item
              label="商品数量"
              prop="goods_number"
            >
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item
              label="商品分类"
              prop="goods_cat"
            >
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cartList"
                :props="cartProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品参数"
            name="1"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="it"
                  v-for="(it,i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品属性"
            name="2"
          >
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane
            label="商品图片"
            name="3"
          >
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button
                size="small"
                type="primary"
              >点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane
            label="商品内容"
            name="4"
          >
            <!-- 富文本编辑框 -->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button
              type="primary"
              @click="addShops"
              style="margin-top:15px"
            >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <img
        :src="imgURL"
        alt=""
        style="width:100%"
      >
    </el-dialog>
  </div>
</template>

<script>
//官方推荐将lodash导入为_
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: 0, // 步骤条索引
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], // 商品分类数组
        pics: [],
        goods_introduce: "",
        attrs: [],
      }, // 表单绑定数据
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          /* {
            min: 1,
            max: 15,
            message: "长度在 0 到 15 个字符",
            trigger: "blur",
          }, */
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          /* {
            min: 1,
            max: 15,
            message: "长度在 0 到 15 个字符",
            trigger: "blur",
          }, */
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          /*  {
            min: 1,
            max: 15,
            message: "长度在 0 到 15 个字符",
            trigger: "blur",
          }, */
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          /* {
            min: 1,
            max: 15,
            message: "长度在 0 到 15 个字符",
            trigger: "blur",
          }, */
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
          /* {
            min: 3,
            max: 15,
            message: "长度在 3 到 25 个字符",
            trigger: "blur",
          }, */
        ],
      }, // 表单验证规则
      cartList: [], // 级联选择器数据
      cartProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
      }, // 级联选择器
      manyTableData: [], // 动态参数数据
      onlyTableData: [], // 静态属性数据
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload", // 上传图片地址
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      }, // 上传图片头部
      imgURL: "", // 图片预览地址
      dialogVisible: false, // 图片预览对话框状态
    };
  },
  created() {
    this.getCartList();
  },
  methods: {
    //   商品分类数组
    getCartList() {
      this.$http.get("categories").then((res) => {
        console.log(res);
        this.cartList = res.data.data;
      });
    },
    // 级联选择框改变事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    // 标签页进入下一级的条件
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    // 侧边某一个tab被选中时触发
    tabClicked() {
      // 商品参数栏目
      if (this.activeIndex === "1") {
        this.$http
          .get(`categories/${this.isCartId}/attributes`, {
            params: { sel: "many" },
          })
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            }
            //将attr_vals字符串转换为数组
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            // console.log(res);
            this.manyTableData = res.data.data;
          });
      }
      // 商品属性栏目
      else if (this.activeIndex === "2") {
        this.$http
          .get(`categories/${this.isCartId}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return this.$message.error(res.data.meta.msg);
            }
            this.onlyTableData = res.data.data;
          });
      }
    },
    // 上传图片配置项
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file);
      this.imgURL = file.response.data.url;
      this.dialogVisible = true;
    },
    // 处理图片移除效果
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    // 上传图片成功
    handleSuccess(response) {
      // console.log(response);
      const picName = {
        pic: response.data.tmp_path,
      };
      this.addForm.pics.push(picName);
      console.log(this.addForm);
    },
    // 确认添加商品
    addShops() {
      this.$refs.addFormRef.validate((val) => {
        // 如果bol不为true则直接退出方法
        if (!val) return this.$message.error("请填写必要的表单项!");
        //将addForm进行深拷贝，避免goods_cat数组转换字符串之后导致级联选择器报错
        const form = _.cloneDeep(this.addForm);
        //将goods_cat从数组转换为"1,2,3"字符串形式
        form.goods_cat = form.goods_cat.join(",");
        //将manyTableData（动态参数）处理添加到attrs
        this.manyTableData.forEach((item) => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          });
        });
        //将onlyTableData（静态属性）处理添加到attrs
        this.onlyTableData.forEach((item) => {
          form.attrs.push({
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          });
        });
        console.log(form);
        //发送请求完成商品的添加,商品名称必须是唯一的
        this.$http.post("goods", form).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error("添加商品失败");
          }
          this.$message.success("添加商品成功");
          //编程式导航跳转到商品列表
        });
        this.$router.push("/goods");
      });
    },
  },
  computed: {
    //   分类ID
    isCartId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
::v-deep .el-step__title {
  font-size: 13px;
}
::v-deep .el-cascader-panel {
  height: 400px;
}
.el-checkbox {
  margin: 5px 10px 0 0 !important;
}
</style>