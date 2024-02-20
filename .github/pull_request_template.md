<!---

Start your PR as a draft, once ready, click on Ready for review.

Provide a short summary in the Title above. Examples of good PR titles:

* "Feature: add so-and-so models"

* "Fix: deduplicate such-and-such"

* "Update: dbt version 1.0.1"

Your PR name should start by the PR type (Fix, Fea/Feature, Chore, ...).
Add the Linear issue ID in the PR name. e.g. Fix: initiate dim_users (GROCO-621).

-->

## Goal

<!---
Short summary for this PR. If not detailled in Linear, add more technical context to the issues this PR closes.
--->

## Solution

<!--- Describe the solution. Include links to any related PRs and/or issues.--->

## Output tests

_Use the [data-check](https://dev.data-check.core-ops.net/) tool to provide links to direct data comparison for modified dbt models._

<!---
Assess the solution implemented. Include links to the development dashboards that showcase the changes.
You can either use your dbt_development_* dataset or the dbt_cloud_pr_* dataset.

This is the most important part, so make sure that the business logic is tested and valid.
--->

## Submitter Checklist

_Everything must be checked before asking a review, any exceptions must be noted._

<details>
<summary><i>Click to toggle Submitter Checklist</i></summary>

- [ ] I have followed the modeling guidelines defined in this [document](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview).
- [ ] I have added appropriate [tests and documentation](https://docs.getdbt.com/docs/testing-and-documentation) to any new models in a `schema.yml` file. At minimum, unique, not nullable fields, and foreign key constraints should be tested, if applicable..
- [ ] My last dbt build upstream/downstream is a success and does not contain any warnings
- [ ] Output tests screenshots or dashboards links have been added.
- [ ] The PR name contains a relevant prefix (`feature:`, `fix:`, `refactor:`, `chore:`) and the Linear Issue ID.
</details>

## Reviewer Checklist

<details>
<summary><i>Click to toggle Reviewer Checklist</i></summary>

- [ ] The modeling guidelines defined in this [document](https://docs.getdbt.com/guides/best-practices/how-we-structure/1-guide-overview) have been followed.
- [ ] The appropriate [tests and documentation](https://docs.getdbt.com/docs/testing-and-documentation) have been added to any new models in a `schema.yml` file. At minimum, unique, not nullable fields, and foreign key constraints should be tested, if applicable..
- [ ] Output tests are valid. The business logic is valid based on the tests/charts provided.

</details>

## To-do after merge

<!---

(Remove this section if not needed)

Include any notes about things that need to happen after this PR is merged.

-->

#### Model refresh

Do I need to refresh some models immediately?

- [ ] Yes just a simple refresh -> Run manually the job in dbt Cloud.
- [ ] Yes but with Full Refresh on some specific models -> Ask DataOps to do it.
- [ ] No.

#### Communication

Did you alter any table structures (model name, column name, data type, column deletion, model materialization)?

- [ ] Yes -> Communicate about the changes in `#data-analytics-internal` with the link to this PR.
- [ ] No.
