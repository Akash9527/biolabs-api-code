import { EMAIL } from '../constants/email';

const dotenv = require('dotenv');
const axios = require('axios');
const qs = require('qs');

dotenv.config();

const {
    MICROSOFT_EMAIL_APP_ID,
    MICROSOFT_EMAIL_APP_SECERET,
    MICROSOFT_EMAIL_ENDPOINT_TOKEN,
    MICROSOFT_EMAIL_ENDPOINT_MAIL,
    MICROSOFT_EMAIL_GRAPH_SCOPE,
    DB_PORT,
    DB_DATABASE,
} = process.env;

export class Email {

    /**
     * Description: This method will return the generated Access token for send mail
     * @description This method will return the generated Access token for send mail
     */
    async getGrapAPIToken() {
        try {
            const postData = {
                client_id: MICROSOFT_EMAIL_APP_ID,
                scope: MICROSOFT_EMAIL_GRAPH_SCOPE,
                client_secret: MICROSOFT_EMAIL_APP_SECERET,
                grant_type: 'client_credentials'
            };

            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            let token = '';
            await axios
                .post(MICROSOFT_EMAIL_ENDPOINT_TOKEN, qs.stringify(postData))
                .then(response => {
                    token = response.data;
                })
                .catch(error => {
                    console.log('error while fetching Graph API Response', error);
                });
            return token;
        } catch (ex) {
            console.error('error while fetching Graph API token information');
        }
    }
    
    private sendEmailGraphAPI(tenant: any, token: string, subject: string, content: string) {
        const data = {
            "message": {
                "subject": subject,
                "body": {
                    "contentType": EMAIL.CONTENT_TYPE,
                    "content": content
                },
                "toRecipients": [
                    {
                        "emailAddress": {
                            "address": tenant.tenantEmail ? tenant.tenantEmail : tenant.officialEmail
                        },
                    }
                ],
                "ccRecipients": [
                    {
                        "emailAddress": {
                            "address": EMAIL.CC_EMAIL_USER
                        }
                    }
                ]
            }
        };
        let authToken = token['token_type'] + " " + token['access_token'];
        axios.defaults.headers.post['Content-Type'] =
            'application/x-www-form-urlencoded';
        axios.defaults.headers.post['Authorization'] = authToken;
        axios
            .post(MICROSOFT_EMAIL_ENDPOINT_MAIL, data)
            .then(response => {
                console.log("Email has been Send", response.data);
            })
            .catch(error => {
                console.log("Error while Sending Graph API email ===> Lets call SendGridAPI");
            });
    }
    
    async sendEmail(tenant: any, subject: string, content: string) {

        /** Graph API Token Generation implementation */
        const tokenGraphAPI = await this.getGrapAPIToken();
        
        /** Graph API Send Email implementation */
        this.sendEmailGraphAPI(tenant, tokenGraphAPI, subject, content);
    }
}
