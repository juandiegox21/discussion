<template>
    <div>
        <b-loading v-model="isLoading"></b-loading>
    </div>
</template>

<script>
export default {
    name: 'Logout',

    mounted() 
    {
        this.isLoading = true;
        
        this.$store.dispatch('logout').then( res => {
            this.isLoading = true;
        })
    },

    data()
    {
        return {
            isLoading: false
        }
    }
}
</script>