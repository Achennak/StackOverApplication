// describe('Profile Page', () => {
//     beforeEach(() => {
//         // Login before each test
//         cy.visit("http://localhost:3000/login");
//         cy.get('[data-testId="email-input-field"]').type("user2@example.com");
//         cy.get('[data-testId="password-input-field"]').type("password456");
//         cy.get("button[type=submit]").click();

//         // After login, navigate to profile page
//         cy.get('[data-testid="user-img"]').click();
//         cy.contains('Visit Profile').click();
//         cy.url().should('include', '/profile');
//       });

//       it('should display user data correctly', () => {
//         cy.get('.text-xl').should('contain', 'user2');
//         cy.get('.text-gray-500').should('contain', 'user2@example.com');
//         cy.contains('.text-gray-500', 'Member since').should('exist');

//       });

//       it('should switch between tabs', () => {
//         cy.contains('button', 'Answers').click();
//         cy.get('.bg-blue-500').should('contain', 'Answers');
//         // Click on the Questions tab
//         cy.contains('button', 'Questions').click();
//         cy.get('.bg-blue-500').should('contain', 'Questions');
//       });

//       it('should display user questions and answers', () => {
//         // Click on the Questions tab
//         cy.contains('button', 'Questions').click();
//         // Ensure user questions are displayed
//         cy.get('.grid').find('.rounded-lg').should('have.length.gt', 0);

//         // Click on the Answers tab
//         cy.contains('button', 'Answers').click();
//         // Ensure user answers are displayed
//         cy.get('.grid').find('.rounded-lg').should('have.length.gt', 0);
//       });

//       it('should display user avatar', () => {
//         cy.get('img[alt="Profile"]').should('be.visible');
//       });
//   });
