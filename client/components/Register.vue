<template>
    <div>
        <h2>Créer un compte</h2>
        <input v-model="newEmail" placeholder="Email">
        <input v-model="newPassword" placeholder="Mot de passe">
        <button @click="createAccount(newEmail, newPassword)">Valider</button>
    </div> 
</template>

<script>
module.exports = {
    props: {
    },
    data () {
        return {
            newEmail: "",
            newPassword: ""
        }
    },
    async mounted() {
    },
    methods: {
        createAccount(newEmail, newPassword) {
            this.$emit('create-account', newEmail, newPassword)
        }
    }
}
</script>