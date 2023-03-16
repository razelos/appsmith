import { updateAndSaveLayout } from "actions/pageActions";
import {
  ReduxAction,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "ce/constants/ReduxActionConstants";
import log from "loglevel";
import { CanvasWidgetsReduxState } from "reducers/entityReducers/canvasWidgetsReducer";
import {
  all,
  call,
  debounce,
  put,
  select,
  takeLatest,
} from "redux-saga/effects";
import {
  alterLayoutForDesktop,
  alterLayoutForMobile,
  getCanvasDimensions,
} from "utils/autoLayout/AutoLayoutUtils";
import { getWidgets } from "./selectors";
import { AppPositioningTypes } from "reducers/entityReducers/pageListReducer";
import {
  GridDefaults,
  MAIN_CONTAINER_WIDGET_ID,
} from "constants/WidgetConstants";
import {
  getCurrentApplicationId,
  getCurrentAppPositioningType,
  getMainCanvasProps,
} from "selectors/editorSelectors";
import { MainCanvasReduxState } from "reducers/uiReducers/mainCanvasReducer";
import { updateLayoutForMobileBreakpointAction } from "actions/autoLayoutActions";
import CanvasWidgetsNormalizer from "normalizers/CanvasWidgetsNormalizer";
import convertDSLtoAuto from "utils/DSLConversions/fixedToAutoLayout";
import { convertNormalizedDSLToFixed } from "utils/DSLConversions/autoToFixedLayout";
import { updateWidgetPositions } from "utils/autoLayout/positionUtils";
import { getIsMobile } from "selectors/mainCanvasSelectors";
import { getCanvasWidth as getMainCanvasWidth } from "selectors/editorSelectors";
import { getWidgetMinMaxDimensionsInPixel } from "utils/autoLayout/flexWidgetUtils";
import { getIsDraggingOrResizing } from "selectors/widgetSelectors";
import { updateMultipleWidgetPropertiesAction } from "actions/controlActions";
import { isEmpty } from "lodash";
import { mutation_setPropertiesToUpdate } from "./autoHeightSagas/helpers";
import { updateApplication } from "actions/applicationActions";

export function* updateLayoutForMobileCheckpoint(
  actionPayload: ReduxAction<{
    parentId: string;
    isMobile: boolean;
    canvasWidth: number;
  }>,
) {
  try {
    const start = performance.now();
    const { canvasWidth, isMobile, parentId } = actionPayload.payload;
    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
    const mainCanvasWidth: number = yield select(getMainCanvasWidth);
    const updatedWidgets: CanvasWidgetsReduxState = isMobile
      ? alterLayoutForMobile(allWidgets, parentId, canvasWidth, canvasWidth)
      : alterLayoutForDesktop(allWidgets, parentId, mainCanvasWidth);
    yield put(updateAndSaveLayout(updatedWidgets));
    log.debug(
      "Auto Layout : updating layout for mobile viewport took",
      performance.now() - start,
      "ms",
    );
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.RECALCULATE_COLUMNS,
        error,
      },
    });
  }
}

/**
 * This Method is called when fixed and Auto are switched between each other using the Switch button on the right Pane
 * @param actionPayload
 * @returns
 */
