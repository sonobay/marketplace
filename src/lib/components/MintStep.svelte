<script lang="ts">

  export let stepNumber: number;
  export let instruction: string;

</script>

<div class="flex items-center font-bold mb-2">

  <span class="text-midiBlue text-sm mr-2">Step {stepNumber}</span>

  <span class="text-charcoal">{instruction}</span>

</div>

