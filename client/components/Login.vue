<template>
    <div>
        <h2>S'identifier</h2>
        <input v-model="email" placeholder="Email">
        <input v-model="password" placeholder="Mot de passe">
        <button @click="logIntoAccount(email, password)">Valider</button>
    </div> 
</template>

<script>
module.exports = {
    props: {
    },
    data () {
        return {
            email: "",
            password: "",
        }
    },
    async mounted() {
    },
    methods: {
        logIntoAccount(email, password) {
            this.$emit('log-into-account', email, password)
            location.reload(true)
        }
    }
}
</script>