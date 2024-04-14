import * as React from 'react'
import { Vector3, Color3 } from '@babylonjs/core'
import { UI_GAME_BOARD_LAYER, GRID_CELL_SIZE, GRID_HEIGHT, GRID_WIDTH } from './constants'

export const CreateGridBoundary: React.FC = () => {
  const thickness = 0.1 // Thickness of the boundary lines
  const height = GRID_CELL_SIZE * GRID_HEIGHT
  const width = GRID_CELL_SIZE * GRID_WIDTH

  // Center positions for grid boundary placement
  const topPositionY = (GRID_CELL_SIZE * GRID_HEIGHT) / 2
  const bottomPositionY = -(GRID_CELL_SIZE * GRID_HEIGHT) / 2
  const leftPositionX = -(GRID_CELL_SIZE * GRID_WIDTH) / 2
  const rightPositionX = (GRID_CELL_SIZE * GRID_WIDTH) / 2

  return (
    <>
      {/* Top boundary */}
      <box
        name="topBoundary"
        width={width}
        height={thickness}
        depth={1}
        position={new Vector3(0, topPositionY + thickness / 2, 0)}
        layerMask={UI_GAME_BOARD_LAYER}
      />
      {/* Bottom boundary */}
      <box
        name="bottomBoundary"
        width={width}
        height={thickness}
        depth={1}
        position={new Vector3(0, bottomPositionY - thickness / 2, 0)}
        layerMask={UI_GAME_BOARD_LAYER}
      />
      {/* Left boundary */}
      <box
        name="leftBoundary"
        width={thickness}
        height={height}
        depth={1}
        position={new Vector3(leftPositionX - thickness / 2, 0, 0)}
        layerMask={UI_GAME_BOARD_LAYER}
      />
      {/* Right boundary */}
      <box
        name="rightBoundary"
        width={thickness}
        height={height}
        depth={1}
        position={new Vector3(rightPositionX + thickness / 2, 0, 0)}
        layerMask={UI_GAME_BOARD_LAYER}
      />
    </>
  )
}
