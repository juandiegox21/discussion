<template>
    <div>
        <b-field label="Make a post">
            <b-input 
                type="is-info"
                icon="message-processing"
                placeholder="Say something.." 
                rounded
                expanded>
            </b-input>

            <b-button type="is-info" @click="post()">Post</b-button>
        </b-field>
    </div>
</template>

<script>
export default {
    name: 'MakePost',

    methods: {
        post()
        {
            
        }
    }
}
</script>