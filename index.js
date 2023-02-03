
const url = "https://vue3-course-api.hexschool.io";
const api_path = "yu_";

const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            username: "",
            password: "",
        }
    },
    methods: {
        checkLoginData() {
            const checkResult = validate({
                username: this.username,
                password: this.password
            }, {
                username: {
                    presence: {
                        allowEmpty: false,
                        message: "^此為必填欄位"
                    }
                },
                password: {
                    presence: {
                        allowEmpty: false,
                        message: "^此為必填欄位"
                    }
                }
            });
            console.log(checkResult)
            return typeof (checkResult) === "undefined" ? true : false;
        },
        userLogin() {
            const checkDataResult = this.checkLoginData();
            if (checkDataResult) {
                axios.post(`${url}/v2/admin/signin`, {
                    username: this.username,
                    password: this.password
                })
                    .then((res) => {
                        console.log(res);
                        const { token, expired } = res.data;
                        document.cookie = `hexschool=${token};expires=${expired}`;
                        location.href = "./products.html"
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }

        }

    }
})

app.mount("#app");
