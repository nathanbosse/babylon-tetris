import React from 'react'
import { Plane, AdvancedDynamicTexture, StackPanel, Rectangle, Button, TextBlock, Control } from 'react-babylonjs'
import { Color3, Vector3 } from '@babylonjs/core'
import { UI_GAME_BOARD_LAYER } from './constants'
import * as BABYLON from 'babylonjs'

export const Scoreboard = ({}) => {
  const onStart = () => {
    alert('onStart')
  }
  const onReset = () => {
    alert('onReset')
  }
  let layerMask = UI_GAME_BOARD_LAYER
  return (
    <Plane name="scoreboard-plane" size={5} position={new Vector3(0, 3, 0)} layerMask={layerMask}>
      <AdvancedDynamicTexture name="scoreboard-texture" createForParentMesh={true}>
        <Rectangle name="scoreboard-rect" height="100px" width="300px" thickness={2} cornerRadius={10} background="green">
          <StackPanel width="100%">
            <Button name="resetButton" width="140px" height="40px" padding="10px" background="red" onPointerDownObservable={onReset}>
              <TextBlock text="Reset" color="white" fontSize={24} />
            </Button>
            <Button name="startButton" width="140px" height="40px" padding="10px" background="blue" onPointerDownObservable={onStart}>
              <TextBlock text="Start" color="white" fontSize={24} />
            </Button>
          </StackPanel>
        </Rectangle>
      </AdvancedDynamicTexture>
    </Plane>
  )
}
