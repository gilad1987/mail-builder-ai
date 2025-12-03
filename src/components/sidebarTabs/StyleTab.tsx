import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'
import {
  BorderController,
  ColorControl,
  DimensionInput,
  HorizontalAlignControl,
  ResponsiveIcon,
  SimpleDropdownField,
  SliderField,
  SpacingControl,
} from '../controls'

export const StyleTab = observer(() => {
  const element = editorStore.selectedElement
  const elementType = element?.type || 'Element'

  return (
    <div>
      <div className="style-section__header">
        <h3 className="style-section__title">{element ? elementType : 'No Selection'}</h3>
        {!element && <p className="style-section__hint">Select an element to edit its styles</p>}
      </div>

      <SpacingControl label="Margin" />
      <SpacingControl label="Padding" />

      <div className="style-field">
        <p className="style-field__label">
          Dimensions
          <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
        </p>
        <div className="dimension-grid">
          <DimensionInput label="Width" styleProperty="width" defaultUnit="%" />
          <DimensionInput label="Height" styleProperty="height" defaultUnit="px" />
          <DimensionInput label="Max Width" styleProperty="maxWidth" defaultUnit="px" />
          <DimensionInput label="Max Height" styleProperty="maxHeight" defaultUnit="px" />
        </div>
      </div>

      <HorizontalAlignControl styleProperty="textAlign" />

      <SliderField
        label="Letter Spacing"
        styleProperty="letterSpacing"
        defaultValue={0}
        max={10}
        unit="px"
      />
      <SliderField
        label="Font size"
        styleProperty="fontSize"
        defaultValue={16}
        max={72}
        unit="px"
      />
      <SliderField
        label="Line height"
        styleProperty="lineHeight"
        defaultValue={16}
        max={72}
        unit="px"
      />

      <SimpleDropdownField
        label="Text Decoration"
        styleProperty="textDecoration"
        options={['None', 'Underline', 'Line-through', 'Overline']}
        defaultValue="none"
      />
      <SimpleDropdownField
        label="Text Transform"
        styleProperty="textTransform"
        options={['None', 'Uppercase', 'Lowercase', 'Capitalize']}
        defaultValue="none"
      />
      <SimpleDropdownField
        label="Font family"
        styleProperty="fontFamily"
        options={['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Times New Roman', 'Helvetica']}
        defaultValue="arial"
      />

      <ColorControl
        label="Text color"
        styleProperty="color"
        defaultValue="#000000"
        responsive={true}
      />
      <ColorControl
        label="Background color"
        styleProperty="backgroundColor"
        defaultValue="#ffffff"
        responsive={true}
      />

      <BorderController />
    </div>
  )
})
