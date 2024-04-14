import React, { useContext } from 'react'
import { UI_GAME_BOARD_LAYER } from './constants'
export const Scoreboard: React.FC<any> = ({ gameState }) => {
  const { linesCleared } = gameState

  return (
    <gui3DManager>
      <cylinderPanel name="panel" margin={0.2}>
        {Array.from(new Array(50), (_, index) => index).map((number) => {
          return (
            <holographicButton
              layerMask={UI_GAME_BOARD_LAYER}
              key={`btn-${number}`}
              name={`btn-name-${number}`}
              text={`btn-text-${number}`}
            />
          )
        })}
      </cylinderPanel>
    </gui3DManager>
  )
}
