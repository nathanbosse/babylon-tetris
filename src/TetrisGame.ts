import { Block, TetrisShape, createShape, TetrisShapes } from './Shapes'
import { GRID_HEIGHT, GRID_WIDTH } from './constants'

export interface GameState {
  grid: (Block | null)[][]
  currentBlock: TetrisShape & { position: Block }
}

// Create the initial game state
export function createInitialGameState(): GameState {
  return {
    grid: createEmptyGrid(),
    currentBlock: spawnNewBlock()
  }
}

function createEmptyGrid(): (Block | null)[][] {
  return Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null))
}

function spawnNewBlock(): TetrisShape & { position: Block } {
  const shapeTypes = Object.keys(TetrisShapes) as (keyof typeof TetrisShapes)[]
  const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
  const newBlock = createShape(shapeType)

  const pieceWidth = Math.max(...newBlock.blocks.map((block) => block.x)) + 1 // +1 for 0 index
  const gridCenterX = Math.floor((GRID_WIDTH / 2 - pieceWidth) / 2)
  const gridTopY = 0 // Start from the top

  return {
    ...newBlock,
    position: { x: gridCenterX, y: gridTopY }, // Start from the top
    blocks: newBlock.blocks.map((block) => ({
      ...block,
      x: block.x + gridCenterX,
      y: block.y + gridTopY
    }))
  }
}

export function moveBlock(gameState: GameState, deltaX: number, deltaY: number): GameState {
  // Calculate new position for each block in the shape
  const newPosition = {
    x: gameState.currentBlock.position.x + deltaX,
    y: gameState.currentBlock.position.y + deltaY
  }

  // Check if the new position for each block is valid
  const isValid = gameState.currentBlock.blocks.every((block) => {
    const newX = block.x + deltaX
    const newY = block.y + deltaY
    return isPositionValid(gameState.grid, newX, newY)
  })

  // If valid, update block position; else, keep the state unchanged
  if (isValid) {
    const newState = {
      ...gameState,
      currentBlock: {
        ...gameState.currentBlock,
        position: newPosition,
        blocks: gameState.currentBlock.blocks.map((block) => ({
          ...block,
          x: block.x + deltaX,
          y: block.y + deltaY
        }))
      }
    }
    return newState
  } else {
    // If the move is invalid (e.g., out of bounds or into another block), do not move the block
    return gameState
  }
}

function isPositionValid(grid: (Block | null)[][], x: number, y: number): boolean {
  return !(x < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT || (y >= 0 && grid[y][x] !== null))
}

function integrateBlockIntoGrid(gameState: GameState): (Block | null)[][] {
  // Clone the current grid to avoid direct modifications
  const newGrid = gameState.grid.map((row) => [...row])

  // Integrate the current block into the grid
  gameState.currentBlock.blocks.forEach((block) => {
    const x = block.x
    const y = block.y
    // Make sure the coordinates are within the grid
    if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
      newGrid[y][x] = { ...block } // Place a copy of the block in the grid
    }
  })

  return newGrid
}

export function rotateBlock(gameState: GameState): GameState {
  const rotatedBlocks = rotateShape(gameState.currentBlock.blocks)

  const isValid = rotatedBlocks.every((block) => {
    const newX = gameState.currentBlock.position.x + block.x
    const newY = gameState.currentBlock.position.y + block.y
    return isPositionValid(gameState.grid, newX, newY)
  })

  if (isValid) {
    return {
      ...gameState,
      currentBlock: {
        ...gameState.currentBlock,
        blocks: rotatedBlocks
      }
    }
  }

  return gameState
}

function rotateShape(blocks: Block[]): Block[] {
  // Rotate shape 90 degrees clockwise
  return blocks.map((block) => ({ x: -block.y, y: block.x }))
}

export function checkForCompleteLines(gameState: GameState): GameState {
  const newGrid = gameState.grid.map((row) => row.slice())
  let linesCleared = 0

  for (let y = 0; y < GRID_HEIGHT; y++) {
    if (newGrid[y].every((cell) => cell !== null)) {
      newGrid.splice(y, 1)
      newGrid.unshift(new Array(GRID_WIDTH).fill(null))
      linesCleared++
    }
  }

  return {
    ...gameState,
    grid: newGrid
  }
}

export function update(gameState: GameState): GameState {
  // Attempt to move the block down; if it can't move down, integrate it into the grid
  let newState = moveBlock(gameState, 0, 1)
  if (newState === gameState) {
    // Block couldn't move down, integrate it and spawn a new block
    const newGrid = integrateBlockIntoGrid(gameState)
    newState = {
      ...gameState,
      grid: newGrid,
      currentBlock: spawnNewBlock()
    }
  }
  newState = checkForCompleteLines(newState)
  logOccupiedGrid(newState)
  return newState
}

export function logOccupiedGrid(gameState: GameState): void {
  const { grid, currentBlock } = gameState
  grid.forEach((row, rowIndex) => {
    let rowString = ''
    row.forEach((cell, colIndex) => {
      if (cell) {
        rowString += 'X ' // Render 'X' for occupied cells
      } else if (currentBlock.blocks.some((block) => block.x === colIndex && block.y === rowIndex)) {
        rowString += 'B ' // Render 'B' for the falling block
      } else {
        rowString += '. ' // Render '.' for empty cells
      }
    })
    console.log(`Row ${rowIndex}: ${rowString}`)
  })
}
