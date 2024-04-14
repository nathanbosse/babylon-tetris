import React from 'react'
import { Vector3, Color3 } from '@babylonjs/core'
import { Box, StandardMaterial } from 'react-babylonjs'
import { RIGHT_EYE_LAYER, LEFT_EYE_LAYER, GRID_CELL_SIZE, GRID_HEIGHT, GRID_WIDTH } from './constants'

export const CreateTetrisBlocks = ({ gameState }) => {
  const borderSize = GRID_CELL_SIZE // size of the outer box
  const blockSize = GRID_CELL_SIZE * 0.9 // slightly smaller size for the inner box

  return (
    <>
      {gameState.currentBlock.blocks.map((block, index) => (
        <React.Fragment key={index}>
          <Box // Outer box for border
            name={`border-${index}`}
            size={borderSize}
            layerMask={LEFT_EYE_LAYER}
            position={
              new Vector3(
                (block.x - GRID_WIDTH / 2) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
                (GRID_HEIGHT / 2 - block.y) * GRID_CELL_SIZE - GRID_CELL_SIZE / 2,
                0
              )
            }>
            <standardMaterial name={`border-mat-${index}`} diffuseColor={Color3.Black()} />
          </Box>
          <Box // Inner box for actual block color
            name={`block-${index}`}
            size={blockSize}
            layerMask={LEFT_EYE_LAYER}
            position={
              new Vector3(
                (block.x - GRID_WIDTH / 2) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
                (GRID_HEIGHT / 2 - block.y) * GRID_CELL_SIZE - GRID_CELL_SIZE / 2,
                -0.1 // slightly offset on z-axis to ensure it's visible above the border
              )
            }>
            <standardMaterial name={`mat-block-${index}`} diffuseColor={Color3.FromHexString(block.color)} />
          </Box>
        </React.Fragment>
      ))}
      {gameState.grid.map((row, rowIndex) =>
        row.map(
          (cell, colIndex) =>
            cell && (
              <React.Fragment key={`placed-block-${rowIndex}-${colIndex}`}>
                <Box // Outer box for border
                  name={`border-${rowIndex}-${colIndex}`}
                  size={borderSize}
                  layerMask={RIGHT_EYE_LAYER}
                  position={
                    new Vector3(
                      (colIndex - GRID_WIDTH / 2) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
                      (GRID_HEIGHT / 2 - rowIndex) * GRID_CELL_SIZE - GRID_CELL_SIZE / 2,
                      0
                    )
                  }>
                  <standardMaterial name={`border-mat-${rowIndex}-${colIndex}`} diffuseColor={Color3.Black()} />
                </Box>
                <Box // Inner box for actual block color
                  name={`placed-block-${rowIndex}-${colIndex}`}
                  size={blockSize}
                  layerMask={RIGHT_EYE_LAYER}
                  position={
                    new Vector3(
                      (colIndex - GRID_WIDTH / 2) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2,
                      (GRID_HEIGHT / 2 - rowIndex) * GRID_CELL_SIZE - GRID_CELL_SIZE / 2,
                      -0.1 // slightly offset on z-axis to ensure it's visible above the border
                    )
                  }>
                  <standardMaterial name={`mat-block-${rowIndex}-${colIndex}`} diffuseColor={Color3.FromHexString(cell.color)} />
                </Box>
              </React.Fragment>
            )
        )
      )}
    </>
  )
}
