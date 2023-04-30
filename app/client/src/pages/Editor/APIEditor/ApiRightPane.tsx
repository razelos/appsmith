import React, { useMemo, useCallback, useEffect } from "react";
import styled from "styled-components";
import { Classes, FontWeight, Text, TextType } from "design-system-old";
import history from "utils/history";
import { TabbedViewContainer } from "./CommonEditorForm";
import get from "lodash/get";
import { getQueryParams } from "utils/URLUtils";
import ActionRightPane, {
  useEntityDependencies,
} from "components/editorComponents/ActionRightPane";
import { sortedDatasourcesHandler } from "./helpers";
import { datasourcesEditorIdURL } from "RouteBuilder";
import { setApiRightPaneSelectedTab } from "actions/apiPaneActions";
import { useDispatch, useSelector } from "react-redux";
import { getApiRightPaneSelectedTab } from "selectors/apiPaneSelectors";
import isUndefined from "lodash/isUndefined";
import {
  Button,
  Divider,
  Tab,
  TabPanel,
  Tabs,
  TabsList,
  Tag,
} from "design-system";

const EmptyDatasourceContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  height: 100%;
  flex-direction: column;
  .${Classes.TEXT} {
    color: var(--ads-v2-color-fg);
    width: 200px;
  }
`;

const DatasourceContainer = styled.div`
  // to account for the divider
  min-width: calc(${(props) => props.theme.actionSidePane.width}px - 2px);
  color: var(--ads-v2-color-fg);
  .tab-container-right-sidebar {
    padding: 0 var(--ads-v2-spaces-7);
  }
`;

const DataSourceListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  /* padding: 10px; */
  overflow: auto;
`;

const DatasourceCard = styled.div`
  margin-bottom: 10px;
  width: 100%;
  padding: var(--ads-v2-spaces-4);
  border-radius: var(--ads-v2-border-radius);

  display: flex;
  flex-direction: column;

  background: var(--ads-v2-color-bg);
  cursor: pointer;
  transition: 0.3s all ease;
  .cs-icon {
    opacity: 0;
    transition: 0.3s all ease;
  }
  &:hover {
    background-color: var(--ads-v2-color-bg-subtle);
    .cs-icon {
      opacity: 1;
    }
  }
`;

const DatasourceURL = styled.span`
  margin: 5px 0px 0px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ads-v2-color-fg);
  width: fit-content;
  max-width: 100%;
  font-weight: 500;
`;

const DataSourceNameContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  .cs-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--ads-v2-color-fg);
  }
  .cs-text {
    color: var(--ads-v2-color-fg);
  }
`;

const SomeWrapper = styled.div`
  height: 100%;
`;

const NoEntityFoundWrapper = styled.div`
  width: 144px;
  height: 36px;
  margin-bottom: 20px;
  box-shadow: var(--ads-v2-shadow-popovers);
  padding: 10px 9px;
  border-radius: var(--ads-v2-border-radius);
  .lines {
    height: 4px;
    border-radius: var(--ads-v2-border-radius);
    background: var(--ads-v2-color-bg-muted);
    &.first-line {
      width: 33%;
      margin-bottom: 8px;
    }
    &.second-line {
      width: 66%;
      background: var(--ads-v2-color-bg-subtle);
    }
  }
