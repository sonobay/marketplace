<script lang="ts">
  export let userAddress: string;
</script>

<nav class="absolute top-10 w-full rounded border-gray-100 border-2">
  <ul class="text-sm font-semibold text-gray-600">
    <li class="flex">
      <a class={`w-full px-4 py-2 hover:bg-gray-100`} href={`/users/${userAddress}`}>View Patches</a>
    </li>
  </ul>
</nav>