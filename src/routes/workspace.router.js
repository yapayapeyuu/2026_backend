import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import workspaceController from '../controllers/workspace.controller.js';
import memberWorkspaceController from '../controllers/memberWorkspace.controller.js'
import workspaceMiddleware from '../middlewares/workspace.middleware.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';

const workspaceRouter = express.Router();

// Ruta publica para procesar invitaciones desde el email
workspaceRouter.get(
    '/:workspace_id/members/:decision',
    memberWorkspaceController.processInvitation
);

// Todas las rutas siguientes requieren sesion activa
workspaceRouter.use(authMiddleware);

workspaceRouter.post('/', workspaceController.create);

workspaceRouter.get('/', workspaceController.getAllByUser);

workspaceRouter.get(
    '/:workspace_id/members',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.COLLABORATOR]),
    memberWorkspaceController.getMembersByWorkspace
);

workspaceRouter.post(
    '/:workspace_id/members',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    memberWorkspaceController.inviteUser
);

workspaceRouter.put(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.COLLABORATOR]),
    workspaceController.updateById
);

workspaceRouter.delete(
    '/:workspace_id',
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    workspaceController.deleteById
);

export default workspaceRouter;



/* import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import workspaceController from '../controllers/workspace.controller.js';
import memberWorkspaceController from '../controllers/memberWorkspace.controller.js'
import workspaceMiddleware from '../middlewares/workspace.middleware.js';
import { MEMBER_WORKSPACE_ROLES } from '../constants/memberRoles.constant.js';

const workspaceRouter = express.Router();

//Lo pongo arriba ya que no quiero que este alcanzado por el auth middleware

workspaceRouter.get(
    '/:workspace_id/members/:decision',
    memberWorkspaceController.processInvitation
); 

//Configuramos el authMiddleware a nivel de ruta
workspaceRouter.use(authMiddleware);

workspaceRouter.post('/', workspaceController.create);

workspaceRouter.get('/', workspaceController.getAllByUser);

workspaceRouter.delete(
    '/:workspace_id', 
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]), 
    workspaceController.deleteById
)

workspaceRouter.put(
    '/:workspace_id', 
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.COLLABORATOR]), 
    workspaceController.updateById
)

workspaceRouter.post(
    '/:workspace_id/members',
    authMiddleware,
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER]),
    memberWorkspaceController.inviteUser
);

 workspaceRouter.post(
    '/:workspace_id/members',
    authMiddleware,
    workspaceMiddleware([MEMBER_WORKSPACE_ROLES.OWNER, MEMBER_WORKSPACE_ROLES.ADMIN]),
    memberWorkspaceController.inviteUser
);


/* noteRouter.use(authMiddleware)

noteRouter.post('/', noteController.create)

noteRouter.get('/', noteController.getAllByUser)

noteRouter.put(
    '/:note_id',
    noteMiddleware([NOTE_ROLES.OWNER, NOTE_ROLES.COLLABORATOR]),
    noteController.updateById
)

noteRouter.delete(
    '/:note_id',
    noteMiddleware([NOTE_ROLES.OWNER]),
    noteController.deleteById
) 


export default workspaceRouter;

 */