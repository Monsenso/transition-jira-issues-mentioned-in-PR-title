const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const baseUrl = core.getInput('jiraBaseUrl');
        const email = core.getInput('jiraEmail');
        const apiToken = core.getInput('jiraApiToken');
        const transitionId = core.getInput('transitionId');
        const failOnApiError = core.getInput('failOnApiError') !== 'false';

        const title =
            github.context.payload &&
            github.context.payload.pull_request &&
            github.context.payload.pull_request.title;
        if (!title) {
            return;
        }

        const jiraIssueKeys = [];
        const matches = title.matchAll(/(PRO-\d+)\s*(?=(?:PRO-\d+\s*)*#close)/gi);
        for (match of matches) {
            jiraIssueKeys.push(match[1]);
        }

        if (jiraIssueKeys.length > 0) {
            for (const key of jiraIssueKeys) {
                await transitionIssue(
                    key,
                    transitionId,
                    baseUrl,
                    email,
                    apiToken,
                    failOnApiError);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

async function transitionIssue(issueId, transitionId, baseUrl, email, apiToken, failOnError) {
    const url = `${baseUrl}/rest/api/3/issue/${issueId}/transitions`;
    const body = JSON.stringify({ transition: { id: transitionId.toString() } });
    const credentials = Buffer.from(`${email}:${apiToken}`, 'binary').toString('base64');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    };

    const response = await fetch(url, { method: 'POST', body, headers });

    if (!response.ok) {
        console.log('POSTed ' + body);
        console.log('to: ' + url);
        console.error(await response.text());
        console.error(response);

        if (failOnError) {
            throw new Error(response.statusText);
        }
    }
}

run();
