import { expect, test } from 'vitest'
import { getAliases } from './lib/calc'
import type { Config } from './lib/calc'

test('getAliases', () => {
  const config: Config = {
    "product-names": {
      "foo": ["foo1", "foo2"]
    }
  }

  expect(getAliases(config)).toStrictEqual(new Map([
    ["foo1", "foo"],
    ["foo2", "foo"]
  ]))
})

