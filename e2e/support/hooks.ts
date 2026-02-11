import { BeforeAll, AfterAll, Before, After, setWorldConstructor } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import { ChildProcess, spawn } from 'child_process'
import { CustomWorld } from './world.js'
import { DRAW_CONTROL_PANEL } from './helpers/selectors.js'
import { waitForMapReady } from './helpers/map-helpers.js'

setWorldConstructor(CustomWorld)

const APP_URL = 'http://localhost:5173'
let viteProcess: ChildProcess

/**
 * テスト全体の前に Vite 開発サーバを起動する
 */
BeforeAll({ timeout: 60000 }, async function () {
  viteProcess = spawn('npx', ['vite', '--port', '5173'], {
    cwd: process.cwd(),
    stdio: 'pipe',
    shell: true,
  })

  // サーバが応答するまでポーリング
  const maxRetries = 30
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(APP_URL)
      if (res.ok) return
    } catch {
      // まだ起動中
    }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error('Vite 開発サーバの起動がタイムアウトしました')
})

/**
 * テスト全体の後に Vite 開発サーバを停止する
 */
AfterAll(async function () {
  if (viteProcess) {
    viteProcess.kill('SIGTERM')
  }
})

/**
 * 各シナリオの前にブラウザを起動してアプリへ遷移する
 */
Before({ timeout: 60000 }, async function (this: CustomWorld) {
  const headless = process.env.HEADLESS !== 'false'
  this.browser = await chromium.launch({
    headless,
    args: [
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
    ],
  })
  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  this.page = await this.context.newPage()
  await this.page.goto(APP_URL)
  await this.page.waitForSelector(DRAW_CONTROL_PANEL, { state: 'visible', timeout: 30000 })
  await waitForMapReady(this.page)
})

/**
 * 各シナリオの後にブラウザを終了する
 */
After(async function (this: CustomWorld) {
  await this.browser?.close()
})
