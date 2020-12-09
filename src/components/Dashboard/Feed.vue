<template>
    <div>
        <b-field label="Feed">
            <div class="post" v-for="(post, ind) in posts" :key="ind">
                <div class="card">
                    <div class="card-content">
                        <div class="media">
                            <div class="media-left">
                                <figure class="image is-48x48">
                                <img src="../../assets/img/no-avatar.png" alt="Placeholder image">
                                </figure>
                            </div>
                            <div class="media-content">
                                <p class="title is-4">{{ post.actor }}</p>
                            </div>
                        </div>

                        <div class="content">
                            {{ post.body }}
                            <hr>
                            <span class="is-size-7">{{ (post.posted_at) ? post.posted_at.toDate().toString() : '' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </b-field>
    </div>
</template>

<script>
import { db } from '../../firebase'

export default {
    name: 'Feed',

    data()
    {
        return {
            posts: null
        }
    },

    firestore()
    {
        return {
            posts: db.collection('posts').orderBy('posted_at', 'desc')
        }
    }
}
</script>