module.exports = async ({ github, context }) => {
  console.log('Processing pull request number: ', context.issue.number)
  if (context.payload.action == "opened") {
    console.log("Trigger Event: ", context.payload.action);
    const size =
      context.payload.pull_request.additions +
      context.payload.pull_request.deletions;
    let labelsToAdd = "";
    if (size < 9) {
      labelsToAdd = "size:XS";
    } else if (size < 49) {
      labelsToAdd = "size:S";
    } else if (size < 249) {
      labelsToAdd = "size:M";
    } else if (size < 999) {
      labelsToAdd = "size:L";
    } else {
      labelsToAdd = "size:XL";
    }
    console.log('Applying size label : ', labelsToAdd)
    return github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      labels: [labelsToAdd],
    });
  } 
  else if (context.payload.action == "synchronize") {
    console.log("Trigger Event: ", context.payload.action);
    console.log(
      "Github event: pull_request updated with new code for PR number = ",
      context.issue.number
    );
    const labelsToRemove = ["awaiting review"];
    return github.rest.issues.removeLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      labels: labelsToRemove,
    });
  }
   else if (context.payload.action == "closed") {
    console.log("Trigger Event: ", context.payload.action);
    console.log(
      "Github event: pull_request updated with new code for PR number =",
      context.payload.pull_request.number
    );
    const labelsToRemove = ["awaiting review"];
    return github.rest.issues.removeLabel({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      labels: labelsToRemove,
    });
  } 
  else if (context.payload.action == "review_requested") {
    console.log(
      "Github event: pull_request review requested for PR number =",
      context.payload.pull_request.number
    );
    let labelsToAdd = ["awaiting review"];
    return github.rest.issues.addLabels({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      labels: labelsToAdd,
    });
  }
};
