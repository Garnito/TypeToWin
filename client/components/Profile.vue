<template>
    <div>
        <h2>Mon profil</h2>
        <div v-if="isLogged()">
        <p>Vous êtes actuellement sur le compte de {{ logPseudo }}</p>
        <input v-model="friendEmail" placeholder="Adresse email d'un ami">
        <button @click="addFriend(logId, friendEmail)">Ajouter un ami</button>
        <h2>Liste d'ami :</h2>
        <p> {{ friendList }} </p>
        <button @click="delog()">Quitter ce profil</button>
        </div>
        <p v-else>Vous n'êtes pas identifié</p>
    </div>
</template>

<script>
module.exports = {
    props: {
        logId: { type: Number, default: 0 },
        logPseudo: {type: String, default: ""},
        friendList: {type: Array, default: []}
    },
    data () {
        return {
            friendEmail: "",
        }
    },
    async mounted() {
    },
    methods: {
        isLogged() {
            return this.logId != 0
        },
        addFriend(logId, friendEmail){
            this.$emit('add-friend', logId, friendEmail)
        },
        delog(){
            this.$emit('delog')
            location.reload(true)
        }
    }
}
</script>