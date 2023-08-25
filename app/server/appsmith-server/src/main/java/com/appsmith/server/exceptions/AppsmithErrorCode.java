package com.appsmith.server.exceptions;

import lombok.Getter;

@Getter
public enum AppsmithErrorCode {
    INVALID_ACTION_COLLECTION("AE-ACC-4038", "Invalid action collection"),
    UNAUTHORIZED_ACCESS("AE-ACL-4003", "Unauthorized access"),
    ACL_NO_RESOURCE_FOUND("AE-ACL-4004", "Acl no resource found"),
    INVALID_PARAMETER("AE-APP-4000", "Invalid parameter"),
    PAGE_ID_NOT_GIVEN("AE-APP-4004", "Page id not given"),
    DUPLICATE_KEY_USER_ERROR("AE-APP-4005", "Duplicate key user error"),
    PAGE_DOESNT_BELONG_TO_USER_WORKSPACE("AE-APP-4006", "Page doesn't belong to user workspace"),
    UNSUPPORTED_OPERATION("AE-APP-4007", "Unsupported operation"),
    DEPRECATED_API("AE-APP-4008", "Deprecated api"),
    USER_DOESNT_BELONG_ANY_WORKSPACE("AE-APP-4009", "User doesn't belong any workspace"),
    USER_DOESNT_BELONG_TO_WORKSPACE("AE-APP-4010", "User doesn't belong to workspace"),
    INVALID_ACTION("AE-APP-4012", "Invalid action"),
    PAYLOAD_TOO_LARGE("AE-APP-4013", "Payload too large"),
    INVALID_ACTION_NAME("AE-APP-4014", "Invalid action name"),
    NO_CONFIGURATION_FOUND_IN_ACTION("AE-APP-4016", "No configuration found in action"),
    PAGE_DOESNT_BELONG_TO_APPLICATION("AE-APP-4018", "Page doesnt belong to application"),
    UNAUTHORIZED_DOMAIN("AE-APP-4019", "Unauthorized domain"),
    USER_NOT_SIGNED_IN("AE-APP-4020", "User not signed in"),
    USER_ALREADY_EXISTS_IN_WORKSPACE("AE-APP-4021", "User already exists in workspace"),
    INVALID_DYNAMIC_BINDING_REFERENCE("AE-APP-4022", "Invalid dynamic binding reference"),
    INVALID_CREDENTIALS("AE-APP-4023", "Invalid credentials"),
    USER_ALREADY_EXISTS_SIGNUP("AE-APP-4025", "User already exists signup"),
    ACTION_IS_NOT_AUTHORIZED("AE-APP-4026", "Action is not authorized"),
    NO_RESOURCE_FOUND("AE-APP-4027", "No resource found"),
    VALIDATION_FAILURE("AE-APP-4028", "Validation failure"),
    WORKSPACE_ID_NOT_GIVEN("AE-APP-4031", "Workspace id not given"),
    REMOVE_LAST_WORKSPACE_ADMIN_ERROR("AE-APP-4038", "Remove last workspace admin error"),
    UNKNOWN_PLUGIN_REFERENCE("AE-APP-4052", "Unknown plugin reference"),
    INVALID_LICENSE_KEY_ENTERED("AE-APP-4053", "Invalid license key"),
    HEALTHCHECK_TIMEOUT("AE-APP-4080", "Connection timeout during health check"),
    DUPLICATE_KEY("AE-APP-4091", "Duplicate key"),
    DUPLICATE_KEY_OBJECT_CREATION("AE-APP-4092", "Duplicate key during object creation"),
    INTERNAL_SERVER_ERROR("AE-APP-5000", "Internal server error"),
    REPOSITORY_SAVE_FAILED("AE-APP-5001", "Repository save failed"),
    PLUGIN_INSTALLATION_FAILED_DOWNLOAD_ERROR("AE-APP-5002", "Plugin installation failed download error"),
    IO_ERROR("AE-APP-5003", "Io error"),
    PLUGIN_LOAD_FORM_JSON_FAIL("AE-APP-5004", "Plugin load form json fail"),
    PLUGIN_LOAD_TEMPLATES_FAIL("AE-APP-5005", "Plugin load templates fail"),
    OAUTH_NOT_AVAILABLE("AE-APP-5006", "Oauth not available"),
    MARKETPLACE_NOT_CONFIGURED("AE-APP-5007", "Marketplace not configured"),
    FAIL_UPDATE_USER_IN_SESSION("AE-APP-5008", "Fail update user in session"),
    UNKNOWN_ACTION_RESULT_DATA_TYPE("AE-APP-5009", "Unknown action result data type"),
    AUTHENTICATION_FAILURE("AE-APP-5010", "Authentication failure"),
    INSTANCE_REGISTRATION_FAILURE("AE-APP-5011", "Instance registration failure"),
    CLOUD_SERVICES_ERROR("AE-APP-5012", "Cloud services error"),
    SSH_KEY_GENERATION_ERROR("AE-APP-5015", "Ssh key generation error"),
    FILE_PART_DATA_BUFFER_ERROR("AE-APP-5017", "File part data buffer error"),
    MIGRATION_ERROR("AE-APP-5018", "Migration error"),
    ENV_FILE_NOT_FOUND("AE-APP-5019", "Env file not found"),
    PUBLIC_APP_NO_PERMISSION_GROUP("AE-APP-5020", "Public app no permission group"),
    RTS_SERVER_ERROR("AE-APP-5021", "Rts server error"),
    SCHEMA_MISMATCH_ERROR("AE-APP-5022", "Schema mismatch error"),
    SCHEMA_VERSION_NOT_FOUND_ERROR("AE-APP-5023", "Schema version not found error"),
    SERVER_NOT_READY("AE-APP-5024", "Appsmith server is not ready"),
    SESSION_BAD_STATE("AE-APP-5025", "Invalid user session"),
    PLUGIN_EXECUTION_TIMEOUT("AE-APP-5040", "Plugin execution timeout"),
    MARKETPLACE_TIMEOUT("AE-APP-5041", "Marketplace timeout"),
    GOOGLE_RECAPTCHA_TIMEOUT("AE-APP-5042", "Google recaptcha timeout"),
    INVALID_PROPERTIES_CONFIGURATION("AE-APP-5044", "Property configuration is wrong or malformed"),
    NAME_CLASH_NOT_ALLOWED_IN_REFACTOR("AE-AST-4009", "Name clash not allowed in refactor"),
    GENERIC_BAD_REQUEST("AE-BAD-4000", "Generic bad request"),
    MALFORMED_REQUEST("AE-BAD-4001", "Malformed request body"),
    GOOGLE_RECAPTCHA_FAILED("AE-CAP-4035", "Google recaptcha failed"),
    INVALID_CRUD_PAGE_REQUEST("AE-CRD-4039", "Invalid crud page request"),
    EMPTY_CURL_INPUT_STATEMENT("AE-CRL-4054", "Invalid CURL input statement"),
    INVALID_CURL_COMMAND("AE-CRL-4029", "Invalid curl command"),
    INVALID_CURL_METHOD("AE-CRL-4032", "Invalid curl method"),
    INVALID_CURL_HEADER("AE-CRL-4036", "Invalid curl header"),
    CYCLICAL_DEPENDENCY_ERROR("AE-CYC-4041", "Cyclical dependency error"),
    DATASOURCE_NOT_GIVEN("AE-DTS-4003", "Datasource not given"),
    NO_CONFIGURATION_FOUND_IN_DATASOURCE("AE-DTS-4011", "No configuration found in datasource"),
    INVALID_DATASOURCE("AE-DTS-4013", "Invalid datasource"),
    INVALID_DATASOURCE_CONFIGURATION("AE-DTS-4015", "Invalid datasource configuration"),
    DATASOURCE_HAS_ACTIONS("AE-DTS-4030", "Datasource has actions"),
    APPLICATION_FORKING_NOT_ALLOWED("AE-FRK-4034", "Application forking not allowed"),
    INVALID_GIT_CONFIGURATION("AE-GIT-4031", "Invalid git configuration"),
    INVALID_GIT_SSH_CONFIGURATION("AE-GIT-4032", "Invalid git ssh configuration"),
    INVALID_GIT_REPO("AE-GIT-4033", "Invalid git repo"),
    GIT_MERGE_FAILED_REMOTE_CHANGES("AE-GIT-4036", "Git merge failed remote changes"),
    GIT_MERGE_FAILED_LOCAL_CHANGES("AE-GIT-4037", "Git merge failed local changes"),
    UNSUPPORTED_OPERATION_FOR_REMOTE_BRANCH("AE-GIT-4040", "Unsupported operation for remote branch"),
    GIT_APPLICATION_LIMIT_ERROR("AE-GIT-4043", "Git application limit error"),
    GIT_ACTION_FAILED("AE-GIT-4044", "Git action failed"),
    GIT_MERGE_CONFLICTS("AE-GIT-4046", "Git merge conflicts"),
    GIT_PULL_CONFLICTS("AE-GIT-4047", "Git pull conflicts"),
    GIT_UPSTREAM_CHANGES("AE-GIT-4048", "Git upstream changes"),
    INVALID_GIT_SSH_URL("AE-GIT-4050", "Invalid git ssh url"),
    REPOSITORY_NOT_FOUND("AE-GIT-4051", "Repository not found"),
    GIT_FILE_SYSTEM_ERROR("AE-GIT-5013", "Git file system error"),
    GIT_EXECUTION_TIMEOUT("AE-GIT-5014", "Git execution timeout"),
    GIT_GENERIC_ERROR("AE-GIT-5016", "Git generic error"),
    GIT_FILE_IN_USE("AE-GIT-5020", "Git file lock in use"),
    INVALID_JS_ACTION("AE-JSA-4040", "Invalid js action"),
    JSON_PROCESSING_ERROR("AE-JSN-4001", "Json processing error"),
    INCOMPATIBLE_IMPORTED_JSON("AE-JSN-4045", "Incompatible imported json"),
    GENERIC_JSON_IMPORT_ERROR("AE-JSN-4049", "Generic json import error"),
    INVALID_LOGIN_METHOD("AE-LGN-4000", "Invalid login method"),
    PLUGIN_NOT_INSTALLED("AE-PLG-4001", "Plugin not installed"),
    PLUGIN_ID_NOT_GIVEN("AE-PLG-4002", "Plugin id not given"),
    PLUGIN_RUN_FAILED("AE-PLG-5003", "Plugin run failed"),
    INVALID_PASSWORD_RESET("AE-PSW-4000", "Invalid password reset"),
    INVALID_PASSWORD_LENGTH("AE-PSW-4037", "Invalid password length"),
    DEFAULT_RESOURCES_UNAVAILABLE("AE-RSR-4034", "Default resources unavailable"),
    ROLES_FROM_SAME_WORKSPACE("AE-RSW-4041", "Roles from same workspace"),
    SIGNUP_DISABLED("AE-SGN-4033", "Signup disabled"),
    TOO_MANY_REQUESTS("AE-TMR-4029", "Too many requests"),
    USER_NOT_FOUND("AE-USR-4004", "User not found"),
    CSRF_TOKEN_INVALID("AE-APP-4039", "CSRF token missing/invalid"),
    UNSUPPORTED_IMPORT_OPERATION("AE-APP-4040", "Unsupported operation for import application via file"),
    DUPLICATE_DATASOURCE_CONFIGURATION("AE-APP-4093", "Duplicate datasource configuration"),
    INVALID_METHOD_LEVEL_ANNOTATION_USAGE("AE-APP-4094", "Invalid usage for custom annotation"),
    ;
    private final String code;
    private final String description;

    AppsmithErrorCode(String code, String description) {
        this.code = code;
        this.description = description;
    }
}
