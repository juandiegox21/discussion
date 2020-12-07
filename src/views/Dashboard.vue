<template>
    <div>
        <div class="columns">
            <div class="column is-one-third profile-info">
                <div class="has-text-centered">
                    <img src="../assets/img/no-avatar.png"  width="150" height="100" alt="No avatar">
                    <h1 class="title">{{ $store.state.userProfile.name }}</h1>
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
    }
}
</script>

<style lang="scss">
    .profile-info {
        background: #f7f7f7;
        height: 100vh;
    }
</style>