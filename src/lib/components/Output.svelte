<script>
  import * as Papa from 'papaparse'
  import { FileType } from '$lib/constants.ts';
  import { getAliases } from '$lib/calc.ts';
  import { files, isValidated } from '$lib/store.js';

  let config
  let inventory
  let imports

  let chemNameToAmount = {}
  let missingRecipies = []
  let chemNameToData = {}

  function reset() {
    isValidated.set(false)
    files.set(false)
  }

  function generate() {
    config  = JSON.parse($files[FileType.CONFIG])

    inventory = Papa.parse($files[FileType.INVENTORY], {
      header: true,
      dynamicTypeing: true,
    })

    // Remove unneeded secondary header
    const allButFirstImportsCsv = $files[FileType.IMPORTS].split(/\r?\n/).slice(4).join("\n")
    imports = Papa.parse(allButFirstImportsCsv, {
      header: true,
      dynamicTypeing: true,
    })

    const aliases = getAliases(config)

    for (const imprt of imports.data) {

      const numCol = "2020"
      const quantityInImportsStr = imprt[numCol]

      if (!quantityInImportsStr) {
        console.error(`Failed to find entry for numCol: ${numCol}, options: ${Object.keys(imprt)}`)
        continue
      }

      const quantityInImports = parseInt(quantityInImportsStr.replace(",", ""))
      const product = imprt["PRODUCT"]
      const cannonicalProduct = aliases[product] ?? product

      const productRecipe = config["product-recipes"][cannonicalProduct]

      if (productRecipe) {
        for (const [recipeName, ratioOfrecipe] of Object.entries(productRecipe)) {
          const totalAmountOfIngredient = ratioOfrecipe * quantityInImports * 2000
          console.log(`For ${cannonicalProduct},${recipeName}: ${ratioOfrecipe} * ${quantityInImports} = ${totalAmountOfIngredient}`)

          chemNameToAmount[recipeName] = (chemNameToAmount[recipeName] ?? 0) + totalAmountOfIngredient
        }
      } else {
        missingRecipies.push(cannonicalProduct)
        console.error(`Failed to find recipe for ${product}`)
      }

    }

    const chemNamesInImports = new Set(Object.keys(chemNameToAmount))

    const chemNameToInventoryData = {}
    for (const inventoryItem of inventory.data) {
      if (chemNamesInImports.has(inventoryItem.ChemName)) {
        chemNameToInventoryData[inventoryItem.ChemName] = {
          isActive: inventoryItem.ACTIVITY == "ACTIVE",
          casNumber: inventoryItem.CASRN,
        }
      }
    }
    console.log("chemNameToInventoryData", chemNameToInventoryData)

    // Lookup CASNumbers
    for (const [chemName, amount] of Object.entries(chemNameToAmount)) {
      chemNameToData[chemName] = {
        amount: amount,
        isActive: chemNameToInventoryData[chemName]?.isActive,
        casNumber: chemNameToInventoryData[chemName]?.casNumber,
      }
    }


    missingRecipies = missingRecipies
  }

</script>

<p>Output</p>

<button class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={reset}>Reset</button>
<button class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={generate}>Gen</button>

{#if chemNameToData}
  <table>
    <tr>
      <th>Ingredient</th>
      <th>CAS Number</th>
      <th>Amount</th>
    </tr>

    {#each Object.entries(chemNameToData) as [ingredient, data]}
      <tr class="odd:bg-white even:bg-gray-200">
        <td>{ingredient}</td>
        <td>
          {#if data.casNumber}
            {data.casNumber}
          {/if}
        </td>
        <td class="text-right">
          {#if data.isActive}
            {data.amount.toLocaleString('en-US')}
          {:else}
            Not on TSCA Inventory List
          {/if}
        </td>
      </tr>
    {/each}
  </table>
{/if}

{#if missingRecipies}
  <div class="mt-20">
    Missing recipes: {missingRecipies}
  </div>
{/if}

<style>
</style>

