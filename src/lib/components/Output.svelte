<script>
  import * as Papa from 'papaparse'
  import { FileType } from '$lib/constants.ts';
  import { getAliases, truncateHeader } from '$lib/calc.ts';
  import { files, year, isValidated } from '$lib/store.js';

  let config
  let inventory
  let imports

  let chemNameToAmount = {}
  let missingRecipies = []
  let chemNameToData = {}

  function reset() {
    isValidated.set(false)
    files.set({})
  }

  function generate() {
    config  = JSON.parse($files[FileType.CONFIG])

    inventory = Papa.parse($files[FileType.INVENTORY], {
      header: true,
      dynamicTypeing: true,
    })

    // Remove unneeded secondary header if present
    const importsCsv = truncateHeader($files[FileType.IMPORTS], "product")
    imports = Papa.parse(importsCsv, {
      header: true,
      dynamicTypeing: true,
    })

    const aliases = getAliases(config)

    for (const imprt of imports.data) {

      const numCol = $year
      const quantityInImportsStr = imprt[numCol]

      if (!quantityInImportsStr) {
        console.log(`Failed to find entry for numCol: ${numCol}, options: ${Object.keys(imprt)}`, imprt)
        continue
      }

      const quantityInImports = parseInt(quantityInImportsStr.replace(",", ""))
      const product = imprt["PRODUCT"] || imprt["product"] || imprt["Product"]
      const cannonicalProduct = aliases[product] ?? product

      const productRecipe = config["product-recipes"][cannonicalProduct]

      console.log("Processing row", imprt)
      console.log(`Extracting quantity for ${product} from col ${numCol}: ${quantityInImports}`)
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
      console.log("==============")
      console.log("")
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

    for (const [chemName, amount] of Object.entries(chemNameToAmount)) {
      chemNameToData[chemName] = {
        amount: amount,
        isActive: chemNameToInventoryData[chemName]?.isActive,
        casNumber: chemNameToInventoryData[chemName]?.casNumber,
      }
    }


    missingRecipies = [...new Set(missingRecipies)].join(", ")
    chemNameToData = chemNameToData
  }

</script>

{#if Object.keys(chemNameToData).length > 0}
<button class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={reset}>Reset</button>
  <table>
    <tr>
      <th>Ingredient</th>
      <th>CAS Number</th>
      <th>Amount (lbs)</th>
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
{:else}
<button class="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={generate}>Gen</button>
{/if}

{#if Object.keys(missingRecipies).length > 0}
  <div class="mt-20">
    Missing product recipes: {missingRecipies}
  </div>
{/if}

<style>
</style>

