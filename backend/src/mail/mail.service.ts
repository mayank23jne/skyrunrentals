import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }

  async sendEmployeeCredentials(
    toEmail: string | string[],
    firstname: string,
    password: string,
  ): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'info@skyrunrentals.com';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;
    const websiteUrl = 'https://skyrunrentals.com';

    const messagetable = `
    <div style='width: 500px;margin: auto;border: solid 5px #579981;padding: 20px;border-radius: 10px;text-align:center;'>
        <table style='width: 100%;padding: 25px;text-align: initial;'>
            <tr> 
                <td style='border-bottom: solid 2px #579981;padding-bottom: 20px;'>
                    <img src='${logoURL}' alt='site-logo' style='height:50px; width:auto;margin-top:15px'>
                </td> 
            </tr>
            <tr> 
                <td style='padding-top: 20px;'>
                    <h3>Dear, ${firstname}<br> This message confirms that your user profile was recently updated on </h3><br> ${websiteUrl}
                </td> 
            </tr>
            <tr> 
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Username</b> : <span style='margin-left: 49px;'>${Array.isArray(toEmail) ? toEmail[0] : toEmail}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Password</b> : <span style='margin-left: 49px;'>${password}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 7px 0;'>
                    Best Regards,
                </td> 
            </tr>
            <tr> 
                <td style='padding: 7px 0;'>
                    <span style='color:rgb(191,144,0)'><span><i><font size='4'><b>Skyrunrentals</b></font></i></span></span>
                </td> 
            </tr>
        </table>
    </div>
    `;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(toEmail) ? toEmail.join(',') : toEmail,
      subject: 'Skyrunrentals | Register Info',
      html: messagetable,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Credentials email sent to ${Array.isArray(toEmail) ? toEmail.join(', ') : toEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${Array.isArray(toEmail) ? toEmail.join(', ') : toEmail}:`, error.message);
      return false;
    }
  }

  async sendForgotPasswordEmail(
    toEmail: string,
    resetLink: string,
  ): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'info@skyrunrentals.com';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: 'Skyrunrentals | Reset password link.',
      html: `
        <div style="width: 500px; margin: auto; border: solid 5px #579981; padding: 20px; border-radius: 10px; text-align: center; font-family: sans-serif;">
          <table style="width: 100%; padding: 25px;">
            <tr>
              <td style="border-bottom: solid 2px #579981; padding-bottom: 20px;">
                <img src="${logoURL}" alt="site-logo" style="height: 50px; width: auto; margin: auto; display: block;" title="site-logo">
              </td>
            </tr>
            <tr>
              <td style="padding-top: 20px;">
                <h3 style="color: #1f2937;">Hello<br> Welcome to Skyrunrentals</h3>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #4b5563;">
                <b>Email</b> : ${toEmail}
              </td>
            </tr>
            <tr>
              <td style="padding: 15px 0; border-bottom: solid 2px #579981; color: #4b5563; line-height: 1.6;">
                <strong>A password reset has been requested for this email account</strong><br>
                <strong>Please click:</strong> <a href="${resetLink}" style="color: #579981; font-weight: bold;">${resetLink}</a>
              </td>
            </tr>
          </table>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${toEmail}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${toEmail}:`, error.message);
      return false;
    }
  }

  async sendRegistrationEmail(
    toEmails: string | string[],
    data: any,
    pdfPath?: string,
  ): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'info@skyrunrentals.com';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;
    const websiteUrl = 'https://skyrunrentals.com';

    const messagetable = `
    <div style='width: 500px;margin: auto;border: solid 5px #579981;padding: 20px;border-radius: 10px;text-align:center;'>
        <table style='width: 100%;padding: 25px;text-align: initial;'>
            <tr> 
                <td style='border-bottom: solid 2px #579981;padding-bottom: 20px;'>
                    <img src='${logoURL}' alt='site-logo' style='height:50px; width:auto;margin-top:15px'>
                </td> 
            </tr>
            <tr> 
                <td style='padding-top: 20px;'>
                    <h3>Dear, ${data.firstname || ''}<br> This message confirms that your user profile was recently updated on </h3><br> ${websiteUrl}
                </td> 
            </tr>
            <tr>
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Customer ID</b> : <span style='padding-left: 36px;'>${data.id || ''}</span>
                </td> 
            </tr>
            <tr>
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Name</b> : <span style='margin-left: 73px;'>${data.firstname || ''} ${data.lastname || ''}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Username</b> : <span style='margin-left: 49px;'>${data.email || ''}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Password</b> : <span style='margin-left: 49px;'>${data.original_password || ''}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Phone/Mobile</b> : <span style='margin-left: 27px;'>${data.contact_number || ''}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 10px 0px 0px 0px;'>
                    <b>Address</b> : <span style='margin-left: 59px;'>${data.address || ''}, ${data.city || ''}, ${data.state || ''}, ${data.country || ''}, ${data.zipcode || ''}</span> 
                </td> 
            </tr>
            <tr> 
                <td style='padding: 7px 0;'>
                    Best Regards,
                </td> 
            </tr>
            <tr> 
                <td style='padding: 7px 0;'>
                    <span style='color:rgb(191,144,0)'><span><i><font size='4'><b>Skyrunrentals</b></font></i></span></span>
                </td> 
            </tr>
        </table>
    </div>
    `;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(toEmails) ? toEmails.join(',') : toEmails,
      subject: 'Skyrunrentals | Register Info',
      html: messagetable,
      attachments: pdfPath ? [{
        filename: `privacyPolicy_${data.id}.pdf`,
        path: pdfPath,
      }] : [],
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Registration email sent to ${Array.isArray(toEmails) ? toEmails.join(', ') : toEmails}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send registration email to ${Array.isArray(toEmails) ? toEmails.join(', ') : toEmails}:`, error.message);
      return false;
    }
  }

  async sendContactOwnerEmail(
    toEmails: string | string[],
    data: any,
  ): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@skyrunrentals.com';
    const imgPath = process.env.IMG_PATH || 'https://holidayhavenhomes.com/';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;
    const baseUrl = process.env.APP_URL || 'http://localhost:5173';

    const flexible = data.travel === '1' ? 'Dates are flexible.' : '';

    let dateArrivals = '';
    const arrivalFormat = data.arrival && data.arrival !== '01 Jan 1970' ? data.arrival : null;
    const departureFormat = data.departure && data.departure !== '01 Jan 1970' ? data.departure : null;

    if (!arrivalFormat && !departureFormat) {
      dateArrivals = `<b>Dates</b> : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style='color: red;font-size: 13px;margin-right: 65px;'>${flexible}</span>`;
    } else {
      dateArrivals = `<b>Dates</b> : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  From &nbsp;<b>${arrivalFormat}</b>&nbsp; To &nbsp;<b>${departureFormat}<br><span style='color: red;font-size: 13px;float: right;margin-right: 65px;'>${flexible}</span>`;
    }

    const messagetable = `
<div style='width: 500px;margin: auto;border: solid 5px #132742;padding: 20px;border-radius: 10px;text-align:center; font-family: sans-serif;'>
   <table width='100%' cellspacing='0' cellpadding='0' border='0' bgcolor='#FFFFFF'>
      <tbody>
         <tr>
            <td style='background-color: #1327422b;' align='center'>
               <table cellspacing='0' cellpadding='0' border='0' align='center'>
                  <tbody>
                     <tr>
                        <td width='700' align='center'>
                           <table width='100%' cellspacing='0' cellpadding='0' border='0' align='center'>
                              <tbody>
                                 <tr><td height='25'></td></tr>
                                 <tr>
                                    <td style='text-align:center;vertical-align:top;font-size:0' >
                                       <div style='display:inline-block;vertical-align:top;margin-left:9px;'>
                                          <table cellspacing='0' cellpadding='0' border='0' >
                                             <tbody>
                                                <tr>
                                                   <td width='180' >
                                                      <table cellspacing='0' cellpadding='0' border='0' >
                                                         <tbody>
                                                            <tr>
                                                               <td style='line-height:0px' >
                                                                  <a href='${baseUrl}' style='color:rgb(236,0,140)' target='_blank'>
                                                                  <img src='${logoURL}' alt='logo' style='display:block;line-height:0px;font-size:0px;border:0px' width='200'>
                                                                  </a>
                                                               </td>
                                                            </tr>
                                                         </tbody>
                                                      </table>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </div>
                                       <div style='display:inline-block;vertical-align:top'>
                                          <table cellspacing='0' cellpadding='0' border='0' align='center' style='padding-top: 15px;'>
                                             <tbody>
                                                <tr><td width='250' height='15' align='center'></td></tr>
                                                <tr>
                                                   <td style='text-decoration:none;color:#fff;font-family:Open sans,Arial,sans-serif;font-size:14px' align='center'>
                                                      <a href='${baseUrl}/about_us' style='color:#fff;text-decoration:none;color:#fff !important;font-family:Open sans,Arial,sans-serif;font-size:14px' target='_blank'>About Us</a>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </div>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
               <table cellspacing='0' cellpadding='0' border='0' align='center'>
                  <tbody>
                     <tr>
                        <td width='600' align='center'>
                           <table width='90%' cellspacing='0' cellpadding='0' border='0' align='center'>
                              <tbody>
                                 <tr><td height='50'></td></tr>
                                 <tr>
                                    <td style='color:#132742;font-family:Century gothic,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:36px' >
                                       Thank you for using skyrunrentals.com
                                    </td>
                                 </tr>
                                 <tr><td height='10'></td></tr>
                                 <tr>
                                    <td style='font-family:Open sans,Arial,sans-serif;font-size:18px;color:#132742;line-height:26.1px' align='center'>
                                       Open Communication&nbsp; |&nbsp; Direct Bookings&nbsp; |&nbsp; Zero Service Fees 									
                                    </td>
                                 </tr>
                                 <tr><td height='50'></td></tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
   <table style='width: 100%;padding: 25px;text-align: initial;'>
      <tr>
         <td style='font-family: Lato,Noto Sans JP,Noto Sans KR,Lucida Grande,Segoe UI,Tahoma,-apple-system,Roboto,sans-serif;font-size:30px;color:#132742;line-height:43.5px;font-weight:bold'>
            YOUR DETAILS
         </td>
      </tr>
      <tr>
         <td style='padding: 10px 0;'>
            <b>Name</b> :&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;${data.firstname} ${data.lastname} 
         </td>
      </tr>
      <tr>
         <td style='padding: 10px 0;'>
            <b>Email</b> : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style='color:#132742;'>${data.email}</span> 
         </td>
      </tr>
      <tr>
         <td style='padding: 10px 0;'>
            <b>Contact</b> : &nbsp; &nbsp; &nbsp; ${data.phone}
         </td>
      </tr>
      <tr>
         <td style='padding: 10px 0;'>
			${dateArrivals}
         </td>
      </tr>
      <tr>
         <td style='padding: 0 0 10px 0;'>
            <b>Guests</b> : &nbsp; &nbsp; &nbsp; &nbsp; ${data.adults} Adults and ${data.childs} Child
         </td>
      </tr>
      <tr>
         <td style='padding: 12px 0 15px 0;'>
            <b>Property ID</b> : &nbsp; &nbsp;  ${data.propertyID}
         </td>
      </tr>
      <tr>
         <td style='padding: 15px 0;border-bottom: solid 2px #132742;'>
            ${data.message}
         </td>
      </tr>
   </table>
   <table width='100%' cellspacing='0' cellpadding='0' border='0' align='center'>
      <tbody>
         <tr>
            <td bgcolor='#EDEDED' align='center'>
               <table cellspacing='0' cellpadding='0' border='0' align='center'>
                  <tbody>
                     <tr><td height='40'></td></tr>
                     <tr>
                        <td width='600' align='center'>
                           <table width='100%' cellspacing='0' cellpadding='0' border='0' align='center'>
                              <tbody>
                                 <tr>
                                    <td style='vertical-align:top;font-size:0' >
                                       <div style='display:inline-block;vertical-align:top;margin-left: 9px;'>
                                          <table cellspacing='0' cellpadding='0' border='0' >
                                             <tbody>
                                                <tr>
                                                   <td width='200' align=''>
                                                      <table width='90%' cellspacing='0' cellpadding='0' border='0' align='center'>
                                                         <tbody>
                                                            <tr>
                                                               <td>
                                                                  <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                                                     <tbody>
                                                                        <tr>
                                                                           <td style='font-family:"Open Sans",Arial,sans-serif;font-size:16px;color:#132742;line-height:27.2px;font-weight:bold;' align='left'>
                                                                              Mailing Address
                                                                           </td>
                                                                        </tr>
                                                                     </tbody>
                                                                  </table>
                                                               </td>
                                                            </tr>
                                                            <tr><td height='5'></td></tr>
                                                            <tr>
                                                               <td style='font-family:Open sans,Arial,sans-serif;color:#132742;font-size:13px;line-height:28px' align='left'>
                                                               Address: 19 Woodville St, Roxbury, MA, 02119 USA 
                                                               </td>
                                                            </tr>
                                                            <tr><td height='25'></td></tr>
                                                         </tbody>
                                                      </table>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </div>
                                       <div style='display:inline-block;vertical-align:top'>
                                          <table cellspacing='0' cellpadding='0' border='0' align='center'>
                                             <tbody>
                                                <tr>
                                                   <td width='280' align='center'>
                                                      <table width='90%' cellspacing='0' cellpadding='0' border='0' align='center'>
                                                         <tbody>
                                                            <tr>
                                                               <td align='center'>
                                                                  <table width='100%' cellspacing='0' cellpadding='0' border='0'>
                                                                     <tbody>
                                                                        <tr>
                                                                           <td style='font-family:"Open Sans",Arial,sans-serif;font-size:16px;color:#132742;line-height:27.2px;font-weight:bold;' align='left'>
                                                                              Customer Support
                                                                           </td>
                                                                        </tr>
                                                                     </tbody>
                                                                  </table>
                                                               </td>
                                                            </tr>
                                                            <tr><td height='5'></td></tr>
                                                            <tr>
                                                               <td style='font-family:Open sans,Arial,sans-serif;color:#132742;font-size:13px;line-height:28px' align='left'>Visit our help center and website to see what skyrunrentals.com is all about. We are working hard to&nbsp;help you save&nbsp;money on your travel accommodations.
                                                               </td>
                                                            </tr>
                                                            <tr><td height='40'></td></tr>
                                                         </tbody>
                                                      </table>
                                                   </td>
                                                </tr>
                                             </tbody>
                                          </table>
                                       </div>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>
         <tr>
            <td style='background-color:#132742;' bgcolor='#6ec8c7' align='center'>
               <table cellspacing='0' cellpadding='0' border='0' align='center'>
                  <tbody>
                     <tr><td height='15'></td></tr>
                     <tr>
                        <td width='600' align='center'>
                           <table width='100%' cellspacing='0' cellpadding='0' border='0' align='center'>
                              <tbody>
                                 <tr>
                                    <td style='text-align:center;vertical-align:top;font-size:0' align='center'>
                                       <div style='display:inline-block;vertical-align:top'>
                                          <table width='90%' cellspacing='0' cellpadding='0' border='0' align='center'>
                                             <tbody>
                                                <tr>
                                                   <td style='font-family:Open Sans,Arial,sans-serif;font-size:13px;color:#ffffff;line-height:28px' align='center'>
                                                      skyrunrentals.com © 2024 All Rights Reserved
                                                   </td>
                                                </tr>
                                                <tr><td height='10'></td></tr>
                                             </tbody>
                                          </table>
                                       </div>
                                       <div style='display:inline-block;vertical-align:top'>
                                          <table width='90%' cellspacing='0' cellpadding='0' border='0' align='center'>
                                             <tbody>
                                                <tr>
                                                   <td style='font-family:"Open Sans",Arial,sans-serif;font-size:13px;color:#ffffff;line-height:28px' align='center'>
                                                      <a href='${baseUrl}/privacy' style='text-decoration:none;color:#ffffff' target='_blank'>Privacy & Policy</a>
                                                      &nbsp;|&nbsp;
                                                      <a href='${baseUrl}/contacts' style='text-decoration:none;color:#ffffff' target='_blank'>Contact Us</a>
                                                   </td>
                                                </tr>
                                                <tr><td height='15'></td></tr>
                                             </tbody>
                                          </table>
                                       </div>
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>
      </tbody>
   </table>
</div>`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(toEmails) ? toEmails.join(',') : toEmails,
      subject: 'Skyrunrentals | Booking in Property.',
      html: messagetable,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Contact owner email sent to ${Array.isArray(toEmails) ? toEmails.join(', ') : toEmails}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send contact owner email:`, error.message);
      return false;
    }
  }

  async sendBookingPaymentEmail(
    toEmails: string | string[],
    data: any,
  ): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@skyrunrentals.com';
    const imgPath = process.env.IMG_PATH || 'https://holidayhavenhomes.com/';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;
    const baseUrl = process.env.APP_URL || 'http://localhost:5173';

    const messagetable = `
