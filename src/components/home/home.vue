<template>
<el-container>
    <el-header>
        <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt="无法显示图片" /></div>

        <h3>电商后台管理系统</h3>
        <el-button type="info" @click="handleSignout()">
            <span class="el-button-info">退出</span>
        </el-button>
    </el-header>
    <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
            <div class="toggle-button" @click="togleCollapse">|||</div>
            <!-- 侧边栏导航 el-menu -->
            <el-menu :router="true" :unique-opened="true">
                <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                    </template>
                    <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
                        <i class="el-icon-s-grid"></i>
                        <span>{{item2.authName}}</span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            menus: [],
            isCollapse: false
        }
    },
    // beforeCreate(){
    //   // 获取token
    //   const token = localStorage.getItem('token');

    //   if (!token){
    //     // token没有 -> 转到登陆页面
    //     this.$router.push({name:"login"});
    //   }
    //   // if token有 -> 继续渲染组件
    // },
    created() {
        this.getMenus()
    },
    methods: {
        // 获取导航数据
        async getMenus() {
            const res = await this.$http.get(`menus`);
            this.menus = res.data.data
        },
        handleSignout() {
            // 1. 清楚token
            sessionStorage.clear();
            // 2. 提示
            this.$message.success('退出成功');
            // 3. 来到login组件
            this.$router.push({
                name: 'login'
            })
        },
        // 菜单的折叠与展开
        togleCollapse() {
            this.isCollapse = !this.isCollapse
        }
    }

};
</script>

<style>
.el-container {
    height: 100%;
}

.el-header {
    background-color: #373f41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
}

.el-header>div {
    display: flex;
    align-items: center;
}

.el-header>div img {
    height: 60px;
}

.el-header .el-button {
    /* display: inline-block; */
    cursor: pointer;
    border: 1px solid #DCDFE6;
    color: #606266;
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
}

.el-header .el-button .el-button-info {
    color: #fff;
}

.el-aside {
    background-color: #333744;
}

.el-aside .el-menu {
    border: none;
}

.el-main {
    background-color: #eaedf1;
}

.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>
