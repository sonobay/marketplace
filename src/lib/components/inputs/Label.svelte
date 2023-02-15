<script lang="ts">

  export let targetFor: string;
  export let text: string;
  const labelClass = 'text-gray-500 text-sm font-semibold'

</script>

<label class={labelClass} for={targetFor}>{text}</label>