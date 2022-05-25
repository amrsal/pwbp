import { Reporter } from '@playwright/test/reporter';
import { execSync } from 'child_process'
import * as fs from 'fs';
import * as nodemailer from 'nodemailer'

const report_dir = './playwright-report'

let transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
        user: process.env.EMAIL_REPORTER,
        pass: process.env.EMAIL_PASS
    }
});

function mailOptions(result: any) {
    return {
        from: `Automation Test <${process.env.EMAIL_REPORTER}}>`,
        to: process.env.CI ? process.env.EMAIL_LIST : process.env.EMAIL_REPORTER,
        subject: `No-reply [MPRE-Automation] Result is: ${result}`,
        attachments: [{
            path: 'playwright-report.zip'
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
                                  <h2>MPRE - Public search</h2>
                              </td>
                              <td style="padding:2px 2px 0px;width:42.4496%" colspan="1" align="right" valign="center">
                                  <img title="Logo" src="https://storage.googleapis.com/pricehubble-production-homepage-static/img/favicon-180x180.937a8dc939bb.png" alt="Logo" width="100" height="81" class="CToWUd" jslog="138226; u014N:xr6bB; 53:W2ZhbHNlXQ..">
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
          <tr>
              <td style="padding:30px">
                  <h1 style="font-weight:normal">Test status run is: ${result}</h1>
                  <p>Test Env:</p>
                  <ul><li>Branch: ${process.env.CIRCLE_BRANCH}
                  </li></ul>
                  <p>The link below will take you to last deployment log, or check the attached zip report</p>
                  <span style="color:#0568ae"> <a style="color:#0568ae" href="https://app.circleci.com/pipelines/bitbucket/pricehubble/mpre-search?branch=${process.env.CIRCLE_BRANCH}&filter=all">Click here </a></span>
              </td>
          </tr>
          <tr style="background:#0568ae;height:10px">
              <td>&nbsp;</td>
          </tr>
          <tr style="background-color:#272e47">
              <td style="padding:30px;color:#fff">
                  <table style="width:100%">
                      <tbody>
                          <tr style="height:53.6333px">
                              <td style="padding:2px 2px 0px;width:642.905%;color:#ffffff;height:53.6333px" colspan="10" align="left" valign="center">This is an automated message.<br>We do not
                                  monitor replies to this email.<br> ©2022 PriceHubble <br>Scout Team</td>
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
        await (await transporter.sendMail(mailOptions(result))).response;
        console.log('-->> √ Email has been successfuly sent!!')
    } catch (err) {
        if (err instanceof Object) {
            if (JSON.parse(Object(err.responseCode)) == 552) {
                console.log('-->> √ Email has been successfuly sent with attached report!!')
            }
        } else {
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
                    console.log(`-->> √ Report Dir is successfully archived!`);
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