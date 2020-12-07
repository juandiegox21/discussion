<template>
    <div>
        Dashboard: {{ $store.state.userProfile.name }}
        <b-button type="is-danger">Close dab</b-button>
    </div>
</template>

<script>
export default {
    name: 'Dashboard'
}
</script>