<template>
    <div>
        <b-field label="Make a post">
            <b-input 
                type="is-info"
                icon="message-processing"
                placeholder="Say something.." 
                rounded
                expanded
                v-model="content">
            </b-input>

            <b-button type="is-info" @click="post()" :loading="isLoading">Post</b-button>
        </b-field>
    </div>
</template>

<script>
import { db, firestore } from '../../firebase'

export default {
    name: 'MakePost',

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
            const { serverTimestamp } = firestore.FieldValue

            this.isLoading = true
            db.collection('posts').add({
                actor: this.$store.state.userProfile.name,
                body: this.content,
                posted_at: serverTimestamp()
            }).then( res => {
                this.isLoading = false
                this.content = ''
            })
        }
    }
}
</script>