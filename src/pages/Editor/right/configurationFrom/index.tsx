import type { FC } from 'react'
import { useMemo } from 'react'
import { Input, InputNumber } from 'antd'
import type { Vector3 } from 'three'
import { produce } from 'immer'

import type { SelectCubeType } from '@/store/schema'
import store from '@/store'
import type { BaseConfigTypeItem, MeshType, ModelType } from '@/type/SchemaType'

interface ConfigurationFormProps {
  currentCubeSchema: SelectCubeType
}

interface BaseConfigDataType {
  position: Vector3
  rotation?: Vector3
  scale?: Vector3
}

const ConfigurationForm: FC<ConfigurationFormProps> = ({ currentCubeSchema }) => {
  const { updateMesh, updateModel } = store.schemaStore(state => state)
  const isModelData = useMemo(() => {
    // eslint-disable-next-line no-prototype-builtins
    return currentCubeSchema && currentCubeSchema.hasOwnProperty('source')
  }, [currentCubeSchema])

  const handleBaseConfigItemChange = (value: any, name: string, axle: string) => {
    const currentCubeNode = currentCubeSchema

    if (currentCubeNode && (currentCubeNode as any)[name]) {
      const nextCubeNodeState = produce(currentCubeNode, (draft) => {
        (draft as any)[name][axle] = value
      })

      if (isModelData) {
        updateModel(
          currentCubeSchema.uid,
          nextCubeNodeState as ModelType,
        )
      }
      else {
        updateMesh(
          currentCubeSchema.uid,
          nextCubeNodeState as MeshType,
        )
      }
    }
  }

  const renderBaseConfigItem = (baseConfig: BaseConfigTypeItem, value?: Vector3) => {
    switch (baseConfig.type) {
      case 'input':
        return (
          <div className='flex flex-col'>
            <span className='text-sm'>{baseConfig.label} :</span>
            <Input className='mt-1 w-16 ' value={0}/>
          </div>
        )
      case 'input-xyz':
        return (
          <div className='flex flex-col'>
            <span className='text-sm'>{baseConfig.label} :</span>
            <div className='mt-1'>
              <InputNumber onChange={value => handleBaseConfigItemChange(value, baseConfig.name, 'x')} value={value?.x.toFixed(2) || 1} className='w-16 mr-2' controls={false}/>
              <InputNumber onChange={value => handleBaseConfigItemChange(value, baseConfig.name, 'y')} value={value?.y.toFixed(2) || 1} className='w-16 mr-2' controls={false}/>
              <InputNumber onChange={value => handleBaseConfigItemChange(value, baseConfig.name, 'z')} value={value?.z.toFixed(2) || 1} className='w-16' controls={false}/>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderBaseConfig = (baseConfig: BaseConfigTypeItem[], baseConfigData: BaseConfigDataType) => {
    return baseConfig.map((item) => {
      return (
        <div className='mt-2' key={item.name}>
          { renderBaseConfigItem(item, baseConfigData[item.name])}
        </div>
      )
    })
  }

  return (
    <div className='p-2'>
      基本配置信息
      <div>
        {currentCubeSchema && renderBaseConfig(currentCubeSchema.baseConfig, {
          position: currentCubeSchema.position,
          rotation: currentCubeSchema.rotation,
          scale: currentCubeSchema.scale,
        })}
      </div>
    </div>
  )
}

export default ConfigurationForm
