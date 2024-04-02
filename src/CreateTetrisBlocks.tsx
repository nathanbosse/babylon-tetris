import React from 'react'
import * as BABYLON from 'babylonjs'
import '@babylonjs/loaders'
import { Vector3, Color3 } from '@babylonjs/core'
import { GRID_START_POS, GRID_CELL_SIZE } from './TetrisGame'
const LEFT_EYE_LAYER = 0x10000000 // Bitmask for the left eye layer
const RIGHT_EYE_LAYER = 0x20000000 // Bitmask for the right eye layer
const UI_GAME_BOARD_LAYER = 0x40000000 // Bitmask for UI/game board layer
export const CreateTetrisBlocks = ({ gameState, isRightCamera }) => {
  return (
    <>
      <>
        {gameState.currentBlock.blocks.map((block, index) => (
          <box
            keby={index}
            name={`block-${index}`}
            size={GRID_CELL_SIZE}
            layer={LEFT_EYE_LAYER}
            layerMask={LEFT_EYE_LAYER}
            isVisible={isRightCamera} // Control visibility based on state
            position={new Vector3(GRID_START_POS.x + block.x * GRID_CELL_SIZE, GRID_START_POS.y - block.y * GRID_CELL_SIZE, 0)}
            color={Color3.Random()}
          />
        ))}
        {/* Render placed blocks in the grid */}
        {gameState.grid.map((row, rowIndex) =>
          row.map(
            (cell, colIndex) =>
              cell && (
                <box
                  key={`placed-block-${rowIndex}-${colIndex}`}
                  name={`placed-block-${rowIndex}-${colIndex}`}
                  size={GRID_CELL_SIZE}
                  layerMask={RIGHT_EYE_LAYER} // Use UI_GAME_BOARD_LAYER for static blocks
                  position={new Vector3(GRID_START_POS.x + colIndex * GRID_CELL_SIZE, GRID_START_POS.y - rowIndex * GRID_CELL_SIZE, 0)}
                  color={Color3.Random()} // Or use a specific color based on the block type
                />
              )
          )
        )}
      </>
    </>
  )
}
