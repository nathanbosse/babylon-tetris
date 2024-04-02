import React from 'react'

import * as BABYLON from 'babylonjs'
import '@babylonjs/loaders'
import { Vector3, Color3 } from '@babylonjs/core'
import { GRID_START_POS, GRID_CELL_SIZE } from './TetrisGame'

const LEFT_EYE_LAYER = 0x10000000 // Bitmask for the left eye layer
const RIGHT_EYE_LAYER = 0x20000000 // Bitmask for the right eye layer
const UI_GAME_BOARD_LAYER = 0x40000000 // Bitmask for UI/game board layer
export const CreateGridBoundary = () => {
  const thickness = 0.1 // Thickness of the boundary lines
  const height = GRID_CELL_SIZE * 20 // Assuming 20 rows, each GRID_CELL_SIZE units tall
  const width = GRID_CELL_SIZE * 10 // Assuming 10 columns, each GRID_CELL_SIZE units wide

  const topPositionY = GRID_START_POS.y + GRID_CELL_SIZE / 2
  const bottomPositionY = GRID_START_POS.y - height - GRID_CELL_SIZE / 2
  const leftPositionX = GRID_START_POS.x - GRID_CELL_SIZE / 2
  const rightPositionX = GRID_START_POS.x + width - GRID_CELL_SIZE / 2

  return (
    <>
      {/* Top Boundary */}
      <box
        name="topBoundary"
        width={width}
        layerMask={UI_GAME_BOARD_LAYER}
        height={thickness}
        depth={1}
        position={new Vector3(GRID_START_POS.x + width / 2 - GRID_CELL_SIZE / 2, topPositionY, 0)}
        color={new Color3(1, 0, 0)}
      />

      {/* Bottom Boundary */}
      <box
        name="bottomBoundary"
        layerMask={UI_GAME_BOARD_LAYER}
        width={width}
        height={thickness}
        depth={1}
        position={new Vector3(GRID_START_POS.x + width / 2 - GRID_CELL_SIZE / 2, bottomPositionY, 0)}
        color={new Color3(1, 0, 0)}
      />

      {/* Left Boundary */}
      <box
        name="leftBoundary"
        width={thickness}
        layerMask={UI_GAME_BOARD_LAYER}
        height={height + GRID_CELL_SIZE}
        depth={1}
        position={new Vector3(leftPositionX, GRID_START_POS.y - height / 2, 0)}
        color={new Color3(1, 0, 0)}
      />

      {/* Right Boundary */}
      <box
        name="rightBoundary"
        width={thickness}
        layerMask={UI_GAME_BOARD_LAYER}
        height={height + GRID_CELL_SIZE}
        depth={1}
        position={new Vector3(rightPositionX, GRID_START_POS.y - height / 2, 0)}
        color={new Color3(1, 0, 0)}
      />
    </>
  )
}
