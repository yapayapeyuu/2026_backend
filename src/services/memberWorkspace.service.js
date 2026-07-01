import ENVIRONMENT from "../config/environment.config.js";
import MEMBER_INVITATION_STATUS from "../constants/memberInvitationStatus.constant.js";
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js";
import jwt from 'jsonwebtoken'
import mailService from "./mail.service.js";


const WORKSPACE_CONFIG = {
    INVITATION_MEMBERSHIP_EXPIRATION_DAYS: 30
}

class MemberWorkspaceService {

    async inviteUser(user_invited_for_id, user_invited_email, workspace_id, role = MEMBER_WORKSPACE_ROLES.COLLABORATOR) {
        const userToInvite = await userRepository.getByEmail(user_invited_email)

        if (!userToInvite) {
            throw new ServerError("El usuario ingresado no existe en el sistema", 404)
        }

        if (String(userToInvite._id) === String(user_invited_for_id)) {
            throw new ServerError("No podés invitarte a vos mismo a la nota", 400)
        }

        await this.verifyAlreadyMember(workspace_id, userToInvite._id)

        const member_created = await this.createMember(
            userToInvite._id,
            workspace_id,
            role
        )

        const invitation_token = jwt.sign(
            {
                member_id: member_created._id
            },
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn: `${WORKSPACE_CONFIG.INVITATION_MEMBERSHIP_EXPIRATION_DAYS}d`
            }
        )

        const backend_url = ENVIRONMENT.URL_BACKEND || `http://localhost:${ENVIRONMENT.PORT}`
        const accept_url = `${backend_url}/api/workspace/${workspace_id}/members/${MEMBER_INVITATION_STATUS.ACCEPTED}?invitation_token=${invitation_token}`
        const reject_url = `${backend_url}/api/workspace/${workspace_id}/members/${MEMBER_INVITATION_STATUS.REJECTED}?invitation_token=${invitation_token}`

        await mailService.sendInvitationMemberEmail(userToInvite.email, accept_url, reject_url, role)
    }

    async memberDesicion(invitation_token, decision) {
        const decoded = jwt.verify(invitation_token, ENVIRONMENT.JWT_SECRET)

        const member_created = await workspaceMemberRepository.getById(decoded.member_id)

        if (!member_created) {
            throw new ServerError("Invitación no encontrada o expirada", 404)
        }

        if (member_created.estatus_invitacion !== MEMBER_INVITATION_STATUS.PENDING) {
            throw new ServerError("Esta invitación ya fue procesada anteriormente", 400)
        }

        if (member_created.fecha_expiracion_invitacion < new Date()) {
            throw new ServerError("Esta invitación ha expirado", 400)
        }

        if (
            decision !== MEMBER_INVITATION_STATUS.ACCEPTED &&
            decision !== MEMBER_INVITATION_STATUS.REJECTED
        ) {
            throw new ServerError("Decisión no válida", 400)
        }

        await workspaceMemberRepository.updateById(
            member_created._id,
            { estatus_invitacion: decision }
        )
    }

    async verifyAlreadyMember(workspace_id, user_id) {
        const isInvitedAlreadyMember = await workspaceMemberRepository.getMemberByWorkspaceAndUserId(workspace_id, user_id)

        if (!isInvitedAlreadyMember) {
            return
        }

        if (isInvitedAlreadyMember.estatus_invitacion === MEMBER_INVITATION_STATUS.ACCEPTED) {
            throw new ServerError("El usuario ya es colaborador de la nota", 400)
        }

        if (isInvitedAlreadyMember.estatus_invitacion === MEMBER_INVITATION_STATUS.PENDING) {
            const ahora = new Date()

            if (isInvitedAlreadyMember.fecha_expiracion_invitacion > ahora) {
                throw new ServerError("Ya enviaste una invitación a este usuario", 400)
            }

            await workspaceMemberRepository.deleteById(isInvitedAlreadyMember._id)
            return
        }

        if (isInvitedAlreadyMember.estatus_invitacion === MEMBER_INVITATION_STATUS.REJECTED) {
            throw new ServerError("El usuario rechazó la invitación", 400)
        }
    }

    async createMember(user_id, workspace_id, rol) {
        const expiration_date = this.getMembershipExpirationDate()

        return await workspaceMemberRepository.create(
            user_id,
            workspace_id,
            rol,
            MEMBER_INVITATION_STATUS.PENDING,
            expiration_date
        )
    }

    getMembershipExpirationDate() {
        const expirationDate = new Date()
        expirationDate.setDate(expirationDate.getDate() + WORKSPACE_CONFIG.INVITATION_MEMBERSHIP_EXPIRATION_DAYS)
        return expirationDate
    }
}

const memberWorkspaceService = new MemberWorkspaceService()
export default memberWorkspaceService