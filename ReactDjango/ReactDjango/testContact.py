import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class ContactPageTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_contact_form_submission(self):
        driver = self.driver
        driver.get("http://localhost:5173/frontend/contact")

        # Fill in the contact form
        name_field = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.NAME, "name"))
        )
        email_field = driver.find_element(By.NAME, "email")
        subject_field = driver.find_element(By.NAME, "subject")
        message_field = driver.find_element(By.NAME, "message")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        name_field.send_keys("John Doe")
        email_field.send_keys("johndoe@example.com")
        subject_field.send_keys("Test Subject")
        message_field.send_keys("This is a test message.")
        
        # Click the submit button using JavaScript to avoid ElementClickInterceptedException
        driver.execute_script("arguments[0].click();", submit_button)

        WebDriverWait(driver, 20).until(
            EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".text-center.mt-3"), "Your message has been sent successfully!")
        )

        # Check if the success message is displayed
        success_message = driver.find_element(By.CSS_SELECTOR, ".text-center.mt-3").text
        self.assertEqual(success_message, "Your message has been sent successfully!")

    def test_contact_form_submission_failure(self):
        driver = self.driver
        driver.get("http://localhost:5173/frontend/contact")

        # Fill in the contact form with an invalid email
        name_field = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.NAME, "name"))
        )
        email_field = driver.find_element(By.NAME, "email")
        subject_field = driver.find_element(By.NAME, "subject")
        message_field = driver.find_element(By.NAME, "message")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        name_field.send_keys("John Doe")
        email_field.send_keys("invalid-email")
        subject_field.send_keys("Test Subject")
        message_field.send_keys("This is a test message.")
        
        # Attempt to click the submit button using JavaScript to avoid ElementClickInterceptedException
        driver.execute_script("arguments[0].click();", submit_button)

        # Check for the presence of the HTML5 validation error
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "input:invalid"))
            )
            print("HTML5 validation error displayed correctly")
        except Exception as e:
            print(f"An error occurred: {e}")
            self.fail("Test failed due to an unexpected exception")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
