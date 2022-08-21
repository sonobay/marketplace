<script lang="ts">
  import ConnectButton from "$lib/components/ConnectButton.svelte";
</script>

<header class="container mx-auto py-2">
  <div class="flex justify-between">
    <h1><a href="/">MIDI.Link</a></h1>
    <div>
      <ConnectButton />
      <a href="/mint">Mint</a>
      <a href="/config">Config</a>
    </div>
  </div>
</header>