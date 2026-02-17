import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../support/world.js'
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'

When('GeoJSONファイルをマージインポートする:', async function (this: CustomWorld, geojsonText: string) {
  const tmpFile = path.join(os.tmpdir(), `test-import-${Date.now()}.geojson`)
  fs.writeFileSync(tmpFile, geojsonText.trim(), 'utf-8')

  // window.confirm をオーバーライドして「キャンセル」（マージ）を返す
  await this.page.evaluate(() => { window.confirm = () => false })

  const fileInput = this.page.locator('input[type="file"][accept=".geojson,.json"]')
  await fileInput.setInputFiles(tmpFile)

  await this.page.waitForTimeout(500)
  fs.unlinkSync(tmpFile)
})

When('GeoJSONファイルを置換インポートする:', async function (this: CustomWorld, geojsonText: string) {
  const tmpFile = path.join(os.tmpdir(), `test-import-${Date.now()}.geojson`)
  fs.writeFileSync(tmpFile, geojsonText.trim(), 'utf-8')

  // window.confirm をオーバーライドして「OK」（置換）を返す
  await this.page.evaluate(() => { window.confirm = () => true })

  const fileInput = this.page.locator('input[type="file"][accept=".geojson,.json"]')
  await fileInput.setInputFiles(tmpFile)

  await this.page.waitForTimeout(500)
  fs.unlinkSync(tmpFile)
})
