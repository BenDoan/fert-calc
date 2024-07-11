import { expect, test } from 'vitest'
import { getAliases } from '../src/lib/calc'
import type { Config } from '../src/lib/calc'

test('getAliases', () => {
  const config: Config = {
    "product-names": new Map()
  }
  expect(getAliases(config)).toBe({})
})
