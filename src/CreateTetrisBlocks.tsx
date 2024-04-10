import React from 'react'
import * as BABYLON from 'babylonjs'
import '@babylonjs/loaders'
import { Vector3, Color3 } from '@babylonjs/core'
import { RIGHT_EYE_LAYER, LEFT_EYE_LAYER, GRID_CELL_SIZE, GRID_HEIGHT, GRID_WIDTH } from './constants'

export const CreateTetrisBlocks = ({ gameState }) => {
  return (
    <>
      {gameState.currentBlock.blocks.map((block, index) => (
        <box
          key={index}
          name={`block-${index}`}
          size={GRID_CELL_SIZE}
          layerMask={LEFT_EYE_LAYER} // Ensure visibility on the left eye and UI/game board layer
          position={new Vector3(block.x, block.y, 0)}
          color={Color3.Random()}
        />
      ))}
      {/* Render placed blocks in the grid */}
      {gameState.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <box
              key={`placed-block-${rowIndex}-${colIndex}`}
              name={`placed-block-${rowIndex}-${colIndex}`}
              size={GRID_CELL_SIZE}
              layerMask={RIGHT_EYE_LAYER} // Use the right eye and UI/game board layer for placed blocks
              position={
                new Vector3(
                  (colIndex - GRID_WIDTH / 2) * GRID_CELL_SIZE, // Adjusting x position to Babylon grid
                  (GRID_HEIGHT / 2 - rowIndex) * GRID_CELL_SIZE, // Adjusting y position to Babylon grid and inverting y-axis
                  0
                )
              }
              color={cell.color || Color3.Random()} // Assuming cell contains color information; otherwise, random color
            />
          ) : null
        )
      )}
    </>
  )
}
