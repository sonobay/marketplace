<script lang="ts">
  import ImageRegular from '$lib/components/icons/ImageRegular.svelte';
  import { createEventDispatcher } from 'svelte';
  export let image: FileList | undefined;
  export let id: string;

  const dispatch = createEventDispatcher<{imageUpdated:{image: FileList | undefined}}>();

</script>

<div class="mr-4 h-14 w-14 rounded-full bg-gray-200 flex overflow-hidden">
  <label class="flex align-items w-full" for={id}>
    {#if image && image[0]}
    <img class="w-full" src={URL.createObjectURL(image[0])} alt="Entry Logo" />
    {:else}
    <div class="float-left cursor-pointer rounded-full px-4 py-2 flex items-center">
      <ImageRegular size={24} color="rgb(156 163 175)" />
    </div>
    {/if}
    <input name={id} id={id} type="file" class="hidden" bind:files={image} on:change={(e) => dispatch('imageUpdated', {image})} />
  </label>
</div>