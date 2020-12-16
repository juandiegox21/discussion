<template>
    <div>
        <b-field label="Feed">
            <div class="post" v-for="(post, ind) in posts" :key="ind">
                <article class="media">
                    <figure class="media-left image is-64x64">
                        <img class="is-rounded" :src="userAvatar(post.actor_profile_pic)">
                    </figure>
                    <div class="media-content">
                        <div class="content">
                            <p>
                                <strong>{{ post.actor_name }}</strong> <small>{{ $moment(post.created_at.toDate()).fromNow() }}</small>
                                <br>
                                    {{ post.body }}
                                <br><br>
                                <nav class="level is-mobile">
                                    <div class="level-left">
                                        <a class="level-item" aria-label="reply" @click="showComments(post)">
                                            <b-icon
                                                icon="message-reply-text">
                                            </b-icon>
                                            <span>{{ post.comments }}</span>
                                        </a>
                                        <a class="level-item" aria-label="like" @click="triggerLike(post)">
                                            <b-icon
                                                icon="cards-heart">
                                            </b-icon>
                                            <span>{{ post.likes }}</span>
                                        </a>
                                    </div>
                                    <div class="level-right" v-if="post.actor_id === userProfile.uid">
                                        <a class="level-item" aria-label="edit">
                                            <b-icon
                                                icon="pencil">
                                            </b-icon>
                                        </a>
                                        <a class="level-item" aria-label="delete" @click="deletePost(post.id)">
                                            <b-icon
                                                icon="delete">
                                            </b-icon>
                                        </a>
                                    </div>
                                </nav>
                            </p>
                        </div>

                        <div v-if="post.commentsContent">
                            <article class="media" v-for="(comment, contentId) in post.commentsContent" :key="contentId">
                                <figure class="media-left">
                                    <p class="image is-48x48">
                                        <img class="is-rounded" :src="userAvatar(post.actor_profile_pic)">
                                    </p>
                                </figure>
                                <div class="media-content">
                                    <div class="content">
                                        <p>
                                            <strong>{{ comment.actor_name }}</strong> <small>{{ $moment(comment.created_at.toDate()).fromNow() }}</small>
                                            <br>
                                            {{ comment.content }}
                                        </p>
                                    </div>

                                    <nav class="level is-mobile">
                                        <div class="level-left">
                                            <a class="level-item" aria-label="like">
                                                <b-icon
                                                    icon="cards-heart">
                                                </b-icon>
                                                <span>0</span>
                                            </a>
                                        </div>
                                        <div class="level-right" v-if="comment.actor_id === userProfile.uid">
                                            <a class="level-item" aria-label="edit">
                                                <b-icon
                                                    icon="pencil">
                                                </b-icon>
                                            </a>
                                            <a class="level-item" aria-label="delete" @click="deleteComment(comment)">
                                                <b-icon
                                                    icon="delete">
                                                </b-icon>
                                            </a>
                                        </div>
                                    </nav>
                                </div>
                            </article>
                        </div>

                        <div v-if="post.commentsContent">
                            <form @submit.prevent="leaveComment(post)">
                                <article class="media">
                                    <div class="media-content">
                                        <div class="field">
                                        <p class="control">
                                            <textarea class="textarea" placeholder="Add a comment..." v-model="post.commentText" required></textarea>
                                        </p>
                                        </div>
                                        <div class="field">
                                        <p class="control">
                                            <b-button native-type="submit">Add a comment</b-button>
                                        </p>
                                        </div>
                                    </div>
                                </article>
                            </form>
                        </div>
                    </div>
                </article>
            </div>
        </b-field>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { db, firestore } from '../../firebase'
import { debounce } from "debounce"

export default {
    name: 'Feed',

    data()
    {
        return {
            posts: null,
        }
    },

    computed: {
        ...mapState([
            'userProfile'
        ])
    },

    methods: {
        triggerLike : debounce(function(post) {
            return this.likePost(post)
        }, 500),

        async likePost(post)
        {
            // Increment likes count
            const increment = firestore.FieldValue.increment(1)
            // Decrement likes count
            const decrement = firestore.FieldValue.increment(-1)
            // User ID and Post ID document
            const docId = `${this.userProfile.uid}_${post.id}`
            // Like Id reference
            const likeRef = db.doc(`likes/${docId}`)
            // Like Document
            const likeDoc = await likeRef.get()

            // Post Id reference
            const postRef = db.doc(`posts/${post.id}`)
            // User already liked the post
            if (likeDoc.exists) {
                // Delete user post like registry
                await likeRef.delete()

                // Decrement likes count
                await postRef.update({
                    likes: decrement
                })

                return
            }

            // User post like registry
            await likeRef.set({
                postId: post.id,
                userId: this.userProfile.uid
            })
            
            // Increment likes count
            await postRef.update({
                likes: increment
            })

            return
        },

        async leaveComment(post)
        {
            // Increment comments count
            const increment = firestore.FieldValue.increment(1)
            
            // Increment comments count
            // Post Id reference
            const postRef = db.doc(`posts/${post.id}`)

            await postRef.update({
                comments: increment
            })

            // Timestamp
            const { serverTimestamp } = firestore.FieldValue

            await db.collection('comments').add({
                post_id: post.id,
                content: post.commentText,
                actor_id: this.userProfile.uid,
                actor_name: this.userProfile.name,
                actor_profile_pic: this.userProfile.profilePictureURL,
                created_at: serverTimestamp()
            })

            post.commentText = ''
        },

        deletePost(postId)
        {
            return db.collection('posts').doc(postId).delete()
        },

        async showComments(post)
        {
            const ind = this.posts.indexOf(post)
            
            if (this.posts[ind].commentsContent && this.posts[ind].commentsContent.length > 0) {
                return this.$delete(this.posts[ind], 'commentsContent')
            }
            
            const commentsRef = db.collection('comments')
                .where('post_id', '==', post.id)
                .orderBy('created_at', 'desc')
            
            const commentDocs = await commentsRef.get()
            
            const commentsData = commentDocs.docs.map((doc) => {
                return { 
                    id: doc.id, 
                    ...doc.data() 
                }
            })
            
            return this.$set(this.posts[ind], 'commentsContent', commentsData)
        },

        async deleteComment(comment)
        {
            // Decrement likes count
            const decrement = firestore.FieldValue.increment(-1)
            
            // Dcrement comments count
            // Post Id reference
            const postRef = db.doc(`posts/${comment.post_id}`)

            await postRef.update({
                comments: decrement
            })

            return db.collection('comments').doc(comment.id).delete()
        },

        userAvatar(profilePicture = '')
        {
            if (profilePicture.length > 0) {
                return profilePicture
            }

            return require('../../assets/img/no-avatar.png')
        }
    },

    firestore()
    {
        return {
            posts: db.collection('posts').orderBy('created_at', 'desc')
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