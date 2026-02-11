import { When } from '@cucumber/cucumber'
import { CustomWorld } from '../support/world.js'
import { clickMapAtOffset } from '../support/helpers/map-helpers.js'

When('地図の中央をクリックする', async function (this: CustomWorld) {
  await clickMapAtOffset(this.page, 0, 0)
})

When('地図の中央から右に {int}px の位置をクリックする', async function (this: CustomWorld, px: number) {
  await clickMapAtOffset(this.page, px, 0)
})

When('地図の中央から左に {int}px の位置をクリックする', async function (this: CustomWorld, px: number) {
  await clickMapAtOffset(this.page, -px, 0)
})

When('地図の中央から上に {int}px の位置をクリックする', async function (this: CustomWorld, px: number) {
  await clickMapAtOffset(this.page, 0, -px)
})

When('地図の中央から下に {int}px の位置をクリックする', async function (this: CustomWorld, px: number) {
  await clickMapAtOffset(this.page, 0, px)
})
