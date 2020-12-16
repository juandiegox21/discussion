<template>
    <div>
        <h1 class="title is-4">Settings</h1>
        <b-loading :active.sync="isLoading"></b-loading>
        <b-field label="Upload a profile picture">
            <b-upload class="file-label" @input="uploadPicture" :disabled="isLoading">
                <span class="file-cta">
                    <b-icon class="file-icon" icon="upload"></b-icon>
                    <span class="file-label">Click to upload</span>
                </span>
                <span class="file-name">
                    
                </span>
            </b-upload>
        </b-field>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { db, storage } from '../firebase'

export default {
    name: 'Settings',

    data()
    {
        return {
            isLoading: false
        }
    },

    computed: {
        ...mapState([
            'userProfile'
        ])
    },

    methods: {
        async uploadPicture()
        {
            // The file object
            const file = event.target.files[0]

            // Update Profile picture
            const updatedPicture = this.$store.dispatch('updateProfilePicture', file)
            
            this.isLoading = true;

            updatedPicture
                .then(res => {
                    this.isLoading = false;

                    return this.$buefy.snackbar.open({
                        message: 'Your profile picture was updated!',
                        type: 'is-success',
                        position: 'is-top',
                    })
                }).catch(error => {
                    this.isLoading = false;

                    return this.$buefy.snackbar.open({
                        message: error,
                        type: 'is-danger',
                        position: 'is-top',
                    })
                });
        }
    }
}
</script>