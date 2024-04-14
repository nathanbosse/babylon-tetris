import React from 'react'
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
          layerMask={LEFT_EYE_LAYER}
          position={
            new Vector3(
              (block.x - GRID_WIDTH / 2) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2, // Centering block in the cell
              (GRID_HEIGHT / 2 - block.y) * GRID_CELL_SIZE - GRID_CELL_SIZE / 2, // Centering block in the cell
              0
            )
          }
          color={Color3.Random()}
        />
      ))}
      {gameState.grid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <box
              key={`placed-block-${rowIndex}-${colIndex}`}
              name={`placed-block-${rowIndex}-${colIndex}`}
              size={GRID_CELL_SIZE}
              layerMask={RIGHT_EYE_LAYER}
              position={
                new Vector3(
                  (colIndex - GRID_WIDTH / 2) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2, // Adjust for centering
                  (GRID_HEIGHT / 2 - rowIndex) * GRID_CELL_SIZE - GRID_CELL_SIZE / 2, // Adjust for centering
                  0
                )
              }
              color={cell.color || Color3.Random()}
            />
          ) : null
        )
      )}
    </>
  )
}
