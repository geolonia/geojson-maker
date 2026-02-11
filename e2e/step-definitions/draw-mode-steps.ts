import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../support/world.js'
import {
  MODE_BUTTON,
  MODE_BUTTON_SELECTED,
  HELPER_TEXT,
  DRAFT_SECTION,
} from '../support/helpers/selectors.js'

/**
 * Given/Then 両方で使える: 現在の選択状態を確認し、必要ならクリックして選択する
 */
Given('{string} モードが選択されている', async function (this: CustomWorld, modeName: string) {
  const selected = this.page.locator(MODE_BUTTON_SELECTED)
  const selectedText = await selected.textContent()
  if (selectedText?.trim() === modeName) return

  // まだ選択されていなければクリック
  const button = this.page.locator(MODE_BUTTON, { hasText: modeName })
  await button.click()
  await expect(button).toHaveClass(/draw-mode-selector__button--selected/)
})

When('{string} モードを選択する', async function (this: CustomWorld, modeName: string) {
  const button = this.page.locator(MODE_BUTTON, { hasText: modeName })
  await button.click()
  await expect(button).toHaveClass(/draw-mode-selector__button--selected/)
})

Then('選択中のモードが {string} である', async function (this: CustomWorld, modeName: string) {
  const selected = this.page.locator(MODE_BUTTON_SELECTED)
  await expect(selected).toHaveText(modeName)
})

Then('ヘルパーテキストが {string} と表示される', async function (this: CustomWorld, expectedText: string) {
  await expect(this.page.locator(HELPER_TEXT)).toHaveText(expectedText)
})

Then('ドラフトセクションが表示される', async function (this: CustomWorld) {
  await expect(this.page.locator(DRAFT_SECTION)).toBeVisible()
})
