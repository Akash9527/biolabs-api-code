import { userInfo } from 'node:os';
import { EMAIL } from '../constants/email';
import { ApplicationConstants } from './application-constants';

const dotenv = require('dotenv');
const axios = require('axios');
const qs = require('qs');
dotenv.config();
const { info, error, debug } = require('./logger');

const appRoot = require('app-root-path');
const mailTemplateSponsorQnChange = require('fs').readFileSync(appRoot.path + ApplicationConstants.EMAIL_TEMPLATE_SPONSORSHIP_QN_CHANGE_TO_YES_PATH);
const mailTemplateSponsorSchedule = require('fs').readFileSync(appRoot.path + ApplicationConstants.EMAIL_TEMPLATE_SPONSORSHIP_PATH);
const residentCompanyFormSubmission = require('fs').readFileSync(appRoot.path + ApplicationConstants.EMAIL_TEMPLATE_RESIDENT_COMPANY_FORM_SUBMISSION_PATH);

export class Mail {

   /**
    * Description: This method will return the generated Access token for send mail
    * @description This method will return the generated Access token for send mail
    */
   async getGrapAPIToken() {
      const data = qs.stringify({
         client_id: process.env.APPSETTING_MICROSOFT_EMAIL_APP_ID,
         scope: process.env.APPSETTING_MICROSOFT_EMAIL_GRAPH_SCOPE,
         client_secret: process.env.APPSETTING_MICROSOFT_EMAIL_APP_SECERET,
         grant_type: 'client_credentials',
      });
      let config = {
         method: 'post',
         url: process.env.APPSETTING_MICROSOFT_EMAIL_ENDPOINT_TOKEN,
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie:
               'x-ms-gateway-slice=estsfd; stsservicecookie=estsfd; fpc=Atq01SXesc5AnxuS4qWIT5HOk_SAAQAAAF9QE9gOAAAA',
         },
         data: data,
      };
      return await axios(config)
         .then(function (response) {
            return response.data;
         })
         .catch(function (error) {
            if (error)
               return;
         });
   }

   private async sendEmailGraphAPI(tenant: any, token: any, subject: string, content: string, userInfo: any) {
      info("Sending email to " + tenant.tenantEmail, __filename, "sendEmailGraphAPI()");
      let userTxt = tenant && tenant.role && tenant.role == 3 ? 'Insight' : 'Connect';
      let siteNamesList = '';
      let siteNames = [];
      let sitesAppliedList = '';

      if (userInfo && userInfo.site_name) {
         for (let i = 0; i < userInfo.site_name.length; i++) {
            siteNamesList += `<li> ${userInfo.site_name[i]} </li>`;
         }
      }

      if (userInfo && userInfo.sitesApplied) {
         for (let i = 0; i < userInfo.sitesApplied.length; i++) {
            sitesAppliedList += `<li> ${userInfo.sitesApplied[i]} </li>`;
         }
      }

      let data;
      if (content == 'forgotMail') {
         data = {
            message: {
               subject: subject,
               body: {
                  contentType: EMAIL.CONTENT_TYPE,
                  content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                           <head>
                              <meta charset="UTF-8">
                              <meta content="width=device-width, initial-scale=1" name="viewport">
                              <meta name="x-apple-disable-message-reformatting">
                              <meta http-equiv="X-UA-Compatible" content="IE=edge">
                              <meta content="telephone=no" name="format-detection">
                              <title>New email</title>
                              <!--[if (mso 16)]>
                              <style type="text/css">
                                 a {text-decoration: none;}
                              </style>
                              <![endif]--> 
                              <!--[if gte mso 9]>
                              <style>sup { font-size: 100% !important; }</style>
                              <![endif]--> 
                              <!--[if gte mso 9]>
                              <xml>
                                 <o:OfficeDocumentSettings>
                                    <o:AllowPNG></o:AllowPNG>
                                    <o:PixelsPerInch>96</o:PixelsPerInch>
                                 </o:OfficeDocumentSettings>
                              </xml>
                              <![endif]--> 
                              <!--[if !mso]><!-- --> 
                              <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
                              <!--<![endif]--> 
                              <style type="text/css">
                                 #outlook a {
                                 padding:0;
                                 }
                                 .ExternalClass {
                                 width:100%;
                                 }
                                 .ExternalClass,
                                 .ExternalClass p,
                                 .ExternalClass span,
                                 .ExternalClass font,
                                 .ExternalClass td,
                                 .ExternalClass div {
                                 line-height:100%;
                                 }
                                 .es-button {
                                 mso-style-priority:100!important;
                                 text-decoration:none!important;
                                 }
                                 a[x-apple-data-detectors] {
                                 color:inherit!important;
                                 text-decoration:none!important;
                                 font-size:inherit!important;
                                 font-family:inherit!important;
                                 font-weight:inherit!important;
                                 line-height:inherit!important;
                                 }
                                 .es-desk-hidden {
                                 display:none;
                                 float:left;
                                 overflow:hidden;
                                 width:0;
                                 max-height:0;
                                 line-height:0;
                                 mso-hide:all;
                                 }
                                 .es-button-border:hover a.es-button {
                                 background:#3533c6!important;
                                 border-color:#3533c6!important;
                                 }
                                 td .es-button-border:hover a.es-button-1 {
                                 background:#405a72!important;
                                 border-color:#405a72!important;
                                 }
                                 td .es-button-border-2:hover {
                                 background:#405a72!important;
                                 }
                                 td .es-button-border-3:hover {
                                 border-style:solid solid solid solid!important;
                                 background:#3533c6!important;
                                 border-color:#3533c6 #3533c6 #3533c6 #3533c6!important;
                                 }
                                 @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
                              </style>
                           </head>
                           <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                              <div class="es-wrapper-color" style="background-color:#F6F6F6">
                                 <!--[if gte mso 9]>
                                 <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                                 </v:background>
                                 <![endif]--> 
                                 <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
                                    <tr style="border-collapse:collapse">
                                       <td valign="top" style="padding:0;Margin:0">
                                          <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                             <tr style="border-collapse:collapse">
                                                <td align="center" style="padding:0;Margin:0">
                                                   <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                                      <tr style="border-collapse:collapse">
                                                         <td align="left" bgcolor="#F1F0EF" style="padding:35px;Margin:0;background-color:#F1F0EF">
                                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                               <tr style="border-collapse:collapse">
                                                                  <td valign="top" align="center" style="padding:0;Margin:0;width:530px">
                                                                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="left" bgcolor="#fff" style="padding:0;Margin:0;padding-left:30px;padding-right:30px;padding-top:35px">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:32px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:64px;color:#000000;border-bottom:1px solid #E6E4E2"><strong>Reset your Password</strong>&nbsp;</p>
                                                                           </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="left" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000">Hi ${userInfo.userName
                     },<br><br>We've received your request to set a new password for your BioLabs ${userTxt} account. Click below button to reset your password.</p>
                                                                           </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="center" bgcolor="#fff" style="padding:0;Margin:0;padding-left:30px;padding-right:30px">
                                                                              <!--[if mso]>
                                                                              <a href="" target="_blank">
                                                                                 <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" stripoVmlButton href="" 
                                                                                    style="height:49px;v-text-anchor:middle;width:469px;" arcsize="6%" strokecolor="#0f9792" fillcolor="#0f9792">
                                                                                    <w:anchorlock></w:anchorlock>
                                                                                    <center style='color:#ffffff;font-family:lato, "helvetica neue", helvetica, arial, sans-serif;font-size:16px;font-weight:400;'><b style="color:white;">Reset your Password</b></center>
                                                                                 </v:roundrect>
                                                                              </a>
                                                                              <![endif]--> 
                                                                              <!--[if !mso]><!-- --><span class="msohide es-button-border es-button-border-3" style="border-style:solid;border-color:#0f9792;background:#0f9792;border-width:1px;display:block;border-radius:3px;width:auto;mso-hide:all"><a href="${userInfo.origin +
                     EMAIL.EMAIL_CONFIRM_URL +
                     userInfo.token
                     }" class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:16px;color:#FFFFFF;border-style:solid;border-color:#0f9792;border-width:15px 20px;display:block;background:#0f9792;border-radius:3px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;mso-hide:all">Reset your Password</a></span> 
                                                                              <!--<![endif]-->
                                                                           </td>
                                                                        </tr>
                                                                        
                                                                        <tr style="border-collapse:collapse">
                                                                        <td align="left" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                        <p href="" class="es-button msohide" target="_blank" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000">Or click on:  <a href="${userInfo.origin +
                     EMAIL.EMAIL_CONFIRM_URL +
                     userInfo.token
                     }" target="_blank" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:20px;color:#167efb;word-break: break-all;">${userInfo.origin + EMAIL.EMAIL_CONFIRM_URL + userInfo.token
                     }</a> </p>
                                                                     </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="center" bgcolor="#fff">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000"><br><span style="font-size:14px;line-height:21px"></span>If you didn't request this, you can safely ignore this email.<br></p>
                                                                           </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="center" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000"><br>©&nbsp;<span style="font-size:14px;line-height:21px"></span>2021 BioLabs<br><span style="font-size:10px">ALL RIGHTS RESERVED</span></p>
                                                                           </td>
                                                                        </tr>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                            </table>
                                                         </td>
                                                      </tr>
                                                   </table>
                                                </td>
                                             </tr>
                                          </table>
                                       </td>
                                    </tr>
                                 </table>
                              </div>
                           </body>
                        </html>`,
               },
               toRecipients: [
                  {
                     emailAddress: {
                        address: tenant.tenantEmail
                           ? tenant.tenantEmail
                           : tenant.officialEmail,
                     },
                  },
               ],
               ccRecipients: [],
            },
         };
         if (EMAIL.CC_EMAIL_USER) {
            data.message.ccRecipients.push({
               emailAddress: {
                  address: EMAIL.CC_EMAIL_USER,
               },
            });
         }
      } else if (content == 'Invite') {
         data = {
            message: {
               subject: subject,
               body: {
                  contentType: EMAIL.CONTENT_TYPE,
                  content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                           <head>
                              <meta charset="UTF-8">
                              <meta content="width=device-width, initial-scale=1" name="viewport">
                              <meta name="x-apple-disable-message-reformatting">
                              <meta http-equiv="X-UA-Compatible" content="IE=edge">
                              <meta content="telephone=no" name="format-detection">
                              <title>New email</title>
                              <!--[if (mso 16)]>
                              <style type="text/css">
                                 a {text-decoration: none;}
                              </style>
                              <![endif]--> 
                              <!--[if gte mso 9]>
                              <style>sup { font-size: 100% !important; }</style>
                              <![endif]--> 
                              <!--[if gte mso 9]>
                              <xml>
                                 <o:OfficeDocumentSettings>
                                    <o:AllowPNG></o:AllowPNG>
                                    <o:PixelsPerInch>96</o:PixelsPerInch>
                                 </o:OfficeDocumentSettings>
                              </xml>
                              <![endif]--> 
                              <!--[if !mso]><!-- --> 
                              <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
                              <!--<![endif]--> 
                              <style type="text/css">
                                 #outlook a {
                                 padding:0;
                                 }
                                 .ExternalClass {
                                 width:100%;
                                 }
                                 .ExternalClass,
                                 .ExternalClass p,
                                 .ExternalClass span,
                                 .ExternalClass font,
                                 .ExternalClass td,
                                 .ExternalClass div {
                                 line-height:100%;
                                 }
                                 .es-button {
                                 mso-style-priority:100!important;
                                 text-decoration:none!important;
                                 }
                                 a[x-apple-data-detectors] {
                                 color:inherit!important;
                                 text-decoration:none!important;
                                 font-size:inherit!important;
                                 font-family:inherit!important;
                                 font-weight:inherit!important;
                                 line-height:inherit!important;
                                 }
                                 .es-desk-hidden {
                                 display:none;
                                 float:left;
                                 overflow:hidden;
                                 width:0;
                                 max-height:0;
                                 line-height:0;
                                 mso-hide:all;
                                 }
                                 .es-button-border:hover a.es-button {
                                 background:#3533c6!important;
                                 border-color:#3533c6!important;
                                 }
                                 td .es-button-border:hover a.es-button-1 {
                                 background:#405a72!important;
                                 border-color:#405a72!important;
                                 }
                                 td .es-button-border-2:hover {
                                 background:#405a72!important;
                                 }
                                 td .es-button-border-3:hover {
                                 border-style:solid solid solid solid!important;
                                 background:#3533c6!important;
                                 border-color:#3533c6 #3533c6 #3533c6 #3533c6!important;
                                 }
                                 @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
                              </style>
                           </head>
                           <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                              <div class="es-wrapper-color" style="background-color:#F6F6F6">
                                 <!--[if gte mso 9]>
                                 <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                                 </v:background>
                                 <![endif]--> 
                                 <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
                                    <tr style="border-collapse:collapse">
                                       <td valign="top" style="padding:0;Margin:0">
                                          <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                             <tr style="border-collapse:collapse">
                                                <td align="center" style="padding:0;Margin:0">
                                                   <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                                      <tr style="border-collapse:collapse">
                                                         <td align="left" bgcolor="#F1F0EF" style="padding:35px;Margin:0;background-color:#F1F0EF">
                                                            <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                               <tr style="border-collapse:collapse">
                                                                  <td valign="top" align="center" style="padding:0;Margin:0;width:530px">
                                                                     <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="left" bgcolor="#fff" style="padding:0;Margin:0;padding-left:30px;padding-right:30px;padding-top:35px">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:32px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:64px;color:#000000;border-bottom:1px solid #E6E4E2"><strong>Verify your email address</strong>&nbsp;</p>
                                                                           </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="left" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000">Hi ${userInfo.userName
                     },<br><br>Welcome to BioLabs ${userInfo.userRole == 3 ? 'Insight' : 'Connect'}!<br><br>Your account has been created and is ready for use. Please click the button below to set your password and get going.</p>
                                                                           </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="center" bgcolor="#fff" style="padding:0;Margin:0;padding-left:30px;padding-right:30px">
                                                                              <!--[if mso]>
                                                                              <a href="" target="_blank">
                                                                                 <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" stripoVmlButton href="" 
                                                                                    style="height:49px;v-text-anchor:middle;width:469px;" arcsize="6%" strokecolor="#0f9792" fillcolor="#0f9792">
                                                                                    <w:anchorlock></w:anchorlock>
                                                                                    <center style='color:#ffffff;font-family:lato, "helvetica neue", helvetica, arial, sans-serif;font-size:16px;font-weight:400;'><b style="color:white;">Set your Password</b></center>
                                                                                 </v:roundrect>
                                                                              </a>
                                                                              <![endif]--> 
                                                                              <!--[if !mso]><!-- --><span class="msohide es-button-border es-button-border-3" style="border-style:solid;border-color:#0f9792;background:#0f9792;border-width:1px;display:block;border-radius:3px;width:auto;mso-hide:all"><a href="${userInfo.origin +
                     EMAIL.EMAIL_CONFIRM_URL +
                     userInfo.token
                     }" class="es-button msohide" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:16px;color:#FFFFFF;border-style:solid;border-color:#0f9792;border-width:15px 20px;display:block;background:#0f9792;border-radius:3px;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center;mso-hide:all">Set your Password</a></span> 
                                                                              <!--<![endif]-->
                                                                           </td>
                                                                        </tr>
                                                                        
                                                                        <tr style="border-collapse:collapse">
                                                                        <td align="left" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                        <p href="" class="es-button msohide" target="_blank" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000">Or click on:  <a href="${userInfo.origin +
                     EMAIL.EMAIL_CONFIRM_URL +
                     userInfo.token
                     }" target="_blank" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:20px;color:#167efb;word-break: break-all;">${userInfo.origin + EMAIL.EMAIL_CONFIRM_URL + userInfo.token
                     }</a> </p>
                                                                     </td>
                                                                        </tr>
                                                                        <tr style="border-collapse:collapse">
                                                                           <td align="center" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                              <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000"><br>©&nbsp;<span style="font-size:14px;line-height:21px"></span>2021 BioLabs<br><span style="font-size:10px">ALL RIGHTS RESERVED</span></p>
                                                                           </td>
                                                                        </tr>
                                                                     </table>
                                                                  </td>
                                                               </tr>
                                                            </table>
                                                         </td>
                                                      </tr>
                                                   </table>
                                                </td>
                                             </tr>
                                          </table>
                                       </td>
                                    </tr>
                                 </table>
                              </div>
                           </body>
                        </html>`,
               },
               toRecipients: [
                  {
                     emailAddress: {
                        address: tenant.tenantEmail
                           ? tenant.tenantEmail
                           : tenant.officialEmail,
                     },
                  },
               ],
               ccRecipients: [],
            },
         };
         if (EMAIL.CC_EMAIL_USER) {
            data.message.ccRecipients.push({
               emailAddress: {
                  address: EMAIL.CC_EMAIL_USER,
               },
            });
         }
      } else if (content == ApplicationConstants.EMAIL_CONTENT_PARAM_FOR_RESIDENT_COMPANY_FORM_SUBMISSION) {
         data = {
            message: {
               subject: subject,
               body: {
                  contentType: EMAIL.CONTENT_TYPE,
                  content: this.replaceParams(
                     residentCompanyFormSubmission.toString(),
                     userInfo.company_name,
                     userInfo.origin + EMAIL.EMAIL_SUBMITTED_APPLICATION + userInfo.token,
                     userInfo.origin + EMAIL.EMAIL_CONFIRM_URL + userInfo.token,
                     userInfo.primarySite.toString(),
                     sitesAppliedList
                  ),
               },
               toRecipients: tenant,
               ccRecipients: [],
            },
         };
         if (EMAIL.CC_EMAIL_USER) {
            data.message.ccRecipients.push({
               emailAddress: {
                  address: EMAIL.CC_EMAIL_USER,
               },
            });
         }
      } else if (content == ApplicationConstants.EMAIL_CONTENT_PARAM_FOR_SPACE_CHANGE_REQUEST_SUBMITTED) {
         data = {
            message: {
               subject: subject,
               body: {
                  contentType: EMAIL.CONTENT_TYPE,
                  content: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                     <head>
                        <meta charset="UTF-8">
                        <meta content="width=device-width, initial-scale=1" name="viewport">
                        <meta name="x-apple-disable-message-reformatting">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta content="telephone=no" name="format-detection">
                        <title>New email</title>
                        <!--[if (mso 16)]>
                        <style type="text/css">
                           a {text-decoration: none;}
                        </style>
                        <![endif]--> 
                        <!--[if gte mso 9]>
                        <style>sup { font-size: 100% !important; }</style>
                        <![endif]--> 
                        <!--[if gte mso 9]>
                        <xml>
                           <o:OfficeDocumentSettings>
                              <o:AllowPNG></o:AllowPNG>
                              <o:PixelsPerInch>96</o:PixelsPerInch>
                           </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]--> 
                        <!--[if !mso]><!-- --> 
                        <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
                        <!--<![endif]--> 
                        <style type="text/css">
                           #outlook a {
                           padding:0;
                           }
                           .ExternalClass {
                           width:100%;
                           }
                           .ExternalClass,
                           .ExternalClass p,
                           .ExternalClass span,
                           .ExternalClass font,
                           .ExternalClass td,
                           .ExternalClass div {
                           line-height:100%;
                           }
                           .es-button {
                           mso-style-priority:100!important;
                           text-decoration:none!important;
                           }
                           a[x-apple-data-detectors] {
                           color:inherit!important;
                           text-decoration:none!important;
                           font-size:inherit!important;
                           font-family:inherit!important;
                           font-weight:inherit!important;
                           line-height:inherit!important;
                           }
                           .es-desk-hidden {
                           display:none;
                           float:left;
                           overflow:hidden;
                           width:0;
                           max-height:0;
                           line-height:0;
                           mso-hide:all;
                           }
                           .es-button-border:hover a.es-button {
                           background:#3533c6!important;
                           border-color:#3533c6!important;
                           }
                           td .es-button-border:hover a.es-button-1 {
                           background:#405a72!important;
                           border-color:#405a72!important;
                           }
                           td .es-button-border-2:hover {
                           background:#405a72!important;
                           }
                           td .es-button-border-3:hover {
                           border-style:solid solid solid solid!important;
                           background:#3533c6!important;
                           border-color:#3533c6 #3533c6 #3533c6 #3533c6!important;
                           }
                           @media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-width:10px 0px 10px 0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
                        </style>
                     </head>
                     <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                        <div class="es-wrapper-color" style="background-color:#F6F6F6">
                           <!--[if gte mso 9]>
                           <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                              <v:fill type="tile" color="#f6f6f6"></v:fill>
                           </v:background>
                           <![endif]--> 
                           <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
                              <tr style="border-collapse:collapse">
                                 <td valign="top" style="padding:0;Margin:0">
                                    <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                                       <tr style="border-collapse:collapse">
                                          <td align="center" style="padding:0;Margin:0">
                                             <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                                <tr style="border-collapse:collapse">
                                                   <td align="left" bgcolor="#F1F0EF" style="padding:35px;Margin:0;background-color:#F1F0EF">
                                                      <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                         <tr style="border-collapse:collapse">
                                                            <td valign="top" align="center" style="padding:0;Margin:0;width:530px">
                                                               <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                                                  <tr style="border-collapse:collapse">
                                                                     <td align="left" bgcolor="#fff" style="padding:0;Margin:0;padding-left:30px;padding-right:30px;padding-top:35px">
                                                                        <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:32px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:64px;color:#000000;border-bottom:1px solid #E6E4E2"><strong>Dear Site Admin:</strong>&nbsp;</p>
                                                                     </td>
                                                                  </tr>
                                                                  <tr style="border-collapse:collapse">
                                                                     <td align="left" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                        <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000">You have received a new plan change request. Please log in to view or click this link:
                                                                     </td>
                                                                  </tr>
                                                                  
                                                                  <tr style="border-collapse:collapse">
                                                                  <td align="left" bgcolor="#fff" style="Margin:0;;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                  <p href="" class="es-button msohide" target="_blank" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000">Click on:  <a href="${userInfo.origin +
                     EMAIL.EMAIL_SUBMITTED_SPACE_CHANGE_WAITLIST
                     }" target="_blank" style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:20px;color:#167efb;word-break: break-all;">${userInfo.origin + EMAIL.EMAIL_SUBMITTED_SPACE_CHANGE_WAITLIST
                     }</a> </p>
                                                               </td>
                                                                  </tr>

                                                                  <tr style="border-collapse:collapse">
                                                                     <td align="center" bgcolor="#fff" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px">
                                                                        <p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#000000"><br>©&nbsp;<span style="font-size:14px;line-height:21px"></span>2021 BioLabs<br><span style="font-size:10px">ALL RIGHTS RESERVED</span></p>
                                                                     </td>
                                                                  </tr>
                                                               </table>
                                                            </td>
                                                         </tr>
                                                      </table>
                                                   </td>
                                                </tr>
                                             </table>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                           </table>
                        </div>
                     </body>
                  </html>`,
               },
               toRecipients: tenant,
               ccRecipients: [],
            },
         };
         if (EMAIL.CC_EMAIL_USER) {
            data.message.ccRecipients.push({
               emailAddress: {
                  address: EMAIL.CC_EMAIL_USER,
               },
            });
         }
      } else if (content == ApplicationConstants.EMAIL_CONTENT_PARAM_FOR_SPONSORSHIP_QN_CHANGE_TO_YES) {
         data = {
            message: {
               subject: subject,
               body: {
                  contentType: EMAIL.CONTENT_TYPE,
                  content: this.replaceParams(
                     mailTemplateSponsorQnChange.toString(),
                     userInfo.company_name,
                     userInfo.origin + EMAIL.RESIDENT_COMPANIES + userInfo.companyId + EMAIL.COMPANY_ADMIN,
                     userInfo.origin + EMAIL.RESIDENT_COMPANIES + userInfo.companyId + EMAIL.COMPANY_ADMIN
                  )
               },
               toRecipients: tenant,
               ccRecipients: [],
            },
         };
         if (EMAIL.CC_EMAIL_USER) {
            data.message.ccRecipients.push({
               emailAddress: {
                  address: EMAIL.CC_EMAIL_USER,
               },
            });
         }
      } else if (content == ApplicationConstants.EMAIL_PARAM_FOR_SPONSOR_MAIL_SCHEDULED) {
         debug(`Preparing html to send mail to sponsor users as scheduled`, __filename, `sendEmailGraphAPI()`);
         let htmlOnboarded = this.getCompanyDataHtmlTable(userInfo, ApplicationConstants.ONBOARDED_COMPANIES);
         data = {
            message: {
               subject: subject,
               body: {
                  contentType: EMAIL.CONTENT_TYPE,
                  content: this.replaceParams(
                     mailTemplateSponsorSchedule.toString(),
                     userInfo.userName,
                     ApplicationConstants.EMAIL_INTRO_TEXT_FOR_SPONSOR_MAIL_SCHEDULED,
                     this.getCountText(userInfo, ApplicationConstants.ONBOARDED_COMPANIES),
                     htmlOnboarded,
                     this.getCountText(userInfo, ApplicationConstants.GRADUATED_COMPANIES),
                     this.getCompanyDataHtmlTable(userInfo, ApplicationConstants.GRADUATED_COMPANIES),
                     userInfo.ui_server_origin,
                     ApplicationConstants.BIOLABS_CONNECT_PLATFORM,
                  )
               },
               toRecipients: [
                  {
                     emailAddress: {
                        address: tenant.tenantEmail
                           ? tenant.tenantEmail
                           : tenant.officialEmail,
                     },
                  },
               ],
               ccRecipients: [],
            },
         };
         if (EMAIL.CC_EMAIL_USER) {
            data.message.ccRecipients.push({
               emailAddress: {
                  address: EMAIL.CC_EMAIL_USER,
               },
            });
         }
      }

      let authToken = token['token_type'] + ' ' + token['access_token'];
      axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      axios.defaults.headers.post['Authorization'] = authToken;
      await axios.post(process.env.APPSETTING_MICROSOFT_EMAIL_ENDPOINT_MAIL, data)
         .then((response) => {
            return response.data;
         })
         .catch((error) => {
            return error;
         });
      info("Email sent successfully " + __filename, "sendEmailGraphAPI()");
   }

   /**
    * Description: This method will send mail
    * @description This method will send mail
    */
   async sendEmail(tenant: any, subject: string, content: string, userInfo: any) {

      /** Graph API Token Generation implementation */
      const tokenGraphAPI = await this.getGrapAPIToken();
      try {
         /** Graph API Send Email implementation */
         await this.sendEmailGraphAPI(tenant, tokenGraphAPI, subject, content, userInfo);

      } catch (err) {
         error("Error in sending email..." + err, __filename, "sendEmail");
         // throw new BiolabsException("Error in sending email... "+err); 
      }
   }

   // ==================== BIOL-235/BIOL-162 ===================
   /**
    * Description Format html file contents with dynamic values.
    * @description Format html file contents with dynamic values.
    * @param string Html file contents.
    * @param replacements Dynamic values to set in template.
    * @returns The formatted html contents.
    */
   replaceParams(string, ...replacements) {
      info(`Replace contents in html string as per parameters`, __filename, `replaceParams()`);
      return string.replace(/\{(\d+)\}/g, function () {
         return replacements[arguments[1]];
      });
   }

   /**
    * Description: Prepares full html table for onboarded/graduated companies.
    * @description Prepares full html table for onboarded/graduated companies.
    * @param userInfo An object with user and company data
    * @returns Prepared html table with company data
    */
   getCompanyDataHtmlTable(userInfo: any, forWhat: string) {
      info(`Get html table for graduated companies`, __filename, `getGraduatedHtmlTable()`);
      let companyRowData: any;
      if (forWhat == ApplicationConstants.ONBOARDED_COMPANIES) {
         companyRowData = this.getOnboardedCompanyRows(userInfo.onboardedCompsObj, userInfo);
      } else if (forWhat == ApplicationConstants.GRADUATED_COMPANIES) {
         companyRowData = this.getGraduatedCompanyRows(userInfo.graduatedCompsObj, userInfo);
      }
      let htmlTable = `
         <table style="width:100%; margin-left:10px; margin-right:10px;" border="0">
            <tbody>
               {0}
            </tbody>
         </table>
         `;
      return this.replaceParams(htmlTable, companyRowData)
   }

   /**
    * Description: Prepares html rows for recently onboarded company data.
    * @description Prepares html rows for recently onboarded company data.
    * @param graduatedCompsObj Onboarded company objects
    * @param origin The server origin
    * @returns The html string with prepared rows
    */
   getOnboardedCompanyRows(onboardedCompsObj: any, userInfo: any) {
      let rowData = ``;
      if (onboardedCompsObj) {
         for (const siteName in onboardedCompsObj) {
            if (Object.prototype.hasOwnProperty.call(onboardedCompsObj, siteName)) {
               // rowData +=
               //    `
               //    <tr>
               //       <td colspan="3" style="padding-top:10px; padding-bottom:20px;"><strong>${siteName}:</strong></td>
               //    </tr>
               //    `;
               const companies = onboardedCompsObj[siteName];
               if (companies && Array.isArray(companies)) {
                  // if (companies.length < 1) {
                  //    rowData +=
                  //       `
                  //       <tr>
                  //          <td colspan="3">No recently moved in companies</td>
                  //       </tr>
                  //       `;
                  // }
                  // if() {
                  for (const company of companies) {
                     let companyUrl = userInfo.ui_server_origin + "resident-companies/" + company.id + "/company";
                     rowData +=
                        `<tr>
                              <td style="width:18%">
                                 <img src= "${this.prepareCompanyLogoUrl(userInfo.api_server_origin, userInfo.ui_server_origin, company)}" alt="${company.companyName}" width="${ApplicationConstants.COMPANY_LOGO_WIDTH_IN_EMAIL}" height="${ApplicationConstants.COMPANY_LOGO_HEIGHT_IN_EMAIL}"/>
                              </td>
                              <td style="width:42%; padding-top:5px; padding-bottom:5px;">
                                 <a href = "${companyUrl}">${company.companyName}</a>
                              </td>
                              <td style="width:40%">
                                 ${siteName}
                              </td>
                           </tr>
                           `;
                     companyUrl = '';
                  }
                  // }
               } else {
                  rowData +=
                     `<tr></tr>
                   <tr>
                    <td colspan="3" style="padding-top:5px;">${companies}</td>
                   </tr>
                   <tr></tr>
                   <tr></tr>`;
               }
            }
         }
      }
      return rowData;
   }

   /**
    * Description: Prepares html rows for recently graduated company data.
    * @description Prepares html rows for recently graduated company data.
    * @param graduatedCompsObj Graduated company objects
    * @param origin The server origin
    * @returns The html string with prepared rows
    */
   getGraduatedCompanyRows(graduatedCompsObj: any, userInfo: any) {
      info(`Get html rows for graduated companies`, __filename, `getGraduatedCompanyRows()`);
      let rowData = ``;
      if (graduatedCompsObj) {
         for (const siteName in graduatedCompsObj) {
            if (Object.prototype.hasOwnProperty.call(graduatedCompsObj, siteName)) {
               // rowData +=
               //    `
               // <tr>
               //    <td colspan="3" style="padding-top:10px; padding-bottom:20px;"><strong>${siteName}:</strong></td>
               // </tr>
               // `;

               const companies = graduatedCompsObj[siteName];
               debug(`Get html rows for graduated companies for site: ${siteName}`, __filename, `getGraduatedCompanyRows()`);
               if (companies && Array.isArray(companies)) {
                  // if (companies.length < 1) {
                  //    rowData +=
                  //       `
                  //       <tr>
                  //          <td colspan="3">No recently graduated companies</td>
                  //       </tr>
                  //       `;
                  // } else {
                  for (const company of companies) {
                     let companyUrl = userInfo.ui_server_origin + "resident-companies/" + company.id + "/company";
                     rowData +=
                        `<tr>
                              <td style="width:18%">
                                 <img src= "${this.prepareCompanyLogoUrl(userInfo.api_server_origin, userInfo.ui_server_origin, company)}" alt="${company.companyName}" width="${ApplicationConstants.COMPANY_LOGO_WIDTH_IN_EMAIL}" height="${ApplicationConstants.COMPANY_LOGO_HEIGHT_IN_EMAIL}"/>
                              </td>
                              <td style="width:42%; padding-top:5px; padding-bottom:5px;">
                                 <a href = "${companyUrl}">${company.companyName}</a>
                              </td>
                              <td style="width:40%">
                                ${siteName}
                              </td>
                           </tr>
                           `;
                     companyUrl = '';
                  }
                  // }
               } else {
                  rowData +=
                     `
                   <tr>
                    <td colspan="3" style="padding-top:5px;">${companies}</td>
                   </tr>
                   `;
               }
            }
         }
      }
      return rowData;
   }

   /**
    * Description: Prepares company logo url with server origin, logo path
    * @description Prepares company logo url with server origin, logo path
    * @param origin Server origin url
    * @param company Resident company object
    * @returns The company logo url
    */
   prepareCompanyLogoUrl(apiServerOrigin: string, uiServerOrigin: string, company: any) {
      info(`Prepare company logo url, origin ${apiServerOrigin}`, __filename, `prepareCompanyLogoUrl()`);
      if (company && company.logoUrl) {
         return `${apiServerOrigin}${ApplicationConstants.LOGO_PATH}${company.logoUrl}`;
      } else {
         return `${uiServerOrigin}${ApplicationConstants.DEFAULT_COMPANY_LOGO_PATH}`;
      }
   }

   /**
    * Description: Changes date format to "dd Mon yyyy"
    * @description Changes date format to "dd Mon yyyy"
    * @param date Date
    * @returns string date with format dd Mon yyyy
    */
   public getFormattedDateDD_Mon_YYYY(date: Date) {
      info(`Change date format to dd Mon yyyy for date: ${date}`, __filename, `getFormattedDateDD_Mon_YYYY()`);
      if (date) {
         return `${date.getDate()} ${ApplicationConstants.MONTHS[date.getMonth()]} ${date.getFullYear()}`;
      }
      return '';
   }

   /**
    * Description: Return a string with count of onboarded/graduated companies.
    * @description Return a string with count of onboarded/graduated companies.
    * @param userInfo UserInfo object
    * @param flag Refers ONBOARDED/GRADUATED companies
    * @returns String with count of onboarded/graduated companies
    */
   private getCountText(userInfo: any, flag: string) {

      if (flag == ApplicationConstants.ONBOARDED_COMPANIES) {
         if (userInfo.companiesCount.onboardedCompsCount && userInfo.companiesCount.onboardedCompsCount == 1) {
            return ApplicationConstants.EMAIL_TEXT_RECENTLY_JOINED_A_COMPANY.replace('{0}', userInfo.companiesCount.onboardedCompsCount).replace('{1}', ':');
         } else if (userInfo.companiesCount.onboardedCompsCount && userInfo.companiesCount.onboardedCompsCount > 1) {
            return ApplicationConstants.EMAIL_TEXT_RECENTLY_JOINED_COMPANIES.replace('{0}', userInfo.companiesCount.onboardedCompsCount).replace('{1}', ':');
         } else {
            return ApplicationConstants.EMAIL_TEXT_RECENTLY_JOINED_COMPANIES.replace('{0}', 'No').replace('{1}', '.');
         }
      } else if (flag == ApplicationConstants.GRADUATED_COMPANIES) {
         if (userInfo.companiesCount.graduatedCompsCount && userInfo.companiesCount.graduatedCompsCount == 1) {
            return ApplicationConstants.EMAIL_TEXT_RECENTLY_GRADUATED_A_COMPANY.replace('{0}', userInfo.companiesCount.graduatedCompsCount).replace('{1}', ':');
         } else if (userInfo.companiesCount.graduatedCompsCount && userInfo.companiesCount.graduatedCompsCount > 1) {
            return ApplicationConstants.EMAIL_TEXT_RECENTLY_GRADUATED_COMPANIES.replace('{0}', userInfo.companiesCount.graduatedCompsCount).replace('{1}', ':');
         } else {
            return ApplicationConstants.EMAIL_TEXT_RECENTLY_GRADUATED_COMPANIES.replace('{0}', 'No').replace('{1}', '.');
         }
      }
   }
}