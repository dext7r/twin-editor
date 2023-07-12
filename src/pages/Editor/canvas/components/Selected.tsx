import type { FC, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { TransformControls } from '@react-three/drei'
import type { Box3, Vector3 } from 'three'

import type { MeshType, ModelType } from '@/type/SchemaType'
import store from '@/store'

interface SelectdCubeProps {
  children: ReactNode
  cube: MeshType | ModelType
  cubeType: CubeType
  currentPosition: number[]
  currentBoundingBox?: Box3 | null
  setCurrentPosition: (position: number[]) => void
}

type TransformControlsModeType = 'translate' | 'rotate' | 'scale'

enum TransformControlsModeItem {
  translate = 'translate',
  rotate = 'rotate',
  scale = 'scale',
}

export enum CubeType {
  'mesh' = 'mesh',
  'model' = 'model',
}

const SelectdCube: FC<SelectdCubeProps> = ({ children, cube, cubeType, currentPosition, currentBoundingBox, setCurrentPosition }) => {
  const transform = useRef(null)
  const [transformControlsMode, setTransformControlsMode] = useState<TransformControlsModeType>(TransformControlsModeItem.translate)
  const [isSelected, setIsSelected] = useState(false)
  const schemaStore = store.schemaStore()

  useEffect(() => {
    if (schemaStore.currentSelectedMesh?.uid !== cube.uid)
      setIsSelected(false)
  }, [schemaStore.currentSelectedMesh])

  const handleSelected = () => {
    if (!(schemaStore.currentSelectedMesh?.uid === cube.uid)) {
      schemaStore.setCurrentSelectedMesh(cube)
      setIsSelected(true)
    }
  }

  /**
   * update cube store and component state
   */
  const handleTransformControlsMouseUp = () => {
    const object = (transform.current! as any).object
    setCurrentPosition(object.position)

    if (cubeType === CubeType.mesh) {
      schemaStore.updateMesh(
        cube.uid,
        {
          ...(cube as MeshType),
          position: object.position,
        },
      )
    }

    if (cubeType === CubeType.model) {
      schemaStore.updateModel(
        cube.uid,
        {
          ...(cube as ModelType),
          position: object.position,
        },
      )
    }

    schemaStore.setCurrentSelectedMesh(cube)
  }

  return (
    <group onClick={() => handleSelected()}>
      {
        isSelected
          ? (
            <TransformControls size={1} position={currentPosition as unknown as Vector3} onMouseUp={handleTransformControlsMouseUp} enabled={true}
              ref={transform}
              mode={transformControlsMode} >
              <group>
                {children as any}
                { currentBoundingBox && <box3Helper box={currentBoundingBox}/>}
              </group>

            </TransformControls>
            )
          : (
            <group position={currentPosition as unknown as Vector3}>
              {children}
            </group>
            )
      }

    </group>
  )
}

export default SelectdCube
