<script>
  import { files, year, isValidated } from '$lib/store.js';
  import { FileType } from '$lib/constants.ts';

  let configFile
  let importsFile
  let inventoryFile

  function click() {
    console.log(configFile)
    console.log(Papa.parse(configFile || ""))
  }

  function onchange(event, fileType) {
    const file = event.target.files[0]
    console.log(file)
    const reader = new FileReader()

    reader.addEventListener("load",
      () => {
        files.update(items => {
          items[fileType] = reader.result
          return items
        })
        console.log(files)
      }, false
    )

    reader.readAsText(file, "UTF-8")
  }

  function submit() {
    console.log(files)
    validate()
  }

  function validate() {
    if (true || Object.values($files).length === 3) {
      isValidated.set(true)
    } else {
      // TODO: not all set
    }
  }
</script>

<div class="w-full max-w-sm ml-5">
  <label for="configFile">Config File</label>
  <input type="file" accept="application/json" id="configFile" name="configFile" bind:value={configFile} on:change={event => onchange(event, FileType.CONFIG)} />

  <label for="importsFile">Imports File</label>
  <input type="file" accept="text/csv" id="importsFile" name="importsFile" on:change={event => onchange(event, FileType.IMPORTS)} />

  <label for="inventoryFile">Inventory File</label>
  <input type="file" accept="text/csv" id="inventoryFile" name="inventoryFile" on:change={event => onchange(event, FileType.INVENTORY)} />

  <br>

  <label for="Year" >Year</label>
  <input type="text" class="mt-5" id="year" name="year" bind:value={$year} />

  <br>

  <button on:click={submit} class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
</div>

<style>
</style>

