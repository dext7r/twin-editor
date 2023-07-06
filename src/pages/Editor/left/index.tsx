import type { FC } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import type { Vector3 } from 'three'
import store from '@/store'

interface LeftProps {

}

interface DataSourcesType {
  label: string
  name: string
  children?: DataSourcesType[]
}

const dataSources: DataSourcesType[] = [
  {
    label: '几何体',
    name: 'structure',
    children: [
      {
        name: 'boxGeometry',
        label: '立方体',
      },
      {
        name: 'capsuleGeometry',
        label: '胶囊图',
      },
      {
        name: 'circleGeometry',
        label: '圆形',
      },
      {
        name: 'coneGeometry',
        label: '圆锥',
      },
    ],
  },
  {
    label: '模型',
    name: 'material',
    children: [
      {
        name: 'diamond',
        label: '钻石',
      },
      {
        name: 'monkey',
        label: '猴子',
      },
    ],
  },
]

const Left: FC<LeftProps> = () => {
  const [currentRenderItem, setCurrentRenderItem] = useState(dataSources[0]?.children || [])
  const [currentSelectedType, setCurrentSelectedType] = useState(dataSources[0].name)
  const schemaStore = store.schemaStore(state => state)

  const addObject = (baseItem: DataSourcesType) => {
    switch (currentSelectedType) {
      case 'structure':
        schemaStore.addMesh({
          uid: uuidv4(),
          position: {
            x: ~(Math.random() * 10).toFixed(1),
            y: ~(Math.random()).toFixed(1),
            z: ~(Math.random() * 10).toFixed(1),
          } as Vector3,
          geometry: {
            type: baseItem.name as any,
            width: 1,
            height: 1,
            depth: 1,
          },
          material: {
            type: 'meshBasicMaterial',
          },
        })
        break
      case 'material':
        schemaStore.addModel({
          uid: uuidv4(),
          position: {
            x: ~(Math.random() * 10).toFixed(1),
            y: ~(Math.random()).toFixed(1),
            z: ~(Math.random() * 10).toFixed(1),
          } as Vector3,
          type: 'gltf',
          source: './monkey.glb',
        })
        break
      default:
        break
    }
  }

  /**
   * toggle tyle
   * @param type
   */
  const toggleTyle = (type: string) => {
    setCurrentSelectedType(type)
    setCurrentRenderItem(
      dataSources.find(item => item.name === type)?.children || [],
    )
  }

  return (
    <div className='flex rounded-md' style={{ height: '100%', width: '300px' }}>
      <div className='flex flex-col pl-2 w-16' style={{ backgroundColor: 'rgba(224, 224, 224, 0.7)', width: '80px' }} >
        {dataSources.map((item) => {
          return <div onClick={() => toggleTyle(item.name)} className='mt-6 cursor-pointer text-sm' key={item.label}>{item.label}</div>
        })}
      </div>

      <div className='flex flex-wrap justify-start items-start cursor-pointer' style={{ width: '180px', backgroundColor: 'rgba(200, 200, 200, 0.7)' }}>
        {
        currentRenderItem.map((item) => {
          return <div onClick={() => addObject(item)} className='w-16 h-16 m-1 flex justify-center items-center text-sm' style={{ backgroundColor: 'rgb(221, 221, 221)' }} key={item.name}>{item.label}</div>
        })
      }
      </div>
    </div>
  )
}

export default Left
