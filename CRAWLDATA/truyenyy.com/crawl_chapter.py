from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
import pandas
import os

chapterUrl = '{bookUrl}chuong-{chapter}.html'
basePath = Path(__file__).absolute().parent
columns = ['book', 'name', 'chapterIndex', 'content']
geckodriver = basePath.parent.joinpath('geckodriver.exe')

caps = DesiredCapabilities().FIREFOX
caps["pageLoadStrategy"] = "eager"
driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)
resetCount = 300


def saveAndResetDriverIfNeeded(data, csvPath, isLast):
    global resetCount, driver
    resetCount -= 1
    if resetCount == 0 or isLast:
        resetCount = 300
        df = pandas.DataFrame(data=data, columns=columns)
        df.to_csv(csvPath, header=False, index=False, mode='a')
        data = []
        driver.quit()
        driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)
    return data


def getBookUrls():
    df = pandas.read_csv(basePath.joinpath('book.csv'))
    books = df.to_dict('records')
    return df['path'].tolist()


def initializeCSV(book):
    csvPath = basePath.joinpath(f'{book}.csv')
    print(csvPath)
    lastestChapter = 0
    if os.path.isfile(csvPath):
        df = pandas.read_csv(csvPath)
        lastestChapter = int(df.tail(1)['chapterIndex'])
    else:
        df = pandas.DataFrame(columns=columns)
        df.to_csv(csvPath, index=False)
    return csvPath, lastestChapter


def crawlChapters(bookUrl):
    global driver
    driver.get(bookUrl)
    book = driver.find_element_by_css_selector('.name').text
    csvPath, lastestChapter = initializeCSV(book)
    print("===========================================================")
    print(f"Crawling book: {book}")
    data = []
    chapterCount = int(driver.find_element_by_css_selector('.numbers li:nth-child(2)').text.split(' ')[0].replace(",", ""))
    for i in range(lastestChapter + 1, chapterCount + 1):
        print(f'Crawling book: {book} chapter {i}')
        driver.get(chapterUrl.format(bookUrl=bookUrl, chapter=i))
        name = driver.find_element_by_css_selector('.chapter-title').text
        content = '\r\n'.join([el.text for el in driver.find_elements_by_css_selector('p')])
        data.append({'book': book, 'name': name, 'chapterIndex': i, 'content': content})
        data = saveAndResetDriverIfNeeded(data, csvPath, i == chapterCount)


def main():
    bookUrls = getBookUrls()
    for bookUrl in bookUrls:
        crawlChapters(bookUrl)


main()

driver.close()
