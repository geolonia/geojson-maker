import { Given } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import { CustomWorld } from '../support/world.js'
import { DRAW_CONTROL_PANEL } from '../support/helpers/selectors.js'

Given('アプリケーションが表示されている', async function (this: CustomWorld) {
  await expect(this.page.locator(DRAW_CONTROL_PANEL)).toBeVisible()
})
