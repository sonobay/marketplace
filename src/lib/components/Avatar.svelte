<script lang="ts">
  import ImageRegular from "./icons/ImageRegular.svelte";
  export let size: 'sm' | 'md' | 'lg';
  export let path: string | undefined;
  export let alt: string;
</script>

<div class="mr-4 h-14 w-14 rounded-full bg-gray-200 flex overflow-hidden">
  <div class="flex align-items w-full">
    {#if path}
      <img class="w-full" src={path} alt={alt} />
    {:else}
    <div class="float-left cursor-pointer rounded-full px-4 py-2 flex items-center">
      <ImageRegular size={24} color="rgb(156 163 175)" />
    </div>
    {/if}
  </div>
</div>