export function* updateLayoutPositioningSaga(
  actionPayload: ReduxAction<AppPositioningTypes>,
) {
  try {
    const currPositioningType: AppPositioningTypes = yield select(
      getCurrentAppPositioningType,
    );
    const payloadPositioningType = actionPayload.payload;

    if (currPositioningType === payloadPositioningType) return;

    const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);

    //Convert Fixed Layout to Auto
    if (payloadPositioningType === AppPositioningTypes.AUTO) {
      const denormalizedDSL = CanvasWidgetsNormalizer.denormalize(
        MAIN_CONTAINER_WIDGET_ID,
        { canvasWidgets: allWidgets },
      );

      const autoDSL = convertDSLtoAuto(denormalizedDSL);
      log.debug("autoDSL", autoDSL);

      yield put(
        updateAndSaveLayout(
          CanvasWidgetsNormalizer.normalize(autoDSL).entities.canvasWidgets,
        ),
      );

      yield call(recalculateAutoLayoutColumns);
    }
    // Convert Auto layout to fixed
    else {
      yield put(
        updateAndSaveLayout(convertNormalizedDSLToFixed(allWidgets, "DESKTOP")),
      );
    }

    yield call(updateApplicationLayoutType, payloadPositioningType);
  } catch (error) {
    yield put({
      type: ReduxActionErrorTypes.WIDGET_OPERATION_ERROR,
      payload: {
        action: ReduxActionTypes.RECALCULATE_COLUMNS,
        error,
      },
    });
  }
}

//This Method is used to re calculate Positions based on canvas width
export function* recalculateAutoLayoutColumns() {
  const appPositioningType: AppPositioningTypes = yield select(
    getCurrentAppPositioningType,
  );
  const mainCanvasProps: MainCanvasReduxState = yield select(
    getMainCanvasProps,
  );

  yield put(
    updateLayoutForMobileBreakpointAction(
      MAIN_CONTAINER_WIDGET_ID,
      appPositioningType === AppPositioningTypes.AUTO
        ? mainCanvasProps?.isMobile
        : false,
      mainCanvasProps.width,
    ),
  );
}

let autoLayoutWidgetDimensionUpdateBatch: Record<
  string,
  { width: number; height: number }
> = {};

function addWidgetToAutoLayoutDimensionUpdateBatch(
  widgetId: string,
  width: number,
  height: number,
) {
  autoLayoutWidgetDimensionUpdateBatch[widgetId] = { width, height };
}

function* updateWidgetDimensionsSaga(
  action: ReduxAction<{ widgetId: string; width: number; height: number }>,
) {
  let { height, width } = action.payload;
  const { widgetId } = action.payload;
  const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
  const mainCanvasWidth: number = yield select(getMainCanvasWidth);
  const isLayoutUpdating: boolean = yield select(getIsDraggingOrResizing);

  const widget = allWidgets[widgetId];
  const widgetMinMaxDimensions = getWidgetMinMaxDimensionsInPixel(
    widget,
    mainCanvasWidth,
  );

  if (
    widgetMinMaxDimensions.minHeight &&
    height < widgetMinMaxDimensions.minHeight
  ) {
    height = widgetMinMaxDimensions.minHeight;
  }
  if (
    widgetMinMaxDimensions.maxHeight &&
    height > widgetMinMaxDimensions.maxHeight
  ) {
    height = widgetMinMaxDimensions.maxHeight;
  }
  if (
    widgetMinMaxDimensions.minWidth &&
    width < widgetMinMaxDimensions.minWidth
  ) {
    width = widgetMinMaxDimensions.minWidth;
  }
  if (
    widgetMinMaxDimensions.maxWidth &&
    width > widgetMinMaxDimensions.maxWidth
  ) {
    width = widgetMinMaxDimensions.maxWidth;
  }

  addWidgetToAutoLayoutDimensionUpdateBatch(widgetId, width, height);
  if (isLayoutUpdating) return;
  yield put({
    type: ReduxActionTypes.PROCESS_AUTO_LAYOUT_DIMENSION_UPDATES,
  });
}

/**
 * This saga is responsible for updating the bounding box of the widget
 * when the widget component get resized internally.
 * It also updates the position of other affected widgets as well.
 */
