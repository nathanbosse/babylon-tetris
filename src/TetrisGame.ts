import * as BABYLON from 'babylonjs'
import { Block, TetrisShape, createShape, TetrisShapes } from './Shapes'

export const GRID_CELL_SIZE = 1 // Assuming each grid cell is 1x1 units in world space
export const GRID_WIDTH = 10
export const GRID_HEIGHT = 20
export const GRID_START_POS = { x: -5, y: 10 } // Adjust as needed

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
  return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null))
}

function spawnNewBlock(): TetrisShape & { position: Block } {
  const shapeTypes = Object.keys(TetrisShapes) as (keyof typeof TetrisShapes)[]
  const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
  const newBlock = createShape(shapeType)

  // Center the block horizontally in the grid and position it at the top
  const minX = Math.min(...newBlock.blocks.map((block) => block.x))
  const maxX = Math.max(...newBlock.blocks.map((block) => block.x))
  const pieceWidth = maxX - minX + 1
  const gridCenterX = Math.floor((GRID_WIDTH - pieceWidth) / 2) - minX

  const adjustedBlocks = newBlock.blocks.map((block) => ({
    ...block,
    x: block.x + gridCenterX,
    y: block.y
  }))

  return {
    ...newBlock,
    position: { x: gridCenterX, y: 0 },
    blocks: adjustedBlocks
  }
}

export function updateBlockMeshes(gameState: GameState, scene: BABYLON.Scene, isRight: boolean): GameState {
  // Implementation for updating block meshes based on the current game state
  // This function should ideally update gameState.blockMeshes based on gameState.currentBlock
  return gameState
}

export function moveBlock(gameState: GameState, deltaX: number, deltaY: number): GameState {
  const newPosition = {
    x: gameState.currentBlock.position.x + deltaX,
    y: gameState.currentBlock.position.y + deltaY
  }

  const isValid = gameState.currentBlock.blocks.every((block) => {
    const newX = newPosition.x + block.x
    const newY = newPosition.y + block.y
    return (
      newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT && (!gameState.grid[newY] || gameState.grid[newY][newX] === null)
    )
  })

  if (isValid) {
    const updatedBlocks = gameState.currentBlock.blocks.map((block) => ({
      ...block,
      x: block.x + deltaX,
      y: block.y + deltaY
    }))

    return {
      ...gameState,
      currentBlock: {
        ...gameState.currentBlock,
        position: newPosition,
        blocks: updatedBlocks
      }
    }
  } else {
    // If the move is invalid or the block has settled, integrate it into the grid
    // and spawn a new block
    const newGrid = integrateBlockIntoGrid(gameState)
    return {
      ...gameState,
      grid: newGrid,
      currentBlock: spawnNewBlock()
    }
  }
}

function integrateBlockIntoGrid(gameState: GameState): (Block | null)[][] {
  const newGrid = createEmptyGrid()
  gameState.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (cell !== null) newGrid[y][x] = cell
    })
  )

  gameState.currentBlock.blocks.forEach((block) => {
    const x = gameState.currentBlock.position.x + block.x
    const y = gameState.currentBlock.position.y + block.y
    if (x >= 0 && x < GRID_WIDTH && y >= 0 && y < GRID_HEIGHT) {
      newGrid[y][x] = block
    }
  })
  return newGrid
}

// Additional functions such as rotateBlock, update, and others would follow the same pattern,
// making use of the GRID_WIDTH and GRID_HEIGHT constants to ensure consistency.
export function rotateBlock(gameState: GameState): GameState {
  // Calculate new orientation for the current block after rotation
  const rotatedBlocks = rotateShape(gameState.currentBlock.blocks)

  // Check if the rotated position is valid
  const isValid = rotatedBlocks.every((block) => {
    const newX = gameState.currentBlock.position.x + block.x
    const newY = gameState.currentBlock.position.y + block.y
    return (
      newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT && (!gameState.grid[newY] || gameState.grid[newY][newX] === null)
    )
  })

  if (isValid) {
    // Apply rotation
    return {
      ...gameState,
      currentBlock: {
        ...gameState.currentBlock,
        blocks: rotatedBlocks
      }
    }
  }

  // If rotation is not valid, return the original state
  return gameState
}

function rotateShape(blocks: Block[]): Block[] {
  // Rotate shape 90 degrees clockwise
  return blocks.map((block) => ({ x: -block.y, y: block.x }))
}

export function checkForCompleteLines(gameState: GameState): GameState {
  const newGrid = gameState.grid.map((row) => row.slice()) // Clone the grid
  let linesCleared = 0

  for (let y = 0; y < GRID_HEIGHT; y++) {
    if (newGrid[y].every((cell) => cell !== null)) {
      newGrid.splice(y, 1) // Remove the complete line
      newGrid.unshift(new Array(GRID_WIDTH).fill(null)) // Add an empty line at the top
      linesCleared++
    }
  }

  // Optional: Add score calculation based on linesCleared

  return {
    ...gameState,
    grid: newGrid
  }
}

export function update(gameState: GameState, scene: BABYLON.Scene, isRight: boolean): GameState {
  // Simplified update function: move the block down and check for settled block
  gameState = moveBlock(gameState, 0, 1)

  // After moving the block, check if any lines are completed
  gameState = checkForCompleteLines(gameState)

  // Update block meshes to reflect the new game state
  gameState = updateBlockMeshes(gameState, scene, isRight)

  return gameState
}

export function createBlockMeshes(gameState: GameState, scene: BABYLON.Scene): void {
  // Create or update meshes for currentBlock
  // This function would ideally iterate over gameState.currentBlock.blocks and create/update BABYLON.Meshes accordingly
}
