import { test } from 'node:test'
import assert from 'node:assert/strict'
import { morphGlyphs } from './morph.ts'

test('Oskrrr rolls one r into an a and drops the other', () => {
  assert.deepEqual(morphGlyphs('Oskrrr', 'Oskar'), [
    { shown: 'O', becomes: 'O' },
    { shown: 's', becomes: 's' },
    { shown: 'k', becomes: 'k' },
    { shown: 'r', becomes: 'a' },
    { shown: 'r', becomes: null },
    { shown: 'r', becomes: 'r' },
  ])
})

test('identical words keep every glyph', () => {
  assert.ok(morphGlyphs('Oskar', 'Oskar').every((g) => g.shown === g.becomes))
})

test('a longer target adds glyphs that start empty', () => {
  assert.deepEqual(morphGlyphs('Ok', 'Oak').map((g) => g.becomes), ['O', 'a', 'k'])
})
