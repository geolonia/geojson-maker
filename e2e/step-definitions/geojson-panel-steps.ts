import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../support/world.js'
import { GEOJSON_TEXTAREA, GEOJSON_PANEL_COUNT, GEOJSON_PANEL_BUTTON } from '../support/helpers/selectors.js'
import { getGeoJSONFromPanel } from '../support/helpers/map-helpers.js'

Then('GeoJSONに {int} 件のフィーチャが含まれる', async function (this: CustomWorld, count: number) {
  const fc = await getGeoJSONFromPanel(this.page)
  expect(fc.features.length).toBe(count)
})

Then('{int} 番目のフィーチャのジオメトリタイプが {string} である', async function (
  this: CustomWorld,
  index: number,
  geometryType: string
) {
  const fc = await getGeoJSONFromPanel(this.page)
  expect(fc.features[index - 1].geometry.type).toBe(geometryType)
})

Then('{int} 番目のフィーチャのプロパティ {string} が {string} である', async function (
  this: CustomWorld,
  index: number,
  propName: string,
  propValue: string
) {
  const fc = await getGeoJSONFromPanel(this.page)
  const properties = fc.features[index - 1].properties
  expect(properties?.[propName]).toBe(propValue)
})

Then('{int} 番目のフィーチャのポリゴン座標リングが閉じている', async function (
  this: CustomWorld,
  index: number
) {
  const fc = await getGeoJSONFromPanel(this.page)
  const geometry = fc.features[index - 1].geometry
  expect(geometry.type).toBe('Polygon')
  if (geometry.type === 'Polygon') {
    const ring = geometry.coordinates[0]
    const first = ring[0]
    const last = ring[ring.length - 1]
    expect(first[0]).toBe(last[0])
    expect(first[1]).toBe(last[1])
  }
})

Then('GeoJSONテキストエリアに {string} が含まれる', async function (this: CustomWorld, text: string) {
  const value = await this.page.locator(GEOJSON_TEXTAREA).inputValue()
  expect(value).toContain(text)
})

Then('GeoJSONパネルの件数が {string} と表示される', async function (this: CustomWorld, countText: string) {
  await expect(this.page.locator(GEOJSON_PANEL_COUNT)).toHaveText(countText)
})

When('{string} ボタンをクリックする', async function (this: CustomWorld, buttonText: string) {
  const button = this.page.locator(GEOJSON_PANEL_BUTTON, { hasText: buttonText })
  await button.click()
})

Then('ボタンのテキストが {string} に変わる', async function (this: CustomWorld, expectedText: string) {
  const button = this.page.locator(GEOJSON_PANEL_BUTTON, { hasText: expectedText })
  await expect(button).toBeVisible()
})
