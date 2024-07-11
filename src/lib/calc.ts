interface Config {
  "product-names": { [key: string]: string[] }
}

function getAliases(config: Config) {
  const productNames = config["product-names"]
  if (!productNames) {
    console.error("Failed to find product-names in config")
  }

  const cannonicalMapping: Map<string, string> = new Map()
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

export { getAliases }
export type { Config }
