export * from "ce/constants/ModuleConstants";
import type {
  Module as CE_Module,
  ModuleInputSection as CE_ModuleInputSection,
  ModuleInput as CE_ModuleInput,
} from "ce/constants/ModuleConstants";
import type { ControlData } from "components/formControls/BaseControl";

export enum MODULE_TYPE {
  QUERY = "QUERY_MODULE",
  JS = "JS_MODULE",
  UI = "UI_MODULE",
}
export enum MODULE_PREFIX {
  QUERY = "Query",
  JS = "JS",
}
export interface PluginSettings {
  id: number;
  sectionName: string;
  children: ControlData[];
}

export interface ModuleInput extends CE_ModuleInput {
  label: string;
  defaultValue: string;
  controlType: string;
}

export interface PluginSettings {
  id: number;
  sectionName: string;
  children: ControlData[];
}

export interface ModuleInputSection extends CE_ModuleInputSection {
  sectionName: string;
  children: ModuleInput[];
}

export interface Module extends CE_Module {
  inputsForm: ModuleInputSection[];
  settingsForm: PluginSettings[];
  type: MODULE_TYPE;
  userPermissions: string[];
}

export enum MODULE_ENTITY_TYPE {
  ACTION = "ACTION",
  JS_OBJECT = "JS_OBJECT",
}
