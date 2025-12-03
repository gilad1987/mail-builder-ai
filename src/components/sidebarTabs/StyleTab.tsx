import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'
import {
  ResponsiveIcon,
  SpacingControl,
  DimensionInput,
  HorizontalAlignControl,
  SliderField,
  SimpleDropdownField,
  ColorControl,
  BorderController,
} from '../controls'

export const StyleTab = observer(() => (
  <div>
    <div className="style-section__header">
      <h3 className="style-section__title">Paragraph</h3>
    </div>
    <SpacingControl label="Margin" />
    <SpacingControl label="Padding" />
    <div className="style-field">
      <p className="style-field__label">
        Dimensions
        <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
      </p>
      <div className="dimension-grid">
        <DimensionInput label="Width" value="100" unit="%" />
        <DimensionInput label="Height" value="" unit="px" />
        <DimensionInput label="Max Width" value="" />
        <DimensionInput label="Max Height" value="" />
      </div>
    </div>
    <HorizontalAlignControl selectedAlign="left" />
    <SliderField label="Letter Spacing" value="0" unit="px" />
    <SliderField label="Font size" value="16" unit="px" />
    <SliderField label="Line height" value="16" unit="px" />
    <SimpleDropdownField label="Text Decoration" value="Default" />
    <SimpleDropdownField label="Text Transform" value="Default" />
    <SimpleDropdownField label="Font family" value="Arial" />
    <ColorControl label="Text color" colorValue="#000000" responsive={false} />
    <ColorControl label="Background color" colorValue="#FFFFFF" responsive={false} />
    <BorderController />
  </div>
))
