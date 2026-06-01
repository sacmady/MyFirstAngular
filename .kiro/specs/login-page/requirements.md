# Requirements Document

## Introduction

This feature adds a Login Page and a Welcome Page to the MyFirstAngular application. The Login Page accepts user credentials, validates them against a known admin account, and — on success — navigates the user to a Welcome Page that displays a personalised greeting. On failure, the user is informed of the invalid credentials and remains on the Login Page. All UI is delivered through Angular's router using lazy-loaded standalone components.

## Glossary

- **Login_Page**: The standalone Angular component rendered at the `/login` route that presents the credential form.
- **Welcome_Page**: The standalone Angular component rendered at the `/welcome` route that displays the post-login greeting.
- **Auth_Service**: The injectable Angular service responsible for validating credentials and maintaining authentication state.
- **Router**: The Angular Router service used to navigate between routes.
- **Credentials**: A username and password pair submitted by the user.
- **Admin_Account**: The single valid account with username `admin` and password `pwd`.

---

## Requirements

### Requirement 1: Display the Login Form

**User Story:** As a user, I want to see a login form with username and password fields, so that I can enter my credentials to access the application.

#### Acceptance Criteria

1. THE Login_Page SHALL render a form containing a username text input, a password input, and a submit button.
2. THE Login_Page SHALL associate the username input with a label element whose text is "Username" and the password input with a label element whose text is "Password", using programmatic label-input association (e.g., `for`/`id` pairing or `aria-labelledby`).
3. THE Login_Page SHALL render the password input with `type="password"` so that the entered characters are masked.
4. THE Login_Page SHALL render the submit button with the visible label "Login" and `type="submit"`.

---

### Requirement 2: Validate Credentials on Submission

**User Story:** As a user, I want the application to check my credentials when I submit the form, so that only authorised users can proceed.

#### Acceptance Criteria

1. WHEN the user submits the login form, THE Auth_Service SHALL compare the submitted username and password against the Admin_Account credentials.
2. WHEN the submitted username matches the Admin_Account username AND the submitted password matches the Admin_Account password, THE Auth_Service SHALL return a distinct successful authentication indicator.
3. IF the submitted username does not match the Admin_Account username OR the submitted password does not match the Admin_Account password, THEN THE Auth_Service SHALL return a distinct failed authentication indicator.
4. THE Auth_Service SHALL treat credential comparison as case-sensitive.
5. WHEN the user submits the login form with a blank username or a blank password, THE Auth_Service SHALL return a failed authentication indicator without performing a credential comparison.

---

### Requirement 3: Navigate to the Welcome Page on Successful Login

**User Story:** As an authenticated user, I want to be taken to the welcome page after a successful login, so that I can access the application.

#### Acceptance Criteria

1. WHEN the Auth_Service returns a successful authentication indicator, THE Login_Page SHALL instruct the Router to navigate to the `/welcome` route.
2. WHEN the Router navigates to `/welcome`, THE Welcome_Page SHALL display its content within the router outlet.
3. WHEN the Router fails to navigate to `/welcome`, THE Login_Page SHALL display an error message indicating that navigation failed and SHALL remain on the login view.

---

### Requirement 4: Display an Error Message on Failed Login

**User Story:** As a user, I want to see an error message when my credentials are wrong, so that I know the login attempt failed.

#### Acceptance Criteria

1. WHEN the Auth_Service returns a failed authentication indicator, THE Login_Page SHALL display an error message informing the user that the login attempt failed, and SHALL preserve the current value of the username field.
2. WHILE the error message is displayed, THE Login_Page SHALL keep the username input, password input, and submit button each individually enabled so the user can retry.
3. WHEN the user changes the value of the username input or the password input after a failed attempt, THE Login_Page SHALL hide the error message.
4. WHEN the user re-submits the login form while an error message is displayed, THE Login_Page SHALL clear the existing error message before the Auth_Service responds, and SHALL display a new error message only if the new Auth_Service response is a failed authentication indicator.

---

### Requirement 5: Display the Welcome Greeting

**User Story:** As an authenticated user, I want to see a personalised welcome message, so that I know I have successfully logged in.

#### Acceptance Criteria

1. WHEN an authenticated user navigates to the `/welcome` route, THE Welcome_Page SHALL display a greeting that includes the authenticated user's display name in the format "Hello [username], Welcome to Kiro".
2. IF the authenticated user's display name is unavailable, THEN THE Welcome_Page SHALL display the fallback greeting "Hello Admin, Welcome to Kiro".
3. WHEN an unauthenticated user attempts to view the Welcome_Page, THE Welcome_Page SHALL NOT display the personalised greeting.

---

### Requirement 6: Protect the Welcome Route

**User Story:** As an application owner, I want unauthenticated users to be redirected away from the welcome page, so that protected content is not accessible without logging in.

#### Acceptance Criteria

1. IF an unauthenticated user (no valid authentication token present in the session) navigates directly to `/welcome`, THEN THE Router SHALL redirect the user to the `/login` route.
2. WHEN an authenticated user navigates to `/welcome`, THE Router SHALL render the Welcome_Page component within the router outlet.
3. WHEN an authenticated user's session expires while they are on the `/welcome` route, THE Router SHALL redirect the user to the `/login` route.

---

### Requirement 7: Default Route Redirection

**User Story:** As a user, I want the application to redirect me to the login page when I visit the root URL, so that I always start at the correct entry point.

#### Acceptance Criteria

1. WHEN a user navigates to the application root path `/`, THE Router SHALL redirect the user to the `/login` route such that the browser URL updates to `/login` and the Login_Page component is rendered within the router outlet.
