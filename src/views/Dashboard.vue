<template>
    <div>
        Dashboard: {{ $store.state.userProfile.name }},
        Welcome!
    </div>
</template>

<script>
export default {
    name: 'Dashboard'
}
</script>