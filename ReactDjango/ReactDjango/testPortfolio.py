import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class AddStockToPortfolioTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_add_stock(self):
        driver = self.driver
        driver.get("http://localhost:5173/frontend/login")

        # Log in first
        username_field = driver.find_element(By.NAME, "luminita")  # Correct attribute name
        password_field = driver.find_element(By.NAME, "luminita")  # Correct attribute name
        login_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        username_field.send_keys("testuser")
        password_field.send_keys("password")
        login_button.click()

        time.sleep(3)  # Wait for the login process to complete

        # Navigate to the trade page
        driver.get("http://localhost:5173/frontend/trade")

        symbol_field = driver.find_element(By.NAME, "symbol")
        quantity_field = driver.find_element(By.NAME, "quantity")
        buy_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        symbol_field.send_keys("AAPL")
        quantity_field.send_keys("10")
        buy_button.click()

        time.sleep(3)  # Wait for the transaction to complete

        # Navigate to the portfolio page
        driver.get("http://localhost:5173/frontend/portfolio")

        time.sleep(3)  # Wait for the portfolio to load

        # Check if the stock appears in the portfolio
        portfolio_items = driver.find_elements(By.CLASS_NAME, "portfolio-item")
        self.assertTrue(any("AAPL" in item.text for item in portfolio_items))

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
