<script lang="ts">
  export let id: string;
  export let name: string;
  export let value: string;
  export let required = false;

  const inputClass = 'rounded-[3px] w-full px-2 py-1 bg-white'
</script>

<div class="rounded bg-gradient-to-b p-0.5 from-gray-300 to-gray-400 w-full flex">
  <textarea {id} {name} bind:value="{value}" class={inputClass} {required} />
</div>