function* processAutoLayoutDimensionUpdatesSaga() {
  const allWidgets: CanvasWidgetsReduxState = yield select(getWidgets);
  const mainCanvasWidth: number = yield select(getMainCanvasWidth);
  const isMobile: boolean = yield select(getIsMobile);

  let widgets = allWidgets;
  const widgetsOld = { ...widgets };
  const parentIds = new Set<string>();
  // Iterate through the batch and update the new dimensions
  for (const widgetId in autoLayoutWidgetDimensionUpdateBatch) {
    const { height, width } = autoLayoutWidgetDimensionUpdateBatch[widgetId];
    const widget = allWidgets[widgetId];
    if (!widget) continue;
    const parentId = widget.parentId;
    if (parentId === undefined) continue;
    if (parentId) parentIds.add(parentId);

    const { columnSpace } = getCanvasDimensions(
      widgets[parentId],
      widgets,
      mainCanvasWidth,
      isMobile,
    );

    //get row space
    const rowSpace = widget.detachFromLayout
      ? 1
      : GridDefaults.DEFAULT_GRID_ROW_HEIGHT;

    widgets = {
      ...widgets,
      [widgetId]: {
        ...widget,
        bottomRow: widget.topRow + height / rowSpace,
        rightColumn: widget.leftColumn + width / columnSpace,
      },
    };
  }

  // Update the position of all the widgets
  for (const parentId of parentIds) {
    widgets = updateWidgetPositions(
      widgets,
      parentId,
      isMobile,
      mainCanvasWidth,
    );
  }

  let widgetsToUpdate: any = {};

  /**
   * Iterate over all widgets and check if any of their dimensions have changed
   * If they have, add them to the list of widgets to update
   * Note: We need to iterate through all widgets since changing dimension of one widget might affect the dimensions of other widgets
   */
  for (const widgetId of Object.keys(widgets)) {
    const widget = widgets[widgetId];
    const oldWidget = widgetsOld[widgetId];
    const propertiesToUpdate: Record<string, any> = {};

    if (widget.topRow !== oldWidget.topRow) {
      propertiesToUpdate["topRow"] = widget.topRow;
    }
    if (widget.bottomRow !== oldWidget.bottomRow) {
      propertiesToUpdate["bottomRow"] = widget.bottomRow;
    }
    if (widget.leftColumn !== oldWidget.leftColumn) {
      propertiesToUpdate["leftColumn"] = widget.leftColumn;
    }
    if (widget.rightColumn !== oldWidget.rightColumn) {
      propertiesToUpdate["rightColumn"] = widget.rightColumn;
    }

    if (isEmpty(propertiesToUpdate)) continue;

    widgetsToUpdate = mutation_setPropertiesToUpdate(
      widgetsToUpdate,
      widgetId,
      propertiesToUpdate,
    );
  }

  // Push all updates to the CanvasWidgetsReducer.
  // Note that we're not calling `UPDATE_LAYOUT`
  // as we don't need to trigger an eval
  if (!isEmpty(widgetsToUpdate)) {
    yield put(updateMultipleWidgetPropertiesAction(widgetsToUpdate));
  }

  // clear the batch after processing
  autoLayoutWidgetDimensionUpdateBatch = {};
}

export function* updateApplicationLayoutType(
  positioningType: AppPositioningTypes,
) {
  const applicationId: string = yield select(getCurrentApplicationId);
  yield put(
    updateApplication(applicationId || "", {
      applicationDetail: {
        appPositioning: {
          type: positioningType,
        },
      },
    }),
  );
}

export default function* layoutUpdateSagas() {
  yield all([
    takeLatest(
      ReduxActionTypes.RECALCULATE_COLUMNS,
      updateLayoutForMobileCheckpoint,
    ),
    takeLatest(
      ReduxActionTypes.UPDATE_LAYOUT_POSITIONING,
      updateLayoutPositioningSaga,
    ),
    takeLatest(
      ReduxActionTypes.UPDATE_WIDGET_DIMENSIONS,
      updateWidgetDimensionsSaga,
    ),
    debounce(
      50,
      ReduxActionTypes.PROCESS_AUTO_LAYOUT_DIMENSION_UPDATES,
      processAutoLayoutDimensionUpdatesSaga,
    ),
  ]);
}
