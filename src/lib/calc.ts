interface Config {
  "product-names": { [key: string]: string[] }
}

function getAliases(config: Config) {
  const productNames = config["product-names"]
  const cannonicalMapping: Map<string, string> = new Map()
  if (!productNames) {
    console.log("Failed to find product-names in config")
    return cannonicalMapping
  }

  for (const [cannonicalName, aliases] of Object.entries(productNames)) {
    for (const alias of aliases) {
      if (cannonicalMapping.has(alias) && cannonicalMapping.get(alias) != cannonicalName) {
        console.error(`Duplicate alias for ${alias} -> ${cannonicalName}`)
      }
      cannonicalMapping.set(alias, cannonicalName)
    }
  }

  return cannonicalMapping
}

function truncateHeader(csvString: string, watchWord: string) {
  let splitCsv = csvString.split(/\r?\n/)

  while (splitCsv.length > 0) {
    const line = splitCsv[0]
    if (line.toLowerCase().includes(watchWord.toLowerCase())) {
      break
    }
    splitCsv = splitCsv.slice(1)
  }

  return splitCsv.join("\n")
}

export { getAliases, truncateHeader }
export type { Config }
