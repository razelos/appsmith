import { Alignment } from "@blueprintjs/core";
import { LabelPosition, ResponsiveBehavior } from "components/constants";
import { FILL_WIDGET_MIN_WIDTH } from "constants/minWidthConstants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "Rich Text Editor",
  iconSVG: IconSVG,
  needsMeta: true,
  searchTags: ["input", "rte"],
  defaults: {
    defaultText: "This is the initial <b>content</b> of the editor",
    rows: 20,
    columns: 24,
    animateLoading: true,
    isDisabled: false,
    isVisible: true,
    isRequired: false,
    widgetName: "RichTextEditor",
    isDefaultClickDisabled: true,
    inputType: "html",
    labelText: "Label",
    labelPosition: LabelPosition.Top,
    labelAlignment: Alignment.LEFT,
    labelWidth: 5,
    version: 1,
    responsiveBehavior: ResponsiveBehavior.Fill,
    minWidth: FILL_WIDGET_MIN_WIDTH,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    contentConfig: Widget.getPropertyPaneContentConfig(),
    styleConfig: Widget.getPropertyPaneStyleConfig(),
  },
};

export default Widget;
