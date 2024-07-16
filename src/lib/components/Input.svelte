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

<form>
  <div class="mb-4">
      <label for="configFile">Composition Data</label>
      <input type="file" accept="application/json" id="configFile" name="configFile" bind:value={configFile} on:change={event => onchange(event, FileType.CONFIG)} />
  </div>

  <div class="mb-4">
    <label for="importsFile">Import / Production Volumes (CSV)</label>
    <input type="file" accept="text/csv" id="importsFile" name="importsFile" on:change={event => onchange(event, FileType.IMPORTS)} />
  </div>

  <div class="mb-4">
    <label for="inventoryFile">TSCA Inventory File (CSV)</label>
    <input type="file" accept="text/csv" id="inventoryFile" name="inventoryFile" on:change={event => onchange(event, FileType.INVENTORY)} />
  </div>

  <div class="mb-4">
    <label for="Year" >Year</label>
    <input type="text" id="year" name="year" bind:value={$year} />
  </div>

  <br>

  <button on:click={submit} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
</form>

<style>
</style>

