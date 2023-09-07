import { matchPath } from "react-router";
import {
  API_EDITOR_ID_PATH,
  BUILDER_CUSTOM_PATH,
  BUILDER_PATH,
  BUILDER_PATH_DEPRECATED,
  DATA_SOURCES_EDITOR_ID_PATH,
  IDE_PAGE_JS_DETAIL_PATH,
  IDE_PAGE_NAV_PATH,
  IDE_PAGE_PATH,
  IDE_PAGE_QUERIES_DETAIL_PATH,
  IDE_PAGE_QUERIES_PATH,
  IDE_PAGE_UI_DETAIL_PATH,
  IDE_PATH,
  INTEGRATION_EDITOR_PATH,
  JS_COLLECTION_ID_PATH,
  QUERIES_EDITOR_ID_PATH,
  WIDGETS_EDITOR_ID_PATH,
} from "constants/routes";
import {
  SAAS_EDITOR_API_ID_PATH,
  SAAS_EDITOR_DATASOURCE_ID_PATH,
} from "pages/Editor/SaaSEditor/constants";
import { getQueryParamsFromString } from "utils/getQueryParamsObject";
import { TEMP_DATASOURCE_ID } from "constants/Datasource";
import { IDEAppState, PageNavState } from "../pages/IDE/ideReducer";

export enum FocusEntity {
  PAGE = "PAGE",
  API = "API",
  CANVAS = "CANVAS",
  DATASOURCE = "DATASOURCE",
  DEBUGGER = "DEBUGGER",
  QUERY = "QUERY",
  JS_OBJECT = "JS_OBJECT",
  PROPERTY_PANE = "PROPERTY_PANE",
  NONE = "NONE",
}

export const FocusStoreHierarchy: Partial<Record<FocusEntity, FocusEntity>> = {
  [FocusEntity.PROPERTY_PANE]: FocusEntity.PAGE,
  [FocusEntity.JS_OBJECT]: FocusEntity.PAGE,
  [FocusEntity.QUERY]: FocusEntity.PAGE,
};

export type FocusEntityInfo = {
  entity: FocusEntity;
  id: string;
  pageId?: string;
};

/**
 * Method to indicate if the URL is of type API, Query etc.,
 * and not anything else
 * @param path
 * @returns
 */
export function shouldStoreURLForFocus(path: string) {
  const entityTypesToStore = [
    FocusEntity.QUERY,
    FocusEntity.API,
    FocusEntity.JS_OBJECT,
    FocusEntity.DATASOURCE,
    FocusEntity.PROPERTY_PANE,
  ];

  const entity = identifyIDEEntityFromPath(path)?.entity;

  return entityTypesToStore.indexOf(entity) >= 0;
}

/**
 * parse search string and get branch
 * @param searchString
 * @returns
 */
const fetchGitBranch = (searchString: string | undefined) => {
  const existingParams =
    getQueryParamsFromString(searchString?.substring(1)) || {};

  return existingParams.branch;
};

/**
 * Compare if both the params are on same branch
 * @param previousParamString
 * @param currentParamStaring
 * @returns
 */
export function isSameBranch(
  previousParamString: string,
  currentParamStaring: string,
) {
  const previousBranch = fetchGitBranch(previousParamString);
  const currentBranch = fetchGitBranch(currentParamStaring);

  return previousBranch === currentBranch;
}

