<script lang="ts">
	import { createEventDispatcher } from "svelte";

  export let id: string;
  export let name: string;
  export let value: string;
  export let required = false;
  export let type: "text" | "number" = "text";
  export let placeholder = ''

  const inputClass = 'rounded-[3px] w-full px-2 py-1 bg-white';

  const dispatch = createEventDispatcher<{change:{e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
}}}>();
</script>

<div class="rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 w-full flex">
  {#if type === 'text'}
  <input 
    {id} 
    {name}
    bind:value={value}
    class={inputClass}
    type="text"
    {required}
    {placeholder}
    on:change={(event) => dispatch('change', {e: event})}
  />
  {:else if type === 'number'}
    <input 
      {id} 
      {name}
      bind:value="{value}" 
      class={inputClass}
      type="number"
      {required}
      on:change={(event) => dispatch('change', {e: event})}
    />
  {/if}
</div>