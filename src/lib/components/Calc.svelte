<script>
  import Input from '$lib/components/Input.svelte';
  import Output from '$lib/components/Output.svelte';

  import { isValidated } from '$lib/store.js';
  console.log($isValidated)
  /**
TODO:
- Test json parse failure error message
   **/
</script>

<div class="w-screen">
  {#if $isValidated}
    <Output />
  {:else}
    <Input />
  {/if}
</div>

<style>
</style>
