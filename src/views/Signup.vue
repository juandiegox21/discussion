<template>
    <div class="columns is-mobile is-centered">
        <b-loading v-model="isLoading"></b-loading>
        <div class="column is-half has-text-centered">
            <h1 class="title">Create an account</h1>

            <form @submit.prevent>
                <b-field label="Name">
                    <b-input v-model="name"></b-input>
                </b-field>

                <b-field label="Email">
                    <b-input v-model="email"></b-input>
                </b-field>

                <b-field label="Password">
                    <b-input 
                        v-model="password" 
                        type="password" 
                        password-reveal>
                    </b-input>
                </b-field>
            </form>

            <b-button type="is-primary" @click="signup()">Sign up</b-button>

            <div style="padding-top: 10px;">
                <b-button type="is-grey" icon-left="google" @click="login('google')">Sign In with Google</b-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Signup',

    methods: {
        signup()
        {
            this.isLoading = true

            this.$store.dispatch('signup', {
                name: this.name,
                email: this.email,
                password: this.password,
            }).then( res => {
                this.isLoading = false
            }).catch( err => {
                this.isLoading = false
            })
        },

        login(provider = '')
        {
            this.isLoading = true

            this.$store.dispatch('login', {
                provider: provider
            }).then( res => {
                this.isLoading = false
            }).catch( err => {
                this.isLoading = false
            })
        }
    },

    data()
    {
        return {
            name: '',
            email: '',
            password: '',
            isLoading: false
        }
    }
}
</script>