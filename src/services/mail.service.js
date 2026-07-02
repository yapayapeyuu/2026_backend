import ENVIRONMENT from "../config/environment.config.js";
import mailer_transport from "../config/mailer.config.js";

function buildInvitationEmailTemplate({ accept_url, reject_url, role }) {
    return `
        <div style="margin:0; padding:0; background:#f4f7fb; font-family: Arial, Helvetica, sans-serif; color:#172033;">
            <div style="max-width:580px; margin:0 auto; padding:32px 16px;">
                <div style="background:#ffffff; border:1px solid #e5eaf3; border-radius:18px; overflow:hidden; box-shadow:0 18px 40px rgba(21, 35, 56, 0.10);">
                    <div style="background:linear-gradient(135deg, #2563eb, #1d4ed8); padding:28px 32px; color:#ffffff;">
                        <p style="margin:0 0 8px; font-size:13px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.85;">App de Notas</p>
                        <h1 style="margin:0; font-size:26px; line-height:1.2;">Te invitaron a colaborar</h1>
                    </div>
                    <div style="padding:32px;">
                        <p style="margin:0 0 18px; font-size:16px; line-height:1.6; color:#4b5563;">Recibiste una invitación para participar en una nota como <b>${role}</b>.</p>
                        <p style="margin:0 0 26px; font-size:15px; line-height:1.6; color:#6b7280;">Podés aceptar para verla y editarla, o rechazar la invitación si no reconocés esta solicitud.</p>
                        <div style="text-align:center; margin:30px 0;">
                            <a href="${accept_url}" style="display:inline-block; background:#2563eb; color:#ffffff; text-decoration:none; padding:14px 20px; border-radius:12px; font-weight:700; font-size:15px; margin:0 6px 12px;">Aceptar invitación</a>
                            <a href="${reject_url}" style="display:inline-block; background:#ffffff; color:#dc2626; border:1px solid #fecaca; text-decoration:none; padding:13px 20px; border-radius:12px; font-weight:700; font-size:15px; margin:0 6px 12px;">Rechazar</a>
                        </div>
                        <p style="margin:16px 0 0; font-size:12px; line-height:1.5; color:#9ca3af; word-break:break-all;">Si los botones no funcionan, copiá y pegá uno de estos enlaces en tu navegador:<br>Aceptar: ${accept_url}<br>Rechazar: ${reject_url}</p>
                    </div>
                </div>
                <p style="margin:18px 0 0; text-align:center; font-size:12px; color:#94a3b8;">Este correo fue enviado automáticamente. No respondas este mensaje.</p>
            </div>
        </div>
    `
}

class MailService {
    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            await mailer_transport.sendMail({
                from: `"App de Notas" <${ENVIRONMENT.GMAIL_USERNAME}>`,
                to: invited_email,
                subject: 'Invitación para colaborar en una nota',
                html: buildInvitationEmailTemplate({ accept_url, reject_url, role })
            })
            console.log("¡Correo de invitación enviado a:", invited_email)
        } catch (error) {
            console.error("Error al enviar la invitación:", error)
            throw error
        }
    }
}

const mailService = new MailService()
export default mailService


/* import ENVIRONMENT from "../config/environment.config.js";
import mailer_transport from "../config/mailer.config.js";
import ServerError from "../helpers/serverError.helper.js";


class MailService {
    async sendInvitationMemberEmail(invited_email, accept_url, reject_url, role) {
        try {
            await mailer_transport.sendMail({
                from: `"App de Notas" <${ENVIRONMENT.GMAIL_USERNAME}>`,
                to: invited_email,
                subject: 'Invitación para colaborar en una nota',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>¡Has sido invitado!</h2>
                        <p>Te invitaron a colaborar en una nota con el rol de <b>${role}</b>.</p>
                        <div style="margin: 30px 0; display: flex; justify-content: center; gap: 20px;">
                            <a href="${accept_url}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ACEPTAR INVITACIÓN</a>
                            <a href="${reject_url}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                        </div>
                        <p style="font-size: 12px; color: gray;">Si no conocés esta nota, ignorá este mensaje o presioná rechazar.</p>
                    </div>
                `
            })
            console.log("¡Correo de invitación enviado a:", invited_email)
        } catch (error) {
            console.error("Error al enviar la invitación:", error)
            throw error
        }
    }
}

const mailService = new MailService()
export default mailService
 */

/* class MailService {
    async sendInvitationMemberEmail (invited_email, accept_url, reject_url, role){
        try {
            await mailer_transport.sendMail({
                from: `"App de Notas" <${ENVIRONMENT.GMAIL_USERNAME}>`,
                to: invited_email,
                subject: 'Invitación a Espacio de Trabajo',
                html: `
                    <div style="font-family: Arial; padding: 20px; text-align: center;">
                        <h2>¡Has sido invitado!</h2>
                        <p>Alguien te ha invitado a colaborar en un espacio de trabajo con el rol de <b>${role}</b>.</p>
                        <div style="margin: 30px 0; display: flex; justify-content: center; gap: 20px;">
                            <a href="${accept_url}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">ACEPTAR INVITACIÓN</a>
                            <a href="${reject_url}" style="background-color: #dc3545; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">RECHAZAR</a>
                        </div>
                        <p style="font-size: 12px; color: gray;">Si no conoces este espacio, ignora este mensaje o presiona rechazar.</p>
                    </div>
                `
            });
            console.log("¡Correo de invitación enviado a:", invited_email);
    } catch (error) {
        console.error("Error al enviar la invitación:", error);
        throw error
    }
    }
}

const mailService = new MailService()
export default mailService
 */
