const Home = window.httpVueLoader('./components/Home.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')
const Profile = window.httpVueLoader('./components/Profile.vue')

const routes = [
    { path: '/', component: Home },
    { path: '/register', component: Register},
    { path: '/login', component: Login},
    { path: '/profile', component: Profile}
]

const router = new VueRouter({
    routes
})

var app = new Vue({
    router,
    el: '#app',
    data: {
      log: 0
    },
    async mounted () {
        const res_log = await axios.get('/api/profile')
        this.log = res_log.data
    },
    methods: {
      async createAccount(newEmail, newPassword) {
        await axios.post('/api/register', {email: newEmail, password: newPassword})
      },
      async logIntoAccount(email, password) {
        const res = await axios.post('/api/login', {email: email, password: password})
        this.log = res.data
        console.log(this.log)
      },
    }
  })
  