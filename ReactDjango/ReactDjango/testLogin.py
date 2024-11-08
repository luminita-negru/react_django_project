import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_login(self):
        driver = self.driver
        driver.get("http://localhost:5173/frontend/login")

        # Hardcoded username and password
        username = "luminita"
        password = "luminita"

        try:
            username_field = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.NAME, "username"))  
            )
            print("Username field found")
            
            password_field = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.NAME, "password"))  
            )
            print("Password field found")
            
            login_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit']"))
            )
            print("Login button found")

            username_field.send_keys(username)
            password_field.send_keys(password)
            login_button.click()


            print("Login successful")

        except Exception as e:
            print(f"An error occurred: {e}")
            self.fail("Test failed due to an unexpected exception")

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
