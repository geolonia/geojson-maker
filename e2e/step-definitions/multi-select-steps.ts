import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../support/world.js'
import { DELETE_ACTION_BUTTON } from '../support/helpers/selectors.js'
import { shiftClickMapAtOffset, dragMapAtOffset } from '../support/helpers/map-helpers.js'

When('地図の中央から右に {int}px の位置をShiftクリックする', async function (this: CustomWorld, px: number) {
  await shiftClickMapAtOffset(this.page, px, 0)
})

When('地図の中央から左に {int}px の位置をShiftクリックする', async function (this: CustomWorld, px: number) {
  await shiftClickMapAtOffset(this.page, -px, 0)
})

Then('削除ボタンのタイトルが複数選択用になっている', async function (this: CustomWorld) {
  const btn = this.page.locator(DELETE_ACTION_BUTTON)
  const title = await btn.getAttribute('title')
  expect(title).toMatch(/\d+ 件を削除/)
})

When('地図上でラバーバンド選択する', async function (this: CustomWorld) {
  // 両方の地物（-50px と +50px）を囲む大きめのラバーバンドドラッグ
  await dragMapAtOffset(this.page, -100, -60, 100, 60)
})
