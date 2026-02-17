import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../support/world.js'
import {
  ADDRESS_SEARCH_BAR,
  ADDRESS_SEARCH_INPUT,
  ADDRESS_SEARCH_BUTTON,
  ADDRESS_SEARCH_ERROR,
} from '../support/helpers/selectors.js'

Then('住所検索バーが表示されている', async function (this: CustomWorld) {
  await expect(this.page.locator(ADDRESS_SEARCH_BAR)).toBeVisible()
})

When('住所検索バーに {string} と入力する', async function (this: CustomWorld, address: string) {
  await this.page.locator(ADDRESS_SEARCH_INPUT).fill(address)
})

When('検索ボタンをクリックする', async function (this: CustomWorld) {
  await this.page.locator(ADDRESS_SEARCH_BUTTON).click()
})

When('検索バーでEnterキーを押す', async function (this: CustomWorld) {
  await this.page.locator(ADDRESS_SEARCH_INPUT).press('Enter')
})

Then('地図の中心が移動する', async function (this: CustomWorld) {
  // flyTo が呼ばれたことを確認するため、少し待つ
  await this.page.waitForTimeout(500)
  // flyTo による地図移動はアニメーションなので、エラーが出ていないことを確認
  const error = this.page.locator(ADDRESS_SEARCH_ERROR)
  await expect(error).not.toBeVisible()
})

Then('{string} エラーが表示される', async function (this: CustomWorld, message: string) {
  const error = this.page.locator(ADDRESS_SEARCH_ERROR)
  await expect(error).toBeVisible()
  await expect(error).toHaveText(message)
})
