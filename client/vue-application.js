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
      logId: 0,
      logPseudo: "",
      friendList: []
    },
    async mounted () {
        const res_profile = await axios.get('/api/profile')
        this.logId = res_profile.data.logId
        this.logPseudo = res_profile.data.logPseudo
        this.friendList = res_profile.data.friendList
    },
    methods: {
      async createAccount(newPseudo, newEmail, newPassword) {
        await axios.post('/api/register', {pseudo: newPseudo, email: newEmail, password: newPassword})
      },
      async logIntoAccount(email, password) {
        const res = await axios.post('/api/login', {email: email, password: password})
        this.logId = res.data.logId
        this.logPseudo = res.data.logPseudo
      },
      async delog() {
        await axios.put('/api/profile')
      },
      async addFriend(logId, friendEmail) {
        await axios.post('/api/profile', {logId: logId, friendEmail: friendEmail})
      }
    }
  })
  