export function identifyEntityFromPath(path: string): FocusEntityInfo {
  const match = matchPath<{
    apiId?: string;
    datasourceId?: string;
    pluginPackageName?: string;
    queryId?: string;
    appId?: string;
    actionId?: string;
    pageId?: string;
    collectionId?: string;
    widgetIds?: string;
    selectedTab?: string; // Datasource creation/list screen
  }>(path, {
    path: [
      BUILDER_PATH_DEPRECATED + API_EDITOR_ID_PATH,
      BUILDER_PATH + API_EDITOR_ID_PATH,
      BUILDER_CUSTOM_PATH + API_EDITOR_ID_PATH,
      BUILDER_PATH_DEPRECATED + QUERIES_EDITOR_ID_PATH,
      BUILDER_PATH + QUERIES_EDITOR_ID_PATH,
      BUILDER_CUSTOM_PATH + QUERIES_EDITOR_ID_PATH,
      BUILDER_PATH_DEPRECATED + DATA_SOURCES_EDITOR_ID_PATH,
      BUILDER_PATH + DATA_SOURCES_EDITOR_ID_PATH,
      BUILDER_CUSTOM_PATH + DATA_SOURCES_EDITOR_ID_PATH,
      BUILDER_PATH_DEPRECATED + INTEGRATION_EDITOR_PATH,
      BUILDER_PATH + INTEGRATION_EDITOR_PATH,
      BUILDER_CUSTOM_PATH + INTEGRATION_EDITOR_PATH,
      BUILDER_PATH + SAAS_EDITOR_DATASOURCE_ID_PATH,
      BUILDER_CUSTOM_PATH + SAAS_EDITOR_DATASOURCE_ID_PATH,
      BUILDER_PATH_DEPRECATED + SAAS_EDITOR_API_ID_PATH,
      BUILDER_PATH + SAAS_EDITOR_API_ID_PATH,
      BUILDER_CUSTOM_PATH + SAAS_EDITOR_API_ID_PATH,
      BUILDER_PATH_DEPRECATED + JS_COLLECTION_ID_PATH,
      BUILDER_PATH + JS_COLLECTION_ID_PATH,
      BUILDER_CUSTOM_PATH + JS_COLLECTION_ID_PATH,
      BUILDER_PATH + WIDGETS_EDITOR_ID_PATH,
      BUILDER_CUSTOM_PATH + WIDGETS_EDITOR_ID_PATH,
      BUILDER_PATH_DEPRECATED + WIDGETS_EDITOR_ID_PATH,
      IDE_PAGE_UI_DETAIL_PATH,
      IDE_PAGE_QUERIES_PATH,
      IDE_PAGE_QUERIES_DETAIL_PATH,
      BUILDER_PATH_DEPRECATED,
      BUILDER_PATH,
      BUILDER_CUSTOM_PATH,
    ],
    exact: true,
  });
  if (!match) {
    return { entity: FocusEntity.NONE, id: "", pageId: "" };
  }
  if (match.params.apiId) {
    if (match.params.pluginPackageName) {
      return {
        entity: FocusEntity.QUERY,
        id: match.params.apiId,
        pageId: match.params.pageId,
      };
    }
    return {
      entity: FocusEntity.API,
      id: match.params.apiId,
      pageId: match.params.pageId,
    };
  }
  if (
    match.params.datasourceId &&
    match.params.datasourceId !== TEMP_DATASOURCE_ID
  ) {
    return {
      entity: FocusEntity.DATASOURCE,
      id: match.params.datasourceId,
      pageId: match.params.pageId,
    };
  }
  if (match.params.selectedTab) {
    return {
      entity: FocusEntity.DATASOURCE,
      id: match.params.selectedTab,
      pageId: match.params.pageId,
    };
  }
  if (match.params.actionId) {
    return {
      entity: FocusEntity.QUERY,
      id: match.params.actionId,
      pageId: match.params.pageId,
    };
  }
  if (match.params.collectionId) {
    return {
      entity: FocusEntity.JS_OBJECT,
      id: match.params.collectionId,
      pageId: match.params.pageId,
    };
  }
  if (match.params.widgetIds) {
    return {
      entity: FocusEntity.PROPERTY_PANE,
      id: match.params.widgetIds,
      pageId: match.params.pageId,
    };
  }
  return { entity: FocusEntity.CANVAS, id: "", pageId: match.params.pageId };
}

export function identifyIDEEntityFromPath(path: string): FocusEntityInfo {
  const ideStateMatch = matchPath<{ ideState?: IDEAppState }>(path, IDE_PATH);

  if (ideStateMatch) {
    const { ideState } = ideStateMatch.params;
    if (ideState === IDEAppState.Page) {
      const pageStateMatch = matchPath<{ pageId: string }>(path, IDE_PAGE_PATH);
      if (pageStateMatch) {
        const { pageId } = pageStateMatch.params;
        const pageNavMatch = matchPath<{ pageNav: PageNavState }>(
          path,
          IDE_PAGE_NAV_PATH,
        );
        if (pageNavMatch) {
          const { pageNav } = pageNavMatch.params;
          if (pageNav === PageNavState.UI) {
            const widgetsMatch = matchPath<{ widgetIds: string }>(
              path,
              IDE_PAGE_UI_DETAIL_PATH,
            );
            if (widgetsMatch) {
              const { widgetIds } = widgetsMatch.params;
              return {
                entity: FocusEntity.PROPERTY_PANE,
                pageId,
                id: widgetIds,
              };
            }
            return {
              entity: FocusEntity.PAGE,
              pageId,
              id: pageId,
            };
          } else if (pageNav === PageNavState.JS) {
            const jsMatch = matchPath<{ collectionId: string }>(
              path,
              IDE_PAGE_JS_DETAIL_PATH,
            );
            if (jsMatch) {
              return {
                entity: FocusEntity.JS_OBJECT,
                pageId,
                id: jsMatch?.params.collectionId || "",
              };
            }
            return {
              entity: FocusEntity.PAGE,
              pageId,
              id: pageId,
            };
          } else if (pageNav === PageNavState.QUERIES) {
            const queryMatch = matchPath<{ actionId: string }>(
              path,
              IDE_PAGE_QUERIES_DETAIL_PATH,
            );
            if (queryMatch) {
              return {
                entity: FocusEntity.QUERY,
                pageId,
                id: queryMatch?.params.actionId || "",
              };
            }
            return {
              entity: FocusEntity.PAGE,
              pageId,
              id: pageId,
            };
          }
        }
      }
    }
  }

  return { entity: FocusEntity.NONE, id: "", pageId: "" };
}
