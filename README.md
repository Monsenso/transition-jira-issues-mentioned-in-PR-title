#

## Inputs   

### jiraBaseUrl

**Requried** The base URL of the Jira server.

### jiraEmail

**Requried** The email of the user to authenticate as.

### jiraApiToken

**Requried** The API token for the user to authenticated as.

### transitionId

**Requried** The transition to apply to issues mentioned in the PR title.

### failOnApiError:
    If false then Jira API error responses are ignored, e.g. when it is not possible to
    transition the issue. **Defaults to true**

## Example usage

uses: 'monsenso/transition-jira-issues-mentioned-in-PR-title@3e282ba78b0ccbff917eccadabc849a2ca78b61a'
with:
  jiraBaseUrl: https://some.atlassian.net
  jiraEmail: <jira-user-email>
  jiraApiToken: '${{ secrets.JIRA_API_TOKEN }}'
  transitionId: 21
