[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)

# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented.

| Feature                   | Description               | E2E Tests                                     | Component Tests                                   | Jest Tests                       |
| ------------------------- | ------------------------- | --------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| Search & filter questions | Search & filter questions | client/cypress/e2e/searchAndFilterPosts.cy.js | client/cypress/component/topbar.cy.js             | server/tests/question.test.js    |
| View Post                 | View & interact with Post | client/cypress/e2e/viewQuestion.cy.js         | client/cypress/component/questionCard.cy.js       | server/tests/newQuestion.test.js |
| Create Post               | Create Post               | client/cypress/e2e/newQuestionPage.cy.js      | client/cypress/component/newQuestionPage.cy.js    | server/tests/newQuestion.test.js |
| Voting on Posts           | Vote on post              | client/cypress/e2e/votingOnPosts.cy.js        | client/cypress/component/questionCard.cy.js       | server/tests/newQuestion.test.js |
| Tagging Posts             | Tag & Use tags            | client/cypress/e2e/taggingPosts.cy.js         | client/cypress/component/tagCard.cy.js            | server/tests/tag.test.js         |
| Post Moderation           | Moderate posts            | client/cypress/e2e/postModeration.cy.js       | client/cypress/component/questionCard.cy.js       | server/tests/newQuestion.test.js |
| Create Answer             | Answer questions          | client/cypress/e2e/createNewAnswer.cy.js      | client/cypress/component/answerList.cy.js         | server/tests/newAnswer.test.js   |
| Profile page              | Profile page for user     | client/cypress/e2e/profilePage.cy.js          | client/cypress/component/questionByUserList.cy.js | server/tests/newQuestion.test.js |
| Login & Signup            | Login & signup            | client/cypress/e2e/signupPage.cy.js           | client/cypress/component/signUpPage.cy.js         | server/tests/user.test.js        |

. . .

## Instructions to generate and view coverage report

For jest Coverage:(server and client should be stopped before running this command)
1.cd server
2.Run npx jest --collectCoverage

For cypress Coverage:(server, client and localhost mongodb should be up and running before running this command)
1.go to client - cd client
2.Run npx cypress run --headless --browser chrome --spec "cypress/e2e/\*.js" --env coverage=true

## Extra Credit Section (if applicable)
