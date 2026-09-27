import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export interface ContactMessageData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export class ContactPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectDropdown: Locator;
  readonly messageInput: Locator;
  readonly attachmentInput: Locator;
  readonly submitButton: Locator;
  readonly successAlert: Locator;

  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly emailError: Locator;
  readonly subjectError: Locator;
  readonly messageError: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.subjectDropdown = page.locator('[data-test="subject"]');
    this.messageInput = page.locator('[data-test="message"]');
    this.attachmentInput = page.locator('[data-test="attachment"]');
    this.submitButton = page.locator('[data-test="contact-submit"]');
    this.successAlert = page.locator('.alert-success');

    this.firstNameError = page.locator('[data-test="first-name-error"]');
    this.lastNameError = page.locator('[data-test="last-name-error"]');
    this.emailError = page.locator('[data-test="email-error"]');
    this.subjectError = page.locator('[data-test="subject-error"]');
    this.messageError = page.locator('[data-test="message-error"]');
  }

  async navigate() {
    await super.navigate('/contact');
    await this.firstNameInput.waitFor();
  }

  async fillForm(data: ContactMessageData) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.subjectDropdown.selectOption(data.subject);
    await this.messageInput.fill(data.message);
  }

  async submit() {
    await this.submitButton.click();
  }

  async submitForm(data: ContactMessageData) {
    await this.fillForm(data);
    await this.submit();
  }
}
