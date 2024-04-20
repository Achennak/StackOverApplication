describe("New Question Page", () => {
  beforeEach(() => {
    cy.exec("node ../server/init.js mongodb://127.0.0.1:27017/fake_so");
  });

  afterEach(() => {
    cy.exec("node ../server/destroy.js mongodb://127.0.0.1:27017/fake_so");
  });

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('[data-testId="email-input-field"]').type("test@test.com");
    cy.get('[data-testId="password-input-field').type("1234");
    cy.get("button[type=submit").click();
    cy.contains("Ask Question").click();
    cy.wait(2000);
  });

  it('opens the modal when "Ask Question" button is clicked', () => {
    cy.get(".bg-gray-800").should("be.visible");
    cy.get(".bg-white").should("be.visible");
    cy.get('input[placeholder="Title"]').should("be.visible");
    cy.get('textarea[placeholder="Question text"]').should("be.visible");
    cy.get('input[placeholder="Tags (space-separated)"]').should("be.visible");
  });

  it("successfully adds a new question", () => {
    cy.get('input[placeholder="Title"]').type("Test Question Title");
    cy.get('textarea[placeholder="Question text"]').type("Test Question Text");
    cy.get('input[placeholder="Tags (space-separated)"]').type("tag1 tag2");
    cy.contains("Submit").click();
    cy.contains("Test Question Title").should("be.visible");
    cy.contains("Test Question Text").should("be.visible");
    cy.contains("tag1").should("be.visible");
    cy.contains("tag2").should("be.visible");
  });

  /*it("Ask a Question creates and displays in All Questions", () => {
    cy.get('input[placeholder="Title"]').type("Test Question Title");
    cy.get('textarea[placeholder="Question text"]').type("Test Question 1");
    cy.get('input[placeholder="Tags (space-separated)"]').type(
      "tag1 tag2 t3 t4 t5"
    );
    cy.contains("Submit").click();
    cy.contains("Test Question Title").should("be.visible");
    const qTitles = [
      "Test Question Title",
      "android studio save string shared preference, start activity and load the saved string",
      "Programmatically navigate using React router",
    ];
    qTitles.forEach((title) => {
      cy.contains(title).should("be.visible");
    });
  });*/

  it('closes the modal when "Cancel" button is clicked', () => {
    cy.contains("Cancel").click();
    cy.contains("Ask Question").should("be.visible");
    cy.get('[data-testId="home-page-search-box"]').should("be.visible");
  });

  it("displays error message when submitting with empty fields", () => {
    cy.contains("Submit").click();
    cy.stub(window, "alert").callsFake((message) => {
      expect(message).to.equal("Please enter a title (up to 100 characters).");
    });
  });

  it("Ask a Question with long title shows error", () => {
    cy.get('input[placeholder="Title"]').type(
      "Test Question 0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
    );
    cy.contains("Submit").click();
    cy.on("window:alert", (message) => {
      expect(message).to.equal("Please enter a title (up to 100 characters).");
    });
  });

  it("Ask a Question with empty text shows error", () => {
    cy.get('input[placeholder="Title"]').type("Test Question Title");
    cy.contains("Submit").click();
    cy.on("window:alert", (message) => {
      expect(message).to.equal("Please enter question text.It cant be empty");
    });
  });

  it("Ask a Question with empty tags shows error", () => {
    cy.get('input[placeholder="Title"]').type("Test Question Title");
    cy.get('textarea[placeholder="Question text"]').type("Test Question Text");
    cy.contains("Submit").click();
    cy.on("window:alert", (message) => {
      expect(message).to.equal("Please enter at least one tag.");
    });
  });

  it("Ask a Question with more than 5 tags shows error", () => {
    cy.get('input[placeholder="Title"]').type("Test Question Title");
    cy.get('textarea[placeholder="Question text"]').type("Test Question Text");
    cy.get('input[placeholder="Tags (space-separated)"]').type(
      "tag1 tag2 t3 t4 t5 t6"
    );
    cy.contains("Submit").click();
    cy.on("window:alert", (message) => {
      expect(message).to.equal("Please enter up to 5 tags.");
    });
  });

  it("Ask a Question with a long new tag shows error", () => {
    cy.get('input[placeholder="Title"]').type("Test Question Title");
    cy.get('textarea[placeholder="Question text"]').type("Test Question Text");
    cy.get('input[placeholder="Tags (space-separated)"]').type(
      "tag1 tag2 t3t4t5t6t7t8t9t3t4t5t6t7t8t9"
    );
    cy.contains("Submit").click();
    cy.on("window:alert", (message) => {
      expect(message).to.equal("Each tag should be up to 20 characters long.");
    });
  });

  /*it('Ask a Question creates and displays expected meta data', () => {
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('3 questions');
        cy.contains('joym asked 0 seconds ago');
        const answers = ['0 answers', '3 answers','2 answers'];
        const views = ['0 views', '121 views','10 views'];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
        });
        cy.contains('Unanswered').click();
        cy.get('.postTitle').should('have.length', 1);
        cy.contains('1 question');
    })


    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('t1');
        cy.contains('t2');
    })


    it('Ask a Question creates and displays in All Questions with necessary tags', () => {
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('javascript t1 t2');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();
        cy.contains('Fake Stack Overflow');
        cy.contains('javascript');
        cy.contains('android-studio');
        cy.contains('t2');
    })

    it('create a new question with a new tag and finds the question through tag', () => {
        
        // add a question with tags
        cy.get('#formTitleInput').type('Test Question A');
        cy.get('#formTextInput').type('Test Question A Text');
        cy.get('#formTagInput').type('test1-tag1 react');
        cy.get('#formUsernameInput').type('mks1');
        cy.contains('Post Question').click();

        // clicks tags
        cy.contains('Tags').click();
        cy.contains('test1-tag1').click();
        cy.contains('1 questions');
        cy.contains('Test Question A');

        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('2 questions');
        cy.contains('Test Question A');
        cy.contains('Programmatically navigate using React router');
    });


    it('Ask a Question creates and accepts only 1 tag for all the repeated tags', () => {
        cy.contains('Tags').click();
        cy.contains('4 Tags');
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test Question 1 Text');
        cy.get('#formTagInput').type('test-tag test-tag test-tag');
        cy.get('#formUsernameInput').type('joym');
        cy.contains('Post Question').click();
        cy.contains('test-tag').should('have.length',1);
        cy.contains('Tags').click();
        cy.contains('5 Tags');
        cy.contains('test-tag').click();
        cy.contains('1 questions');
    });*/
});
