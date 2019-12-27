from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
import pandas

# status: C = Còn tiếp; F = finish; D = drop

baseUrl = 'https://truyenyy.com/tim-kiem/nang-cao/?q=&status={status}&orderBy=view&page={page}'
basePath = Path(__file__).absolute().parent
columns = ['name', 'description', 'bookCoverUrl', 'author', 'categories', 'status', 'chapterCount', 'path']
geckodriver = basePath.parent.joinpath('geckodriver.exe')
csvPath = basePath.joinpath('book.csv')

caps = DesiredCapabilities().FIREFOX
caps["pageLoadStrategy"] = "eager"
driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)

resetCount = 300


def resetDriverIfNeeded():
    global resetCount, driver
    resetCount -= 1
    if resetCount == 0:
        resetCount = 300
        driver.quit()
        driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)


def crawlBook(site):
    global driver
    driver.get(site)
    time.sleep(0.33)
    name = driver.find_element_by_css_selector('.name').text
    print(f"Book: {name}")
    description = '\r\n'.join([el.text for el in driver.find_elements_by_css_selector('#id_novel_summary p')])
    bookCoverUrl = driver.find_element_by_css_selector('.position-relative .loaded').get_attribute('src')
    author = driver.find_element_by_css_selector('.author a').text
    categories = '-'.join([el.text for el in driver.find_elements_by_css_selector('.mt-2 .tag a')])
    status = driver.find_element_by_css_selector('.mt-2+ .list-unstyled li:nth-child(1) a').text
    chapterCount = driver.find_element_by_css_selector('.numbers li:nth-child(2)').text.split(' ')[0]
    return {'name': name, 'description': description, 'bookCoverUrl': bookCoverUrl, 'author': author, 'categories': categories, 'status': status, 'chapterCount': chapterCount, 'path': site}


def crawlPageBooks(status, page):
    data = []
    global driver
    driver.get(baseUrl.format(status=status, page=1))
    sites = [book.get_attribute('href') for book in driver.find_elements_by_css_selector('.book-img')]
    for site in sites:
        resetDriverIfNeeded()
        book = crawlBook(site)
        data.append(book)
    dataFrame = pandas.DataFrame(columns=columns, data=data)
    dataFrame.to_csv(csvPath, mode='a', header=False, index=False)


def crawlBookCollection(status):
    global driver
    print("====================================")
    print(f"Crawl books from category {status}")
    driver.get(baseUrl.format(status=status, page=1))
    pages = 10
    for page in range(1, pages + 1):
        print(f"Trạng thái {status}: page {page}/{pages}")
        crawlPageBooks(status, page)


def initializeCSV():
    df = pandas.DataFrame(columns=columns)
    df.to_csv(csvPath, index=False)


def main():
    for status in ['C', 'F']:
        crawlBookCollection(status)


initializeCSV()
main()
