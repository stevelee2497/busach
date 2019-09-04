from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
import pandas

categories = ['Western', 'Christian', 'Romance', 'Adventure', 'Thriller', 'Fantasy', 'Young Adult', 'Mystery', 'Historical', 'Horror', 'Science Fiction', 'Humorous']

baseUrl = 'https://allnovel.net/{0}.html?page={1}'
bookXPath = '//*[@id="content-wrapper"]/div/div[1]/div/div[1]/div/div/a'
basePath = Path(__file__).absolute().parent.parent
columns = ['name', 'description', 'bookCoverUrl', 'author', 'categories', 'path']
geckodriver = basePath.joinpath('geckodriver.exe')
csvPath = basePath.joinpath('allnovel.net/book.csv')

caps = DesiredCapabilities().FIREFOX
caps["pageLoadStrategy"] = "eager"
driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)

resetCount = 1000


def crawlBook(driver, site):

    driver.get(site)
    name = driver.find_element_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[1]/div[1]/h1').text
    print(f"Book: {name}")
    description = '\r\n'.join([el.text for el in driver.find_elements_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[2]/div[1]/div[2]/p')])
    bookCoverUrl = driver.find_element_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[1]/div[2]/div/div[1]/img').get_attribute('src')
    author = driver.find_element_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[1]/div[2]/div/div[2]/div[1]/a').text
    categories = '-'.join([el.text for el in driver.find_elements_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[1]/div[2]/div/div[2]/div[2]/a')])
    return {'name': name, 'description': description, 'bookCoverUrl': bookCoverUrl, 'author': author, 'categories': categories, 'path': site}


def crawlPageBooks(driver, category, page):
    data = []
    driver.get(baseUrl.format(category, page))
    books = driver.find_elements_by_xpath(bookXPath)
    sites = [book.get_attribute('href') for book in books]
    for site in sites:
        global resetCount
        resetCount -= 1
        if resetCount == 0:
            resetCount = 1000
            driver.quit()
            driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)
            time.sleep(0.5)
        book = crawlBook(driver, site)
        data.append(book)
    dataFrame = pandas.DataFrame(columns=columns, data=data)
    dataFrame.to_csv(csvPath, mode='a', header=False, index=False)


def crawlCategoryBooks(driver, category):
    print("====================================")
    print(f"Crawl books from category {category}")
    driver.get(baseUrl.format(category, 1))
    pages = int(driver.find_element_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[2]/ul/li[1]/a').text.split('/')[1]) // 18 + 1
    for page in range(1, pages + 1):
        print(f"{category}: page {page}/{pages}")
        crawlPageBooks(driver, category, page)


def initializeCSV():
    df = pandas.DataFrame(columns=columns)
    df.to_csv(csvPath, index=False)


def main():
    for category in categories:
        crawlCategoryBooks(driver, category)


initializeCSV()
main()
