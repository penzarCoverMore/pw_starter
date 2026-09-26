import { expect, test } from '../../fixtures';
import { ContactMessageData } from '../../pages/contact.page';

const VALID_MESSAGE: ContactMessageData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  subject: 'customer-service',
  message: 'This is a valid message that is at least fifty characters long for testing.',
};

test.describe('Contact', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.navigate();
  });

  test('CN01 happy path submits successfully @regression', async ({ contactPage }) => {
    await contactPage.submitForm(VALID_MESSAGE);
    await expect(contactPage.successAlert).toBeVisible();
    await expect(contactPage.successAlert).toHaveText(/thanks for your message/i);
  });

  test('CN02 submitting an empty form shows required-field errors @regression', async ({ contactPage }) => {
    await contactPage.submit();
    await expect(contactPage.firstNameError).toHaveText(/first name is required/i);
    await expect(contactPage.lastNameError).toHaveText(/last name is required/i);
    await expect(contactPage.emailError).toHaveText(/email is required/i);
    await expect(contactPage.subjectError).toHaveText(/subject is required/i);
    await expect(contactPage.messageError).toHaveText(/message is required/i);
  });

  test('CN03 message under 50 characters is rejected @regression', async ({ contactPage }) => {
    await contactPage.fillForm({ ...VALID_MESSAGE, message: 'too short' });
    await contactPage.submit();
    await expect(contactPage.messageError).toHaveText(/message must be minimal 50 characters/i);
  });

  test('CN04 invalid email format is rejected @regression', async ({ contactPage }) => {
    await contactPage.fillForm({ ...VALID_MESSAGE, email: 'not-an-email' });
    await contactPage.submit();
    await expect(contactPage.emailError).toBeVisible();
  });

  test('CN05 subject dropdown offers the expected options @regression', async ({ contactPage }) => {
    const options = await contactPage.subjectDropdown.locator('option').allTextContents();
    expect(options.map((o) => o.trim())).toEqual([
      'Select a subject *',
      'Customer service',
      'Webmaster',
      'Return',
      'Payments',
      'Warranty',
      'Status of my order',
    ]);
  });
});
