import { Reporter } from '@playwright/test/reporter';
import { execSync } from 'child_process'
import * as fs from 'fs';
import * as nodemailer from 'nodemailer'
import { configList } from '../pages/exporter';
const mg = require('nodemailer-mailgun-transport');

const report_dir = './playwright-report'

let transporter = nodemailer.createTransport(mg({
    auth: {
        api_key: configList.mailReporter.auth.token as string,
        domain: configList.mailReporter.auth.domain
    }
}
));

function mailOptions(result: any) {
    return {
        from: `Automation Test <${configList.mailReporter.email}}>`,
        to: process.env.CI ? configList.mailReporter.email_list : process.env.EMAIL_REPORTER,
        subject: `No-reply [${configList.project_name} - e2e] Result is: ${result}`,
        attachments: [{
            filename: 'report.zip',
            content: fs.readFileSync('./playwright-report.zip'),
            encoding: 'applcation/zip'
        }],
        html:
            `<div id=":p0" class="a3s aiL adM"><div class="HOEnZb"><div class="adm"><div id="q_29" class="ajR h4" data-tooltip="Hide expanded content" aria-label="Hide expanded content" aria-expanded="true"><div class="ajT"></div></div></div><div class="im"><table style="font-family:sans-serif" width="100%" cellspacing="0" cellpadding="0">
      <tbody>
          <tr style="background:#272e47">
              <td style="padding:30px;color:#fff;font-weight:500;font-size:24px" align="left">
                  <table style="width:100%">
                      <tbody>
                          <tr>
                              <td style="padding:2px 2px 0px;width:565.567%;color:#ffffff" colspan="10" align="left" valign="center">
                                  <h2>${configList.project_name}</h2>
                              </td>
                              <td style="padding:2px 2px 0px;width:42.4496%" colspan="1" align="right" valign="center">
                                  <img title="Logo" src=${configList.project_logo} alt="Logo" width="100" height="81" class="CToWUd" jslog="138226; u014N:xr6bB; 53:W2ZhbHNlXQ..">
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
          <tr>
              <td style="padding:30px">
                  <h1 style="font-weight:normal">
                  Test status run is: <span style="font-weight:bold;color:${result == 'PASSED' ? 'green' : '#990045'}">${result}</span></h1> 
                  <p>Details:</p>
                  <ul>
                  <li>Branch: ${process.env.CIRCLE_BRANCH}</li>
                  <li>Circle Job: ${process.env.CIRCLE_JOB}</li>
                  <li>Build Number: ${process.env.CIRCLE_BUILD_NUM}</li>
                  </ul>
                  <p>The link below will take you to last deployment log, or check the attached zip report</p>
                  <span style="color:#0568ae"> <a style="color:#0568ae" href="${process.env.CIRCLE_BUILD_URL}">Click here for build url</a></span>
              </td>
          </tr>
          <tr style="background:${result == 'PASSED' ? '#0568ae' : '#990045'};height:10px">
              <td>&nbsp;</td>
          </tr>
          <tr style="background-color:#272e47">
              <td style="padding:30px;color:#fff">
                  <table style="width:100%">
                      <tbody>
                          <tr style="height:53.6333px">
                              <td style="padding:2px 2px 0px;width:642.905%;color:#ffffff;height:53.6333px" colspan="10" align="left" valign="center">This is an automated message.<br>We do not
                                  monitor replies to this email.<br> ©2022 PriceHubble <br>${configList.team_name}</td>
                              <td style="padding:2px 2px 0px;width:53.0955%;height:53.6333px" colspan="1" align="right" valign="center"></td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table></div></div></div>`
    }
};

async function sendEmailReport(result: any) {
    try {
        (await transporter.sendMail(mailOptions(result))).response;
        console.log('-->> √ Email has been successfuly sent!!')
    } catch (err) {
        const errAlias = err as any
        if (errAlias instanceof Object && errAlias && errAlias.responseCode) {
            if (JSON.parse(Object(errAlias.responseCode)) == 552) {
                console.log('-->> √ Email has been successfuly sent with attached report!!')
            } else {
                console.log('-->> :( Email error found :')
                console.log(err)
            }
        } else {
            console.log('-->> :( Email err found :')
            console.log(err)
        }
    }
};

class MyReporter implements Reporter {

    async onEnd(result: { status: string; }) {
        if (process.env.CI) {
            if (fs.existsSync(report_dir)) {
                console.log(`-->> √ Report as ${report_dir} Dir has been found!`);
                try {
                    execSync('zip -r playwright-report.zip playwright-report', {
                        cwd: './',
                        timeout: 20000
                    });
                    console.log(`-->> √ Report Dir is successfully archived! with size`, fs.statSync('./playwright-report.zip').size)
                } catch (error) {
                    console.error(`-->> X Ops!, something went wrong unable to archive ${report_dir}`)
                } finally {
                    console.log(`-->> Please wait report is being sent to email box`);
                    await sendEmailReport(result.status.toUpperCase())
                }
            } else {
                console.error(`-->> X Ops!, something went wrong unable to find the ${report_dir}`)
            }
        }
    }
}
export default MyReporter;