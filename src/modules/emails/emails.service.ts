import { Injectable, Logger } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name)

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Envía un email de verificación al usuario
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('env.FRONTEND_URL') ||
      'http://localhost:3000'
    const verificationUrl = `${frontendUrl}/auth/verify?token=${token}`

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Verifica tu cuenta de CinemaEC',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  color: #404040;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                  text-decoration: none;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background-color: #ffffff;
                }
                .header { 
                  background: linear-gradient(135deg, #EB0045 0%, #9b0033 100%);
                  color: white; 
                  padding: 40px 20px; 
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 32px;
                  font-weight: bold;
                }
                .content { 
                  background-color: #ffffff; 
                  padding: 40px 30px;
                  color: #404040;
                }
                .content h2 {
                  color: #EB0045;
                  margin-top: 0;
                }
                .button { 
                  display: inline-block; 
                  padding: 14px 32px; 
                  background: linear-gradient(135deg, #EB0045 0%, #ff3366 100%);
                  color: white; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  margin: 20px 0;
                  font-weight: bold;
                  box-shadow: 0 4px 6px rgba(235, 0, 69, 0.3);
                  transition: all 0.3s ease;
                }
                .button:hover {
                  background: linear-gradient(135deg, #9b0033 0%, #EB0045 100%);
                  box-shadow: 0 6px 8px rgba(235, 0, 69, 0.4);
                }
                .link-box {
                  word-break: break-all; 
                  background-color: #f9f9f9; 
                  padding: 15px; 
                  border-left: 4px solid #EB0045;
                  border-radius: 4px;
                  color: #7c7c7c;
                  font-size: 14px;
                }
                .note {
                  background-color: #fff3f6;
                  border-left: 4px solid #ff3366;
                  padding: 12px 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .footer { 
                  text-align: center; 
                  padding: 30px 20px; 
                  font-size: 12px; 
                  color: #a8a8a8;
                  background-color: #404040;
                }
                .footer p {
                  margin: 5px 0;
                  color: #a8a8a8;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎬 CinemaEC</h1>
                </div>
                <div class="content">
                  <h2>¡Bienvenido a CinemaEC!</h2>
                  <p>Gracias por registrarte. Para activar tu cuenta, por favor verifica tu dirección de email haciendo clic en el siguiente botón:</p>
                  <div style="text-align: center;">
                    <a href="${verificationUrl}" class="button">Verificar Email</a>
                  </div>
                  <p>O copia y pega este enlace en tu navegador:</p>
                  <p class="link-box">
                    ${verificationUrl}
                  </p>
                  <div class="note">
                    <strong>Nota:</strong> Este enlace expirará en 24 horas.
                  </div>
                </div>
                <div class="footer">
                  <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
                  <p>&copy; ${new Date().getFullYear()} CinemaEC. Todos los derechos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      this.logger.log(`✅ Email de verificación enviado a: ${email}`)
    } catch (error) {
      this.logger.error(
        `❌ Error SMTP al enviar verificación a ${email}: ${error.message}`,
      )
      // Fallback via Resend API si está configurado
      const apiKey = this.configService.get<string>('env.RESEND_API_KEY')
      const from =
        this.configService.get<string>('env.RESEND_FROM') ||
        this.configService.get<string>('env.MAIL_FROM')
      if (apiKey && from) {
        try {
          const resend = new Resend(apiKey)
          await resend.emails.send({
            from,
            to: email,
            subject: 'Verifica tu cuenta de CinemaEC',
            html: `
              <!DOCTYPE html>
              <html>
                <body>
                  <p>Gracias por registrarte. Verifica tu correo aquí:</p>
                  <p><a href="${verificationUrl}">Verificar Email</a></p>
                  <p>Si el botón no funciona, copia este enlace:</p>
                  <p>${verificationUrl}</p>
                </body>
              </html>
            `,
          })
          this.logger.log(
            `✅ Resend: email de verificación enviado a: ${email}`,
          )
          return
        } catch (err: any) {
          this.logger.error(
            `❌ Resend también falló al enviar verificación a ${email}: ${err?.message}`,
          )
        }
      }
      // No lanzamos el error para no interrumpir el registro
    }
  }

  /**
   * Envía un email al usuario cuando reclama su perfil profesional
   */
  async sendProfessionalClaimedEmail(
    email: string,
    professionalName: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Perfil profesional reclamado - CinemaEC',
        html: `
          <!DOCTYPE html>
          <html>
            <body>
              <p>Hola,</p>
              <p>Tu perfil profesional "${professionalName}" ha sido reclamado exitosamente.</p>
              <p>Ya puedes ingresar a CinemaEC para revisar y completar tu informacion.</p>
            </body>
          </html>
        `,
      })

      this.logger.log(`✅ Email de perfil reclamado enviado a: ${email}`)
    } catch (error) {
      this.logger.error(
        `❌ Error SMTP al enviar email de perfil reclamado a ${email}: ${error.message}`,
      )

      const apiKey = this.configService.get<string>('env.RESEND_API_KEY')
      const from =
        this.configService.get<string>('env.RESEND_FROM') ||
        this.configService.get<string>('env.MAIL_FROM')
      if (apiKey && from) {
        try {
          const resend = new Resend(apiKey)
          await resend.emails.send({
            from,
            to: email,
            subject: 'Perfil profesional reclamado - CinemaEC',
            html: `
              <html>
                <body>
                  <p>Tu perfil profesional "${professionalName}" ha sido reclamado exitosamente.</p>
                </body>
              </html>
            `,
          })
          this.logger.log(
            `✅ Resend: email de perfil reclamado enviado a: ${email}`,
          )
        } catch (err: any) {
          this.logger.error(
            `❌ Resend tambien fallo al enviar email de perfil reclamado a ${email}: ${err?.message}`,
          )
        }
      }
    }
  }

  /**
   * Envía un email para recuperación de contraseña
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('env.FRONTEND_URL') ||
      'http://localhost:3000'
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Restablece tu contraseña - CinemaEC',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  color: #404040;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                  text-decoration: none;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background-color: #ffffff;
                }
                .header { 
                  background: linear-gradient(135deg, #EB0045 0%, #9b0033 100%);
                  color: white; 
                  padding: 40px 20px; 
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 32px;
                  font-weight: bold;
                }
                .content { 
                  background-color: #ffffff; 
                  padding: 40px 30px;
                  color: #404040;
                }
                .content h2 {
                  color: #EB0045;
                  margin-top: 0;
                }
                .button { 
                  display: inline-block; 
                  padding: 14px 32px; 
                  background: linear-gradient(135deg, #EB0045 0%, #ff3366 100%);
                  color: white; 
                  text-decoration: none; 
                  border-radius: 8px; 
                  margin: 20px 0;
                  font-weight: bold;
                  box-shadow: 0 4px 6px rgba(235, 0, 69, 0.3);
                  transition: all 0.3s ease;
                }
                .button:hover {
                  background: linear-gradient(135deg, #9b0033 0%, #EB0045 100%);
                  box-shadow: 0 6px 8px rgba(235, 0, 69, 0.4);
                }
                .link-box {
                  word-break: break-all; 
                  background-color: #f9f9f9; 
                  padding: 15px; 
                  border-left: 4px solid #EB0045;
                  border-radius: 4px;
                  color: #7c7c7c;
                  font-size: 14px;
                }
                .warning {
                  background-color: #fff3f6;
                  border-left: 4px solid #ff3366;
                  padding: 12px 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .info {
                  background-color: #f0f9ff;
                  border-left: 4px solid #0284c7;
                  padding: 12px 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .footer { 
                  text-align: center; 
                  padding: 30px 20px; 
                  font-size: 12px; 
                  color: #a8a8a8;
                  background-color: #404040;
                }
                .footer p {
                  margin: 5px 0;
                  color: #a8a8a8;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎬 CinemaEC</h1>
                </div>
                <div class="content">
                  <h2>Recuperación de contraseña</h2>
                  <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de CinemaEC.</p>
                  <p>Para continuar, haz clic en el siguiente botón:</p>
                  <div style="text-align: center;">
                    <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                  </div>
                  <p>O copia y pega este enlace en tu navegador:</p>
                  <p class="link-box">
                    ${resetUrl}
                  </p>
                  <div class="warning">
                    <strong>⚠️ Importante:</strong> Este enlace es válido solo por <strong>1 hora</strong> y solo puede usarse una vez.
                  </div>
                  <div class="info">
                    <strong>🔒 Seguridad:</strong> Si no solicitaste este cambio, ignora este email. Tu contraseña permanecerá sin cambios.
                  </div>
                </div>
                <div class="footer">
                  <p>Si necesitas ayuda, contáctanos en soporte@cinemaec.com</p>
                  <p>&copy; ${new Date().getFullYear()} CinemaEC. Todos los derechos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      this.logger.log(`✅ Email de recuperación enviado a: ${email}`)
    } catch (error) {
      this.logger.error(
        `❌ Error SMTP al enviar recuperación a ${email}: ${error.message}`,
      )
      const apiKey = this.configService.get<string>('env.RESEND_API_KEY')
      const from =
        this.configService.get<string>('env.RESEND_FROM') ||
        this.configService.get<string>('env.MAIL_FROM')
      if (apiKey && from) {
        try {
          const resend = new Resend(apiKey)
          await resend.emails.send({
            from,
            to: email,
            subject: 'Restablece tu contraseña - CinemaEC',
            html: `
              <!DOCTYPE html>
              <html>
                <body>
                  <p>Para restablecer tu contraseña haz clic aquí:</p>
                  <p><a href="${resetUrl}">Restablecer Contraseña</a></p>
                  <p>Si el botón no funciona, copia este enlace:</p>
                  <p>${resetUrl}</p>
                </body>
              </html>
            `,
          })
          this.logger.log(
            `✅ Resend: email de recuperación enviado a: ${email}`,
          )
          return
        } catch (err: any) {
          this.logger.error(
            `❌ Resend también falló al enviar recuperación a ${email}: ${err?.message}`,
          )
        }
      }
      // No lanzamos el error para mantener la seguridad
    }
  }

  /**
   * Envía un email de notificación a administradores
   */
  async sendAdminNotificationEmail(
    email: string,
    subject: string,
    message: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  color: #404040;
                  background-color: #f5f5f5;
                  margin: 0;
                  padding: 0;
                }
                .container { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background-color: #ffffff;
                }
                .header { 
                  background: linear-gradient(135deg, #EB0045 0%, #9b0033 100%);
                  color: white; 
                  padding: 40px 20px; 
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 32px;
                  font-weight: bold;
                }
                .content { 
                  background-color: #ffffff; 
                  padding: 40px 30px;
                  color: #404040;
                }
                .content h2 {
                  color: #EB0045;
                  margin-top: 0;
                }
                .alert {
                  background-color: #fff3f6;
                  border-left: 4px solid #EB0045;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .footer { 
                  text-align: center; 
                  padding: 30px 20px; 
                  font-size: 12px; 
                  color: #a8a8a8;
                  background-color: #404040;
                }
                .footer p {
                  margin: 5px 0;
                  color: #a8a8a8;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎬 CinemaEC Admin</h1>
                </div>
                <div class="content">
                  <h2>${subject}</h2>
                  <div class="alert">
                    <p>${message}</p>
                  </div>
                  <p>Por favor accede a la plataforma para revisar esta información.</p>
                </div>
                <div class="footer">
                  <p>Este es un email automatizado del sistema de CinemaEC.</p>
                  <p>&copy; ${new Date().getFullYear()} CinemaEC. Todos los derechos reservados.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      this.logger.log(`✅ Email de notificación enviado a: ${email}`)
    } catch (error) {
      this.logger.error(
        `❌ Error SMTP al enviar notificación a ${email}: ${error.message}`,
      )
      // Fallback via Resend API si está configurado
      const apiKey = this.configService.get<string>('env.RESEND_API_KEY')
      const from =
        this.configService.get<string>('env.RESEND_FROM') ||
        this.configService.get<string>('env.MAIL_FROM')
      if (apiKey && from) {
        try {
          const resend = new Resend(apiKey)
          await resend.emails.send({
            from,
            to: email,
            subject,
            html: `<p>${message}</p>`,
          })
          this.logger.log(
            `✅ Resend: email de notificación enviado a: ${email}`,
          )
          return
        } catch (err: any) {
          this.logger.error(
            `❌ Resend también falló al enviar notificación a ${email}: ${err?.message}`,
          )
        }
      }
    }
  }
}
