import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import express from "express";
import authRouter from "./routes/auth.router.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import workspaceRouter from "./routes/workspace.router.js";

connectMongoDB()

/* 
Crear una API de express
Route:
    /api/auth => Trabaja todo lo relacionado a autentificacion
        POST /register
            body: {name, email, password}
            Validar que el usuario tenga nombre mayor a 2 caracteres
            Validar email
            Validar password con almenos 6 caracteres 
            Crear un usuario en la DB
        



Mas Adelante...
        POST /login
        
RECOMENDACION:
    El controller puede ser asincrono!!
    authRouter.post(
        '/register', 
        async (request, response) => {
            await userRepository.create('pepe')
        }
    )
*/

import cors from 'cors'

const app = express();
const PORT = ENVIRONMENT.PORT;

// Habilitamos las consultas cross-origin
app.use(cors())

// Parse JSON
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/workspace', workspaceRouter)

/* 
Ruta: /api/workspace


    controlador: workspaceController
        
        POST '/' post() Debe estar con el authMiddleware (IMPORTANTE)
            Validar nombre y descripcion (opcional)
            Crear un espacio de trabajo
            Crear una membresia de role tipo 'dueño' a nombre del id del cliente consultante.
            
            body: {
                nombre,
                descripcion
            }

        GET '/' getAllByUser() Debe estar con el authMiddleware (IMPORTANTE)
            Buscar todos los espacios de trabajo de los que el cliente consultante es miembro 
            Responder con la lista de espacios de trabajo

        DELETE '/:workspace_id' deleteById() Debe estar con el authMiddleware
            Validar que el espacio de trabajo exista => 404
            Validar que el usuario consultante sea 'dueño' de dicho espacio de trabajo => 403 Forbidden
            Eliminar (Soft o Hard) el espacio de trabajo

        PUT '/:workspace_id' updateById() Debe estar con el authMiddleware
            body: {
                nombre (opcional),
                descripcion (opcional)
            }
            Validar que el espacio de trabajo exista => 404
            Validar que el usuario consultante sea 'dueño' o 'admin' de dicho espacio de trabajo => 403 Forbidden
            Actualizar los campos correspondientes.

    RECOMENDACION:
        Como se repite 
            Validar que el espacio de trabajo exista
            Validar que el cliente consultante sea miembro del espacio de trabajo
        Vendria muy bien usar un middleware que se llame workspaceMiddleware
        Haria:
            - Validar que el espacio de trabajo exista
            - Validar que el cliente consultante sea miembro del espacio de trabajo
            - Guardar en la request la info de:
                workspace
                member
*/



/* 
Un endpoint donde el cliente debera enviarnos por header de autorizacion el access token, en caso de estar presente y ser correcto
Le daremos los datos de la cuenta
*/
app.get(
    '/api/profile', 
   /*  (request, response, next) => {
        const random_num = Math.random() 
        console.log('Numero aleatorion generado:', random_num)
        if(random_num > 0.5){
            return response.json({
                message:"Mala suerte campeon ☠"
            })
        }
        else{
            next()
        }
    }, */
    authMiddleware,
    (request, response) => {
        console.log(
            'Nombre del cliente:',
            request.user.nombre
        )
        return response.json({
            ok: true,
            status: 200,
            message: "Estas autenticado"
        })
    }
)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


/* 

/api/auth => Trabaja todo lo relacionado a autentificacion 
/api/workspace => Trabaja todo lo relacionado a workspaces
    /:workspace_id/members => Todo lo relacionado a membresias
    /:workspace_id/channels => Todo lo relacionado a canales
        /:channel_id/messages => Todo lo relacionado a mensajes
    /:workspace_id/contacts


Crear mensaje: 
    POST /api/workspaces/:workspace_id/channels/:channel_id/messages
    authMiddleware
    verifyWorkspaceMiddleware
    verifyChannelMiddleware
    messagesController.create()
*/