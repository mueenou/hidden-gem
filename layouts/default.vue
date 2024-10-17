<template>
    <nav class="w-full sticky top-0 p-6 flex justify-between border-b dark:border-gray-800 border-gray-200">

      <UTooltip text="Retourner au bureau">
        <nuxt-link to="/">
          <h1 class="text-2xl font-bold">Hidden Gem</h1>
        </nuxt-link>
      </UTooltip>
      <ClientOnly>
        <UTooltip :text="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="gray"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </UTooltip>
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>
    </nav>
    <slot />
</template>

<script setup>
const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
