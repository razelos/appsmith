import React from "react";
import { Switch, useRouteMatch } from "react-router";
import { SentryRoute } from "@appsmith/AppRouter";
import {
  DATA_SOURCES_EDITOR_ID_PATH,
  DATA_SOURCES_EDITOR_LIST_PATH,
  INTEGRATION_EDITOR_PATH,
  SAAS_GSHEET_EDITOR_ID_PATH,
  WORKFLOW_SETTINGS_PATHS,
} from "constants/routes";
import WorkflowSettingsPane from "./WorkflowSettings";
import DataSidePane from "pages/Editor/IDE/LeftPane/DataSidePane";
import { LeftPaneContainer } from "pages/Editor/IDE/LeftPane";
import WorkflowMainContainer from "../../WorkflowMainContainer";

const LeftPane = () => {
  const { path } = useRouteMatch();
  return (
    <LeftPaneContainer>
      <Switch>
        <SentryRoute
          component={DataSidePane}
          exact
          path={[
            `${path}${DATA_SOURCES_EDITOR_LIST_PATH}`,
            `${path}${DATA_SOURCES_EDITOR_ID_PATH}`,
            `${path}${INTEGRATION_EDITOR_PATH}`,
            `${path}${SAAS_GSHEET_EDITOR_ID_PATH}`,
          ]}
        />
        <SentryRoute
          component={WorkflowSettingsPane}
          exact
          path={WORKFLOW_SETTINGS_PATHS(path)}
        />
        <SentryRoute component={WorkflowMainContainer} />
      </Switch>
    </LeftPaneContainer>
  );
};

export default LeftPane;
