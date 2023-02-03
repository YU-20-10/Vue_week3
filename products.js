console.clear();

const url = "https://vue3-course-api.hexschool.io";
const apiPath = "yu_";
let productModal = "";
let deleteModal = "";

const { createApp } = Vue;

createApp({
    data() {
        return {
            products: [],
            tempProduct: {
                imagesUrl: [""]
            },
            isNew: false
        }
    },
    methods: {
        checkLoginStatus() {
            let token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${url}/api/user/check`)
                .then((res) => {
                    if (res.data?.success) {
                        console.log("登入驗證成功");
                    } else {
                        alert("請重新登入");
                        location.href = "./index.html"
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        getProducts() {
            axios.get(`${url}/v2/api/${apiPath}/admin/products/all`)
                .then((res) => {
                    this.products = res.data?.products;
                })
                .catch((err) => {
                    console.log(err);
                })
        },
        initModal() {
            productModal = new bootstrap.Modal('#productModal');
            deleteModal = new bootstrap.Modal('#delProductModal');
        },
        openModal(mode, data) {

            if (mode === "add") {
                productModal.show();
                this.isNew = true;
                this.tempProduct = {
                    imagesUrl: [""]
                }
            } else if (mode === "edit") {
                productModal.show();
                this.isNew = false;
                this.tempProduct = { ...data };
            } else if (mode === "delete") {
                deleteModal.show();
                this.tempProduct = { ...data };
            }
        },
        addAndEditProduct() {
            let apiUrl = ""
            let method = "";
            if (this.isNew) {
                apiUrl = `${url}/v2/api/${apiPath}/admin/product`
                method = "post";
            } else {
                apiUrl = `${url}/v2/api/${apiPath}/admin/product/${this.tempProduct?.id}`
                method = "put";
            }

            axios[method](apiUrl, { data: this.tempProduct })
                .then(res => {
                    if (!Array.isArray(this.tempProduct.imagesUrl)) {
                        tempProduct.imagesUrl = [""];
                    }
                    this.getProducts();
                })
                .catch(err => {
                    console.log(err);
                })

            productModal.hide()
        },
        deleteProduct() {
            const apiUrl = `${url}/v2/api/${apiPath}/admin/product/${this.tempProduct?.id}`;
            axios.delete(apiUrl)
                .then((res) => {
                    this.getProducts();
                })
                .catch((err) => {
                    console.log(err);
                })

            deleteModal.hide()
        }
    },
    mounted() {
        this.checkLoginStatus(),
            this.getProducts(),
            this.initModal()
    }
}).mount("#app");