<template>
    <div>
        <div class="columns">
            <div class="column is-one-fifth profile-info">
                <div class="has-text-centered">
                    <img class="avatar" :src="userAvatar"  width="150" height="100" alt="No avatar">
                    <h1 class="title is-5">{{ $store.state.userProfile.name }}</h1>
                </div>
            </div>

            <div class="column">
                <!-- Make post -->
                <make-post></make-post>
                <hr>
                <!-- Feed -->
                <feed></feed>
            </div>
        </div>
    </div>
</template>

<script>
import MakePost from '../components/Dashboard/MakePost'
import Feed from '../components/Dashboard/Feed'

export default {
    name: 'Dashboard',

    components: {
        MakePost,
        Feed
    },

    computed: {
        userAvatar() 
        {
            let userProfile = this.$store.state.userProfile;
            let userIsLoggedIn = Object.keys(userProfile).length > 0
            
            if (userIsLoggedIn && userProfile.photoURL) {
                return userProfile.photoURL
            }

            return require('../assets/img/no-avatar.png')
        }
    }
}
</script>

<style lang="scss">
    .avatar
    {
        border-radius: 50%;
    }
</style>