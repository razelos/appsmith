package com.appsmith.server.services;

import com.appsmith.server.domains.Application;
import com.appsmith.server.domains.PermissionGroup;
import com.appsmith.server.dtos.InviteUsersToApplicationDTO;
import com.appsmith.server.dtos.MemberInfoDTO;
import com.appsmith.server.dtos.PermissionGroupInfoDTO;
import com.appsmith.server.dtos.UpdateApplicationRoleDTO;
import com.appsmith.server.services.ce_compatible.ApplicationServiceCECompatible;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ApplicationService extends ApplicationServiceCECompatible {

    Mono<PermissionGroup> createDefaultRole(Application application, String roleType);

    Mono<Void> deleteDefaultRole(Application application, PermissionGroup role);

    Mono<List<PermissionGroupInfoDTO>> fetchAllDefaultRoles(String applicationId);

    Mono<List<MemberInfoDTO>> inviteToApplication(
            InviteUsersToApplicationDTO inviteToApplicationDTO, String originHeader);

    Mono<MemberInfoDTO> updateRoleForMember(String applicationId, UpdateApplicationRoleDTO updateApplicationRoleDTO);

    Mono<List<PermissionGroupInfoDTO>> fetchAllDefaultRolesWithoutPermissions();
}
