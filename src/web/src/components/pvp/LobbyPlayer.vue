<template>
    <div class="player" @click.prevent="$emit('select', { id, img, name: username, pokemon: starters })">
        <img :src="getImage()" width="40" height="40" class="profileImg"><br>
        <b>ID </b> {{ id }}<br>
        <b>username </b> {{ username}}<br>
        <b>starters </b> <img src="../../assets/collectionpokeballs.png" width="20" height="20"> {{ starters }}
    </div>
</template>

<script>
export default {
    name: 'lobby-player',
    emits: ['select'],
    props: {
        id: {
            type: String
        },
        username: {
            type: String
        },
        img: {
            type: String
        },
        starters: {
            type: Array,
            default: () => []
        }
    },
    methods: {
      getImage() {
        return require(`@/assets/profileAvatar/${this.img}`);
      }
    }
}
</script>

<style scoped>
.player {
    text-align: left;
    width: 25%;
    padding: 1%;
    margin: 1%;
    border-style: solid;
    border-color: black;
    border-radius: 10px;
    cursor: pointer;
}

.player:hover {
    background-color: yellow;
}

.profileImg {
    border-radius: 25px;
    margin-bottom: 1%;
}
</style>