<div style='width: 500px;margin: auto;border: solid 5px #132742;padding: 20px;border-radius: 10px;text-align:center; font-family: sans-serif;'>
  <table style='width: 100%;padding: 25px;text-align: initial;'>
    <tr> 
      <td style='border-bottom: solid 2px #132742;padding-bottom: 20px;'>
        <img src='${logoURL}' alt='site-logo' style='height:50px; width:auto;margin-top:15px'>
      </td> 
    </tr>
    <tr> 
      <td style='padding-top: 20px;'>
        <h3>Dear, ${data.firstName}<br> This Message Confirms that your Property Booking is Successfull. </h3><br> ${baseUrl}
      </td> 
    </tr>
    <tr>
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Property ID</b> : <span style='padding-left: 54px;'>${data.propertyId}</span>
      </td> 
    </tr>
    <tr>
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Name</b> : <span style='margin-left: 86px;'>${data.firstName} ${data.lastName}</span> 
      </td> 
    </tr> 
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Mobile</b> : <span style='margin-left: 81px;'>${data.mobile}</span> 
      </td>
    </tr>
    <tr> 
      <td style='padding:10px 0px 0px 0px'>
        <b>Amount</b> : <span style='margin-left: 76px;'>$${data.amount}</span> 
      </td>
    </tr>
    <tr> 
      <td style='padding:10px 0px 0px 0px'>
        <b>Email</b> : <span style='margin-left: 90px;'>${data.email}</span> 
      </td>
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Booking Dates</b> : <span style='margin-left: 38px;'>${data.firstDate} to ${data.lastDate}</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Guests</b> : <span style='margin-left: 83px;'>${data.adults} Adults and ${data.childs} Child</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Transaction By</b> : <span style='margin-left: 36px;'>${data.transactionBy || 'Stripe'}</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Address</b> : <span style='margin-left: 75px;'>${data.street}, ${data.city}, ${data.countryName}, ${data.zip}</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 7px 0;'>Best Regards,</td> 
    </tr>
    <tr> 
      <td style='padding: 7px 0;'>
        <span style='color:rgb(191,144,0)'><span><i><font size='4'><b>Team Skyrunrentals</b></font></i></span></span>
      </td> 
    </tr>
    <tr> 
      <td style='padding: 7px 0;'>
        <span style='color:rgb(191,144,0)'><b><font size='4'>(<span dir='ltr'><a href='tel:+18554306273' target='_blank'>+1 855-430-6273</a></span>)</font></b></span>
      </td> 
    </tr>
  </table>
