
const CONSTENT_VALUES = require('./constant');
/*
Invoked from staleCSAT.js and CSAT.yaml file to 
post survey link in closed issue.
*/
module.exports = async ({ github, context }) => {
    //     const issue = context.payload.issue.html_url;
    let base_url = '';
    console.log("line 10")


    let issues = await github.rest.issues.listForRepo({
        owner: context.repo.owner,
        repo: context.repo.repo,
        state: "open",
        labels: "stale"
    });


    if (issues.status != 200)
        return

    let issueList = issues.data

    for (let i = 0; i < issueList.length; i++) {
        let number = issueList[i].number;
        let resp = await github.rest.issues.listEventsForTimeline({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: number,
        });
        let events = resp.data;
        console.log("---------Issue number------- list", number)
        console.log("event list", events)
        let closeIssue = false
        for (let i = 0; i < events.length; i++) {
            let event_details = events[i];
            console.log("event_details", event_details)
            
            if (event_details.event == 'labeled' && event_details.label && event_details.label.name == "stale") {
                let currentDate = new Date();
                let labeledDate = new Date(event_details.created_at)
                console.log("time diff", currentDate - labeledDate)
                if (currentDate - labeledDate > 0)
                    closeIssue = true
            }
            if (event_details.event == 'unlabeled' && event_details.label && event_details.label.name == "stale")
                    closeIssue = false

        }
        if(closeIssue){
            octokit.rest.issues.update({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: number,
                state:"closed"
              });
        }
    }

}

