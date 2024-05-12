import * as React from 'react'
import { Plane, AdvancedDynamicTexture, StackPanel, Rectangle, Button, TextBlock } from 'react-babylonjs'
import { Vector3 } from '@babylonjs/core'
import { UI_GAME_BOARD_LAYER } from './constants'

export const Scoreboard = ({ gameState }) => {
  const { linesCleared } = gameState

  const onStart = () => alert('Game started!')
  const onReset = () => alert('Game reset!')

  return (
    <Plane
      name="scoreboard-plane"
      size={10} // Increased size for better readability
      position={new Vector3(-9, 3, 0)} // Adjusted for visibility in your scene
      layerMask={UI_GAME_BOARD_LAYER}>
      <AdvancedDynamicTexture name="scoreboard-texture" createForParentMesh={true} height={1024} width={1024}>
        <Rectangle
          name="scoreboard-rect"
          heightInPixels={600} // Increased height for a larger display
          widthInPixels={800} // Increased width for a larger display
          thickness={4}
          cornerRadius={30}
          background="grey">
          <StackPanel isVertical={true} widthInPixels={750} heightInPixels={550}>
            <TextBlock text={`Score: ${linesCleared}`} color="white" fontSize={40} heightInPixels={150} /> // Larger text
            <Button name="startButton" widthInPixels={700} heightInPixels={150} background="blue" onPointerDownObservable={onStart}>
              <TextBlock text="Start" color="white" fontSize={40} />
            </Button>
            <Button name="resetButton" widthInPixels={700} heightInPixels={150} background="red" onPointerDownObservable={onReset}>
              <TextBlock text="Reset" color="white" fontSize={40} />
            </Button>
          </StackPanel>
        </Rectangle>
      </AdvancedDynamicTexture>
    </Plane>
  )
}
