<template>
<div class="login_wrap">
    <!-- 头像 -->
    <div class="login_profile">
        <img src="../../assets/logo.png" alt="admin" />
    </div>
    <!-- 登陆表单 -->
    <div class="login_box">
        <el-form 
        ref="loginFormRef" 
        class="login_form" 
        label-position="left" 
        label-width="80px" 
        :model="formData">
            <el-form-item required label="用户名" prop="username">
                <el-input v-model="formData.username" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <el-form-item required label="密码" prop="password">
                <el-input v-model="formData.password" prefix-icon="el-icon-lock"></el-input>
            </el-form-item>
            <el-button @click.prevent="handleLogin()" class="login_btn" type="primary">登陆</el-button>
            <el-button @click.prevent="resetLoginForm()" class="reset_btn" type="info">重置</el-button>
        </el-form>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            formData: {
                username: "admin",
                password: "123456"
            },
        };
    },
    methods: {
        // 表单重置按钮
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields()
        },
        async handleLogin() {
            // 希望让异步操作的代码 看起来像同步代码 ES7 async + await
            const {
                data: res
            } = await this.$http.post("login", this.formData)
            if (res.meta.status === 200) {
                // 登陆成功后的token，保存到页面关闭时就会销毁数据的sessionStorage中；localStorage用于持久化的保存
                // localStorage.setItem("token", res.data.token)
                window.sessionStorage.setItem("token", res.data.token)
                this.$message.success(res.meta.msg)
                // 通过编程式导航跳转到后台主页，路由地址为:/home
                this.$router.push({
                    name: "home"
                })
            } else {
                this.$message.warning(res.meta.msg)
            }
        }
    }
}
</script>

<style>
.login_wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login_profile {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -130%);
    background-color: #fff;
    z-index: 2;
}

.login_profile img {
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
}

.login_box {
    background-color: white;
    height: 350px;
}

.login_box .login_form {
    position: relative;
    top: 70px;
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
}

.login_box .login_btn {
    position: absolute;
    left: 115px;
    width: 25%;
}

.login_box .reset_btn {
    position: absolute;
    left: 230px;
    width: 25%;
}
</style>
