import MEMBER_INVITATION_STATUS from "../constants/memberInvitationStatus.constant.js";
import ServerError from "../helpers/serverError.helper.js";
import userRepository from "../repositories/user.repository.js";
import workspaceMemberRepository from "../repositories/workspaceMember.repository.js";
import memberWorkspaceService from "../services/memberWorkspace.service.js";
import jwt from 'jsonwebtoken'
import { MEMBER_WORKSPACE_ROLES } from "../constants/memberRoles.constant.js";
import ENVIRONMENT from "../config/environment.config.js";

class MemberWorkspaceController {
    async inviteUser(request, response) {
        const { workspace_id } = request.params
        const { invited_email, role = MEMBER_WORKSPACE_ROLES.COLLABORATOR } = request.body
        const { id: client_id } = request.user

        if (!invited_email) {
            throw new ServerError("Debes enviar el email del usuario invitado", 400)
        }

        if (![MEMBER_WORKSPACE_ROLES.COLLABORATOR].includes(role)) {
            throw new ServerError("El rol indicado no es válido para una nota", 400)
        }

        await memberWorkspaceService.inviteUser(
            client_id,
            invited_email,
            workspace_id,
            role
        )

        return response.status(200).json({
            ok: true,
            status: 200,
            message: "Invitación enviada con éxito"
        })
    }

    async getMembersByWorkspace(request, response) {
        const { workspace_id } = request.params
        const members = await workspaceMemberRepository.getByWorkspaceId(workspace_id)

        return response.status(200).json({
            ok: true,
            status: 200,
            message: "Integrantes obtenidos correctamente",
            data: {
                members
            }
        })
    }

    async processInvitation(request, response) {
        const { decision } = request.params
        const { invitation_token } = request.query

        if (!invitation_token) {
            throw new ServerError("Falta token de invitación", 400)
        }

        if (
            decision !== MEMBER_INVITATION_STATUS.ACCEPTED &&
            decision !== MEMBER_INVITATION_STATUS.REJECTED
        ) {
            throw new ServerError("Decisión no válida", 400)
        }

        await memberWorkspaceService.memberDesicion(invitation_token, decision)

        return response.status(200).send(`
            <main style="font-family: Arial, sans-serif; padding: 32px; text-align: center;">
                <h1>La invitación fue registrada correctamente.</h1>
              
                 <p>
Ya podés iniciar sesión y comenzar a editar la nota.
</p>

<a
   href="${ENVIRONMENT.URL_FRONTEND}/login"
   style="
      display:inline-block;
      margin-top:20px;
      padding:12px 20px;
      background:#000;
      color:#fff;
      text-decoration:none;
      border-radius:6px;
      font-weight:bold;
   "
>
   Ir al Login
</a>
            </main>
        `)
    }
}

const memberWorkspaceController = new MemberWorkspaceController()
export default memberWorkspaceController



/* 
class MemberWorkspaceController {
    async inviteUser(request, response) {
            const { workspace_id } = request.params;
            const { invited_email, role } = request.body;
            const { id: client_id } = request.user;

            
            if (!invited_email || !role) {
                throw new ServerError("Faltan datos obligatorios (email y rol)", 400);
            }

            await memberWorkspaceService.inviteUser(
                client_id,
                invited_email,
                workspace_id,
                role
            )

            return response.status(200).json({ 
                ok: true, 
                message: "Invitación enviada con éxito" 
            });

       
    }

     async processInvitation(request, response) {
       
            const { decision } = request.params;
            const { invitation_token } = request.query;

            if (!invitation_token) throw new ServerError("Falta token de invitacion", 400);
            if (decision !== MEMBER_INVITATION_STATUS.ACCEPTED && decision !== MEMBER_INVITATION_STATUS.REJECTED){
                throw new ServerError("Decisión no válida", 400);
            }
            await memberWorkspaceService.memberDesicion(invitation_token, decision)
            
            response.json({
                ok: true,
                status: 200,
                message: `Decision de ${decision} tomada con exito!`
            })

        
    }
}

const memberWorkspaceController = new MemberWorkspaceController()
export default memberWorkspaceController */