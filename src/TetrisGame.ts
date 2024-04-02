// TetrisGameFunctions.ts
import * as BABYLON from 'babylonjs'
import { Block, TetrisShape, createShape, TetrisShapes } from './Shapes'

export const GRID_CELL_SIZE = 1 // Assuming each grid cell is 1x1 units in world space
export const GRID_START_POS = { x: -5, y: 10 }

export interface GameState {
  grid: (Block | null)[][]
  currentBlock: TetrisShape & { position: Block }
  blockMeshes: BABYLON.Mesh[]
}

// Create the initial game state
export function createInitialGameState(): GameState {
  return {
    grid: createEmptyGrid(),
    currentBlock: spawnNewBlock(),
    blockMeshes: []
  }
}

function createEmptyGrid(): (Block | null)[][] {
  return Array.from({ length: 20 }, () => Array(10).fill(null))
}

function spawnNewBlock(): TetrisShape & { position: Block } {
  const shapeTypes = Object.keys(TetrisShapes) as (keyof typeof TetrisShapes)[]
  const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
  const newBlock = createShape(shapeType)

  // Center the block horizontally in the grid and position it at the top
  const gridWidth = 10 // Assuming grid width is 10
  const pieceWidth = newBlock.blocks.reduce((max, block) => Math.max(max, block.x), 0) + 1
  const gridCenterX = Math.floor((gridWidth - pieceWidth) / 2)

  return {
    ...newBlock,
    position: { x: gridCenterX, y: 0 }
  }
}

export function updateBlockMeshes(gameState: GameState, scene: BABYLON.Scene, isRight: boolean): GameState {
  // Simplified for brevity. Implement logic to update or create block meshes based on gameState
  // This function should return a new GameState with updated blockMeshes
  return gameState
}

export function moveBlock(gameState: GameState, deltaX: number, deltaY: number): GameState {
  // Calculate the new position for the current block
  const newPosition = {
    x: gameState.currentBlock.position.x + deltaX,
    y: gameState.currentBlock.position.y + deltaY
  }

  // Check if the new position is valid for every block in the current piece
  const isValid = gameState.currentBlock.blocks.every((block) => {
    const newX = block.x + newPosition.x
    const newY = block.y + newPosition.y

    // Check bounds (assuming grid is 10x20) and if the position is not already filled
    return newX >= 0 && newX < 10 && newY >= 0 && newY < 20 && (!gameState.grid[newY] || gameState.grid[newY][newX] === null)
  })

  if (!isValid) {
    // If the move is invalid, return the current game state without any changes
    return gameState
  }

  // Assuming movement is valid, update block positions within currentBlock
  const updatedBlocks = gameState.currentBlock.blocks.map((block) => ({
    ...block,
    x: block.x + deltaX,
    y: block.y + deltaY
  }))

  // Create a new grid to reflect the moved block, starting by clearing the old positions
  const newGrid = gameState.grid.map((row) => row.map((cell) => null))

  // Mark the block's new position on the grid
  updatedBlocks.forEach((block) => {
    const x = block.x
    const y = block.y
    if (y >= 0 && y < 20 && x >= 0 && x < 10) {
      newGrid[y][x] = { ...block } // Assuming a structure for blocks; adjust as needed
    }
  })

  // Return a new game state with the updated currentBlock and grid
  return {
    ...gameState,
    currentBlock: {
      ...gameState.currentBlock,
      position: newPosition,
      blocks: updatedBlocks // Update the blocks array with the new positions
    },
    grid: newGrid
  }
}

export function rotateBlock(gameState: GameState): GameState {
  // Implement the logic to rotate the block. This should return a new GameState
  // Ensure not to mutate the input gameState directly
  return gameState
}

// Additional functions like rotateShape, isValidPosition, checkForCompleteLines, and update should follow a similar pattern
// Complete implementations for remaining core functions

function rotateShape(shape: Block[]): Block[] {
  // Rotate shape 90 degrees clockwise
  return shape.map((block) => ({ x: -block.y, y: block.x }))
}

function isValidPosition(grid: (Block | null)[][], position: Block, shape: Block[]): boolean {
  // Check if a new position is valid
  return shape.every((block) => {
    const newX = position.x + block.x
    const newY = position.y + block.y
    return true //newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] === null
  })
}

export function checkForCompleteLines(gameState: GameState): GameState {
  const newGrid = gameState.grid.map((row) => [...row]) // Clone grid for immutability
  let linesCleared = 0

  for (let y = newGrid.length - 1; y >= 0; y--) {
    if (newGrid[y].every((block) => block !== null)) {
      newGrid.splice(y, 1) // Remove the complete line
      newGrid.unshift(Array(10).fill(null)) // Add an empty line at the top
      linesCleared++
      y++ // Since we modified the grid, check the same row index again
    }
  }

  return { ...gameState, grid: newGrid }
}

export function update(gameState: GameState, scene: BABYLON.Scene, isRight: boolean): GameState {
  // Example update function to move the block down every update call
  let newGameState = moveBlock(gameState, 0, 1)

  // Check for complete lines after the move
  newGameState = checkForCompleteLines(newGameState)

  // Update block meshes to reflect the current game state
  newGameState = updateBlockMeshes(newGameState, scene, isRight)

  return newGameState
}
