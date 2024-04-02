// TetrisGame.ts
import { Block, TetrisShape, createShape, TetrisShapes } from './Shapes'
import * as BABYLON from 'babylonjs'

export const GRID_CELL_SIZE = 1 // Assuming each grid cell is 1x1 units in world space
export const GRID_START_POS = { x: -5, y: 10 }

export class TetrisGame {
  grid: (Block | null)[][]
  currentBlock: TetrisShape & { position: Block }
  blockMeshes: BABYLON.Mesh[] = []
  constructor() {
    this.grid = this.createEmptyGrid()
    this.currentBlock = this.spawnNewBlock()
    this.blockMeshes = []
  }

  createEmptyGrid(): (Block | null)[][] {
    return Array.from({ length: 20 }, () => Array(10).fill(null))
  }

  updateBlockMeshes(scene: BABYLON.Scene, isRight: boolean) {
    // Ensure we have a mesh for each block in the current piece
    while (this.blockMeshes.length < this.currentBlock.blocks.length) {
      const mesh = BABYLON.MeshBuilder.CreateBox('block', { size: 1 }, scene)
      this.blockMeshes.push(mesh)
    }
    // Update positions of existing meshes
    this.currentBlock.blocks.forEach((block, index) => {
      const mesh = this.blockMeshes[index]
      mesh.position.x = GRID_START_POS.x + block.x * GRID_CELL_SIZE
      mesh.position.y = GRID_START_POS.y - block.y * GRID_CELL_SIZE
      mesh.isVisible = !isRight ? true : false
    })
    // Hide any extra meshes
    for (let i = this.currentBlock.blocks.length; i < this.blockMeshes.length; i++) {
      this.blockMeshes[i].isVisible = false
    }
  }

  spawnNewBlock(): TetrisShape & { position: Block } {
    const shapeTypes = Object.keys(TetrisShapes) as (keyof typeof TetrisShapes)[]
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
    const newBlock = createShape(shapeType)

    // Center the block horizontally in the grid and position it at the top
    const gridWidth = this.grid[0].length
    const pieceWidth = newBlock.blocks.reduce((max, block) => Math.max(max, block.x), 0) + 1 // +1 since positions start at 0
    const gridCenterX = Math.floor((gridWidth - pieceWidth) / 2)
    const positionedBlocks = newBlock.blocks.map((block) => ({
      ...block,
      x: block.x + gridCenterX,
      y: block.y // Adjust if needed based on how you want the pieces to spawn
    }))

    return { ...newBlock, blocks: positionedBlocks, position: { x: gridCenterX, y: 0 } }
  }

  moveBlock(deltaX: number, deltaY: number): void {
    // Calculate the new position for each block in the current piece
    const newPositions = this.currentBlock.blocks.map((block) => ({
      x: block.x + deltaX,
      y: block.y + deltaY
    }))

    // Check if the new position is valid for every block in the piece
    const isValid = newPositions.every((pos) =>
      this.isValidPosition({
        x: this.currentBlock.position.x + pos.x,
        y: this.currentBlock.position.y + pos.y
      })
    )

    if (isValid) {
      // Update the position of the current piece
      this.currentBlock.position.x += deltaX
      this.currentBlock.position.y += deltaY

      // Update the positions of all blocks within the piece
      this.currentBlock.blocks = newPositions
    }
  }

  rotateBlock(): void {
    const newShape = this.rotateShape(this.currentBlock.blocks)
    if (this.isValidPosition(this.currentBlock.position, newShape)) {
      this.currentBlock.blocks = newShape
    }
  }

  rotateShape(shape: Block[]): Block[] {
    // Rotate shape 90 degrees
    return shape.map((p) => ({ x: -p.y, y: p.x }))
  }

  isValidPosition(position: Block, shape: Block[] = this.currentBlock.blocks): boolean {
    // Check if the new position is valid
    return shape.every((block) => {
      const newX = position.x + block.x
      const newY = position.y + block.y
      return true // newX >= 0 && newX < 10 && newY >= 0 && newY <= 21
      // && !this.grid[newY][newX]
    })
  }

  checkForCompleteLines(): void {
    // Implement logic to check for complete lines
  }

  update(): void {
    // Game update logic, e.g., move the current block down by 1 unit
    this.moveBlock(0, 1)
    // Check for collision with the bottom or other blocks
  }
}
