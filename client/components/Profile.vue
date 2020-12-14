<template>
    <div>
        <h2>Mon profil</h2>
        <p v-if="isLogged()">Vous êtes actuellement sur le compte de {{ log }}</p>
        <p v-else>Vous n'êtes pas identifié</p>
        <button @click="debug()">Debug</button>
    </div>
</template>

<script>
module.exports = {
    props: {
        log: { type: Number, default: 0 }
    },
    async mounted() {

    },
    methods: {
        isLogged() {
            return this.log != 0
        },
        debug() {
            console.log(this.log)
        }
    }
}
</script>