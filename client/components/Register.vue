<template>
    <div>
        <h2>Créer un compte</h2>
        <input v-model="newPseudo" placeholder="Pseudo">
        <input v-model="newEmail" placeholder="Email">
        <input v-model="newPassword" placeholder="Mot de passe">
        <button @click="createAccount(newPseudo, newEmail, newPassword)">Valider</button>
    </div> 
</template>

<script>
module.exports = {
    props: {
    },
    data () {
        return {
            newPseudo: "",
            newEmail: "",
            newPassword: ""
        }
    },
    async mounted() {
    },
    methods: {
        createAccount(newPseudo, newEmail, newPassword) {
            this.$emit('create-account', newPseudo, newEmail, newPassword)
        }
    }
}
</script>