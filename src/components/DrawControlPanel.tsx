import { DrawMode, DrawModeSelector } from './DrawModeSelector'
import './DrawControlPanel.css'

type DrawControlPanelProps = {
  drawMode: DrawMode
  helperText: string
  isDrawingPath: boolean
  draftCount: number
  canFinalizeDraft: boolean
  onChangeMode: (mode: DrawMode) => void
  onFinalize: () => void
  onClearDraft: () => void
  featuresCount: number
}

export function DrawControlPanel({
  drawMode,
  helperText,
  isDrawingPath,
  draftCount,
  canFinalizeDraft,
  onChangeMode,
  onFinalize,
  onClearDraft,
  featuresCount
}: DrawControlPanelProps) {
  return (
    <div className='draw-control-panel'>
      <div className='draw-control-panel__header'>描画モード</div>
      <DrawModeSelector selectedMode={drawMode} onChange={onChangeMode} />
      <div className='draw-control-panel__helper'>{helperText}</div>
      {isDrawingPath && (
        <div className='draw-control-panel__draft'>
          <div className='draw-control-panel__draft-text'>
            {draftCount === 0 ? 'クリックで頂点を追加してください。' : `${draftCount} 点を記録中`}
          </div>
          <div className='draw-control-panel__draft-actions'>
            <button
              type='button'
              onClick={onFinalize}
              disabled={!canFinalizeDraft}
              className={`draw-control-panel__draft-button${canFinalizeDraft ? '' : ' draw-control-panel__draft-button--disabled'}`}
            >
              確定
            </button>
            <button
              type='button'
              onClick={onClearDraft}
              className='draw-control-panel__clear-button'
            >
              クリア
            </button>
          </div>
        </div>
      )}
      <div className='draw-control-panel__count'>{`生成済みGeoJSON: ${featuresCount} 件`}</div>
    </div>
  )
}