`;

export const getDatasourceInfo = (datasource: any): string => {
  const info = [];
  const headers = get(datasource, "datasourceConfiguration.headers", []);
  const queryParamters = get(
    datasource,
    "datasourceConfiguration.queryParameters",
    [],
  );
  const authType = get(
    datasource,
    "datasourceConfiguration.authentication.authenticationType",
    "",
  ).toUpperCase();
  if (headers.length)
    info.push(`${headers.length} HEADER${headers.length > 1 ? "S" : ""}`);
  if (queryParamters.length)
    info.push(
      `${queryParamters.length} QUERY PARAMETER${
        queryParamters.length > 1 ? "S" : ""
      }`,
    );
  if (authType.length) info.push(authType);
  return info.join(" | ");
};

const API_RIGHT_PANE_TABS = {
  CONNECTIONS: "connections",
  DATASOURCES: "datasources",
};
function ApiRightPane(props: any) {
  const dispatch = useDispatch();
  const { entityDependencies, hasDependencies } = useEntityDependencies(
    props.actionName,
  );
  const selectedTab = useSelector(getApiRightPaneSelectedTab);

  const setSelectedTab = useCallback((selectedIndex: string) => {
    dispatch(setApiRightPaneSelectedTab(selectedIndex));
  }, []);

  useEffect(() => {
    // Switch to connections tab only initially after successfully run get stored value
    // otherwise
    if (!!props.hasResponse && isUndefined(selectedTab))
      setSelectedTab(API_RIGHT_PANE_TABS.CONNECTIONS);
  }, [props.hasResponse]);

  // array of datasources with the current action's datasource first, followed by the rest.
  const sortedDatasources = useMemo(
    () =>
      sortedDatasourcesHandler(
        props.datasources,
        props.currentActionDatasourceId,
      ),
    [props.datasources, props.currentActionDatasourceId],
  );

  return (
    <>
      <Divider orientation="vertical" />
      <DatasourceContainer>
        <TabbedViewContainer className="tab-container-right-sidebar">
          <Tabs
            data-testid={"api-right-pane"}
            onValueChange={setSelectedTab}
            value={
              isUndefined(selectedTab)
                ? API_RIGHT_PANE_TABS.DATASOURCES
                : selectedTab
            }
          >
            <TabsList>
              <Tab
                key={API_RIGHT_PANE_TABS.DATASOURCES}
                value={API_RIGHT_PANE_TABS.DATASOURCES}
              >
                Datasources
              </Tab>
              <Tab
                key={API_RIGHT_PANE_TABS.CONNECTIONS}
                value={API_RIGHT_PANE_TABS.CONNECTIONS}
              >
                Connections
              </Tab>
            </TabsList>
            <TabPanel value={API_RIGHT_PANE_TABS.DATASOURCES}>
              {props.datasources && props.datasources.length > 0 ? (
                <DataSourceListWrapper
                  className={
                    selectedTab === API_RIGHT_PANE_TABS.DATASOURCES
                      ? "show"
                      : ""
                  }
                >
                  {(sortedDatasources || []).map((d: any, idx: number) => {
                    const dataSourceInfo: string = getDatasourceInfo(d);
                    console.log("datasource info", dataSourceInfo);
                    return (
                      <DatasourceCard
                        key={idx}
                        onClick={() => props.onClick(d)}
                      >
                        <DataSourceNameContainer>
                          <Text type={TextType.H5} weight={FontWeight.BOLD}>
                            {d.name}
                          </Text>
                          {d?.id === props.currentActionDatasourceId && (
                            <Tag isClosable={false} size="md">
                              In Use
                            </Tag>
                          )}
                          <Button
                            isIconButton
                            kind="tertiary"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              history.push(
                                datasourcesEditorIdURL({
                                  pageId: props.currentPageId,
                                  datasourceId: d.id,
                                  params: getQueryParams(),
                                }),
                              );
                            }}
                            size="sm"
                            startIcon="pencil-line"
                          />
                        </DataSourceNameContainer>
                        <DatasourceURL>
                          {d.datasourceConfiguration?.url}
                        </DatasourceURL>
                        {dataSourceInfo && (
                          <Text type={TextType.P3} weight={FontWeight.NORMAL}>
                            {dataSourceInfo}
                          </Text>
                        )}
                      </DatasourceCard>
                    );
                  })}
                </DataSourceListWrapper>
              ) : (
                <EmptyDatasourceContainer>
                  <NoEntityFoundWrapper>
                    <div className="lines first-line" />
                    <div className="lines second-line" />
                  </NoEntityFoundWrapper>
                  <Text
                    textAlign="center"
                    type={TextType.H5}
                    weight={FontWeight.NORMAL}
                  >
                    When you save a datasource, it will show up here.
                  </Text>
                </EmptyDatasourceContainer>
              )}
            </TabPanel>
            <TabPanel value={API_RIGHT_PANE_TABS.CONNECTIONS}>
              <SomeWrapper>
                <ActionRightPane
                  actionName={props.actionName}
                  entityDependencies={entityDependencies}
                  hasConnections={hasDependencies}
                  hasResponse={props.hasResponse}
                  suggestedWidgets={props.suggestedWidgets}
                />
              </SomeWrapper>
            </TabPanel>
          </Tabs>
        </TabbedViewContainer>
      </DatasourceContainer>
    </>
  );
}

export default React.memo(ApiRightPane);
