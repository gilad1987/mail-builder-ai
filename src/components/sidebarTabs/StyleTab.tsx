import { observer } from 'mobx-react-lite'
import { editorStore } from '../../stores/EditorStore'
import { ControlType, hasControl, WidgetType } from '../../config/elementControls'
import { getWidgetDefaults } from '../../models'
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
  const elementType = (element?.type as WidgetType) || WidgetType.Paragraph
  // Get defaults from model - single source of truth
  const defaults = getWidgetDefaults(elementType)

  // Helper to check if control should be shown
  const showControl = (control: ControlType) => hasControl(elementType, control)

  return (
    <div>
      <div className="sidebar__header">
        <h3 className="sidebar__title">{element ? elementType : 'No Selection'}</h3>
        {!element && <p className="sidebar__hint">Select an element to edit its styles</p>}
      </div>

      {/* Margin - shown for most elements */}
      {showControl(ControlType.Margin) && <SpacingControl label="Margin" defaultValue={20} />}

      {/* Padding - not shown for Spacer, Divider */}
      {showControl(ControlType.Padding) && <SpacingControl label="Padding" defaultValue={20} />}

      {/* Dimensions - shown for all elements */}
      {showControl(ControlType.Dimensions) && (
        <div className="style-field">
          <p className="style-field__label">
            Dimensions
            <ResponsiveIcon device={editorStore.activeDevice} responsive={true} />
          </p>
          <div className="dimension-grid">
            <DimensionInput label="Width" styleProperty="width" defaultUnit="%" />
            <DimensionInput label="Max Width" styleProperty="maxWidth" defaultUnit="px" />
            <DimensionInput label="Height" styleProperty="height" defaultUnit="px" />
            <DimensionInput label="Max Height" styleProperty="maxHeight" defaultUnit="px" />
          </div>
        </div>
      )}

      {/* Alignment - for text elements and containers */}
      {showControl(ControlType.Alignment) && <HorizontalAlignControl styleProperty="textAlign" />}

      {/* Letter Spacing - text elements only */}
      {showControl(ControlType.LetterSpacing) && (
        <SliderField
          label="Letter Spacing"
          styleProperty="letterSpacing"
          defaultValue={defaults.letterSpacing ?? 0}
          max={10}
          unit="px"
        />
      )}

      {/* Font Size - text elements only */}
      {showControl(ControlType.FontSize) && (
        <SliderField
          label="Font size"
          styleProperty="fontSize"
          defaultValue={defaults.fontSize ?? 16}
          max={72}
          unit="px"
        />
      )}

      {/* Font Weight - text elements only */}
      {showControl(ControlType.FontWeight) && (
        <SimpleDropdownField
          label="Font weight"
          styleProperty="fontWeight"
          options={[
            'Normal',
            'Bold',
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
          ]}
          defaultValue={defaults.fontWeight ?? 'normal'}
        />
      )}

      {/* Line Height - text elements only (not Button) */}
      {showControl(ControlType.LineHeight) && (
        <SliderField
          label="Line height"
          styleProperty="lineHeight"
          defaultValue={defaults.lineHeight ?? 24}
          max={72}
          unit="px"
        />
      )}

      {/* Text Decoration - text elements only */}
      {showControl(ControlType.TextDecoration) && (
        <SimpleDropdownField
          label="Text Decoration"
          styleProperty="textDecoration"
          options={['None', 'Underline', 'Line-through', 'Overline']}
          defaultValue={defaults.textDecoration ?? 'none'}
        />
      )}

      {/* Text Transform - text elements only */}
      {showControl(ControlType.TextTransform) && (
        <SimpleDropdownField
          label="Text Transform"
          styleProperty="textTransform"
          options={['None', 'Uppercase', 'Lowercase', 'Capitalize']}
          defaultValue="none"
        />
      )}

      {/* Font Family - text elements only */}
      {showControl(ControlType.FontFamily) && (
        <SimpleDropdownField
          label="Font family"
          styleProperty="fontFamily"
          options={['Arial', 'Verdana', 'Tahoma', 'Georgia', 'Times New Roman', 'Helvetica']}
          defaultValue={defaults.fontFamily ?? 'Arial'}
        />
      )}

      {/* Text Color - text elements only */}
      {showControl(ControlType.TextColor) && (
        <ColorControl
          label="Text color"
          styleProperty="color"
          defaultValue={defaults.color ?? '#000000'}
          responsive={true}
        />
      )}

      {/* Background Color - most elements except Spacer */}
      {showControl(ControlType.BackgroundColor) && (
        <ColorControl
          label="Background color"
          styleProperty="backgroundColor"
          defaultValue={defaults.backgroundColor ?? 'transparent'}
          responsive={true}
        />
      )}

      {/* Border - most elements except Spacer */}
      {showControl(ControlType.Border) && <BorderController />}
    </div>
  )
})