</div>`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(toEmails) ? toEmails.join(',') : toEmails,
      subject: 'Skyrunrentals | Payment Info',
      html: messagetable,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Booking payment email sent to ${Array.isArray(toEmails) ? toEmails.join(', ') : toEmails}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send booking payment email:`, error.message);
      return false;
    }
  }

  async sendSubscriptionPaymentEmail(
    toEmails: string | string[],
    data: any,
  ): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'noreply@skyrunrentals.com';
    const imgPath = process.env.IMG_PATH || 'https://holidayhavenhomes.com/';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;
    const baseUrl = process.env.APP_URL || 'http://localhost:5173';

    const messagetable = `
<div style='width: 500px;margin: auto;border: solid 5px #132742;padding: 20px;border-radius: 10px;text-align:center; font-family: sans-serif;'>
  <table style='width: 100%;padding: 25px;text-align: initial;'>
    <tr> 
      <td style='border-bottom: solid 2px #132742;padding-bottom: 20px;'>
        <img src='${logoURL}' alt='site-logo' style='height:50px; width:auto;margin-top:15px'>
      </td> 
    </tr>
    <tr> 
      <td style='padding-top: 20px;'>
        <h3>Dear, ${data.firstName}<br> This Message Confirms that your Payment is Successfull. </h3><br> ${baseUrl}
      </td> 
    </tr>
    <tr>
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Customer ID</b> : <span style='padding-left: 45px;'>${data.userId}</span>
      </td> 
    </tr>
    <tr>
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Name</b> : <span style='margin-left: 84px;'>${data.firstName} ${data.lastName}</span> 
      </td> 
    </tr> 
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Plan</b> : <span style='margin-left: 92px;'>${data.plan}</span> 
      </td>
    </tr>
    <tr> 
      <td style='padding:10px 0px 0px 0px'>
        <b>Amount</b> : <span style='margin-left: 73px;'>$${data.amount}</span> 
      </td>
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Total Property</b> : <span style='margin-left: 38px;'>${data.totalProperty}</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Transaction By</b> : <span style='margin-left: 35px;'>${data.transactionBy || 'Stripe'}</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 10px 0px 0px 0px;'>
        <b>Date</b> : <span style='margin-left: 95px;'>${data.date}</span> 
      </td> 
    </tr>
    <tr> 
      <td style='padding: 7px 0;'>Best Regards,</td> 
    </tr>
    <tr> 
      <td style='padding: 7px 0;'>
        <span style='color:rgb(191,144,0)'><span><i><font size='4'><b>Team Skyrunrentals</b></font></i></span></span>
      </td> 
    </tr>
  </table>
</div>`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(toEmails) ? toEmails.join(',') : toEmails,
      subject: 'Skyrunrentals | Payment Info',
      html: messagetable,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Subscription payment email sent to ${Array.isArray(toEmails) ? toEmails.join(', ') : toEmails}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send Subscription payment email:`, error.message);
      return false;
    }
  }

  async sendBookingEmail(toEmails: string | string[], data: any): Promise<boolean> {
    const fromName = process.env.SMTP_FROM_NAME || 'Skyrunrentals';
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER || 'info@skyrunrentals.com';
    const logoURL = `${process.env.APP_URL || 'http://localhost:5173'}/logo.png`;

    const htmlContent = `
    <div style='width: 500px;margin: auto;border: solid 5px #132742;padding: 20px;border-radius: 10px;text-align:center;'>
        <!-- Header Section -->
        <table width='100%' cellspacing='0' cellpadding='0' border='0' bgcolor='#FFFFFF'>
            <tr>
                <td style='background-color: #1327422b; padding-top:20px; padding-bottom: 20px;' align='center'>
                    <img src='${logoURL}' alt='logo' width='200'>
                    <br><br>
                    <span style='color:#fff;font-family:Century gothic,Arial,sans-serif;font-size:20px;font-weight:bold;line-height:36px'>
                        Thank you for using skyrunrentals.com
                    </span>
                    <br>
                    <span style='font-family:Open sans,Arial,sans-serif;font-size:18px;color:rgb(255,255,255);line-height:26.1px'>
                        Open Communication | Direct Bookings | Zero Service Fees
                    </span>
                </td>
            </tr>
        </table>
        
        <!-- Details Section -->
        <table style='width: 100%;padding: 25px;text-align: initial;'>
            <tr>
                <td style='font-family: Lato,sans-serif;font-size:30px;color:#132742;line-height:43.5px;font-weight:bold'>
                    YOUR DETAILS 
                </td>
            </tr>
            <tr>
                <td style='padding: 10px 0;'>
                    <b>Name</b> : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${data.firstname || data.firstName || ''} ${data.lastname || data.lastName || ''} 
                </td>
            </tr>
            <tr>
                <td style='padding: 10px 0;'>
                    <b>Email</b> : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <span style='color:#132742;'>${data.email || ''}</span> 
                </td>
            </tr>
            <tr>
                <td style='padding: 10px 0;'>
                    <b>Contact</b> : &nbsp; &nbsp; &nbsp; ${data.phone || data.mobile || data.contact || ''}
                </td>
            </tr>
            <tr>
                <td style='padding: 10px 0;'>
                    <b>Dates</b> : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; From <b>${data.arrival || data.arrival_date || data.bookingDates?.split(' - ')?.[0] || ''}</b> To <b>${data.departure || data.departure_date || data.bookingDates?.split(' - ')?.[1] || ''}</b>
                </td>
            </tr>
            <tr>
                <td style='padding: 0 0 10px 0;'>
                    <b>Guests</b> : &nbsp; &nbsp; &nbsp; &nbsp; ${data.adults || 0} Adults and ${data.childs || data.children || 0} Child
                </td>
            </tr>
            <tr>
                <td style='padding: 12px 0 15px 0;'>
                    <b>Property ID</b> : &nbsp; &nbsp; ${data.propertyId || data.property_id || ''}
                </td>
            </tr>
            <tr>
                <td style='padding: 15px 0;border-bottom: solid 2px #132742;'>
                    ${data.message || ''}
                </td>
            </tr>
        </table>

        <!-- Footer Section -->
        <table width='100%' cellspacing='0' cellpadding='0' border='0' align='center'>
            <tr>
                <td bgcolor='#EDEDED' align='center' style='padding: 20px;'>
                    <b>Mailing Address</b><br>
                    Address: 19 Woodville St, Roxbury, MA, 02119 USA
                </td>
            </tr>
            <tr>
                <td style='background-color:#132742;color:#ffffff;padding: 15px;text-align:center;'>
                    skyrunrentals.com © 2024 All Rights Reserved
                </td>
            </tr>
        </table>
    </div>
    `;

    const mailOptions: nodemailer.SendMailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: Array.isArray(toEmails) ? toEmails.join(',') : toEmails,
      subject: 'Skyrunrentals | Booking in Property.',
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Booking email sent to ${Array.isArray(toEmails) ? toEmails.join(', ') : toEmails}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send booking email:`, error.message);
      return false;
    }
  }
}
