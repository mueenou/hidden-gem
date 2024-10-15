<template>
  <div class="">
    <UHeader>
      <h1>Hidden Gem</h1>

      <template #right>
        <UColorModeButton />

        <UButton
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          color="gray"
          variant="ghost"
        />
      </template>
    </UHeader>
    <slot />
  </div>
</template>

<script setup></script>
