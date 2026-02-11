import { Page } from '@playwright/test'
import { MAP_CANVAS, GEOJSON_TEXTAREA } from './selectors.js'

/**
 * 地図の描画完了を待機する
 */
export async function waitForMapReady(page: Page): Promise<void> {
  await page.waitForSelector(MAP_CANVAS, { state: 'visible', timeout: 30000 })
  // Canvas が実際に描画されるまで少し待つ
  await page.waitForTimeout(2000)
}

/**
 * Canvas の中央からの相対座標でクリックする
 * Viewport 1280x720 固定で、左パネル(280px) と右パネル(360px) を避けた安全領域を使用
 */
export async function clickMapAtOffset(
  page: Page,
  offsetX: number = 0,
  offsetY: number = 0
): Promise<void> {
  const canvas = page.locator(MAP_CANVAS)
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas が見つかりません')

  // パネルを避けた安全領域の中央: 左 280px + 右 360px を除いた中央
  const safeAreaCenterX = 280 + (box.width - 280 - 360) / 2
  const safeAreaCenterY = box.height / 2

  await page.mouse.click(
    box.x + safeAreaCenterX + offsetX,
    box.y + safeAreaCenterY + offsetY
  )
  // クリック後の state 更新を待つ
  await page.waitForTimeout(500)
}

/**
 * GeoJSON パネルのテキストエリアから FeatureCollection をパースして返す
 */
export async function getGeoJSONFromPanel(page: Page): Promise<GeoJSON.FeatureCollection> {
  const value = await page.locator(GEOJSON_TEXTAREA).inputValue()
  return JSON.parse(value) as GeoJSON.FeatureCollection
}
