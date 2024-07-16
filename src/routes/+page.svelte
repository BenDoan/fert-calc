<script>
  import Calc from '$lib/components/Calc.svelte';
</script>

<div class="ml-10 mr-10">
  <h1 class="text-3xl font-bold underline">
    Substance Calc
  </h1>

  <Calc />
</div>

<style lang="postcss">
  :global(html) {
    background-color: theme(colors.gray.100);
  }
</style>
