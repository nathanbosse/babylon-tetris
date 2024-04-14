// Shapes.js
export const TetrisShapes: Record<string, TetrisShape> = {
  I: {
    blocks: [
      { x: -2, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ]
  },
  J: {
    blocks: [
      { x: -1, y: -1 },
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ]
  },
  L: {
    blocks: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: -1 }
    ]
  },
  O: {
    blocks: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 }
    ]
  },
  S: {
    blocks: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 }
    ]
  },
  T: {
    blocks: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 }
    ]
  },
  Z: {
    blocks: [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 0 }
    ]
  }
}
// Shapes.ts
export interface Block {
  x: number
  y: number
  color?: string
}

export interface TetrisShape {
  blocks: Block[]
}

export function createShape(type: keyof typeof TetrisShapes): TetrisShape {
  return { ...TetrisShapes[type], blocks: TetrisShapes[type].blocks.map((block) => ({ ...block })) }
}
