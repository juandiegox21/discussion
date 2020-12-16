<template>
    <div>
        <b-field label="Make a post">
            <form @submit.prevent="post()">
                <article class="media">
                    <div class="media-content">
                        <div class="field">
                            <p class="control">
                                <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
                                <textarea class="textarea" placeholder="Say something..." v-model="content" required></textarea>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control">
                                <b-button native-type="submit" :disabled="isLoading">Post</b-button>
                            </p>
                        </div>
                    </div>
                </article>
            </form>
        </b-field>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { db, firestore } from '../../firebase'

export default {
    name: 'MakePost',

    computed: {
        ...mapState([
            'userProfile'
        ])
    },

    data()
    {
        return {
            content: '',
            isLoading: false
        }
    },

    methods: {
        post()
        {
            if (this.content.length < 1) {
                return
            }

            const { serverTimestamp } = firestore.FieldValue

            this.isLoading = true

            db.collection('posts').add({
                actor_id: this.userProfile.uid,
                actor_name: this.userProfile.name,
                actor_profile_pic: this.userProfile.profilePictureURL,
                body: this.content,
                comments: 0,
                likes: 0,
                created_at: serverTimestamp()
            }).then( res => {
                this.content = ''
                this.isLoading = false
            })
        }
    }
}
</script>