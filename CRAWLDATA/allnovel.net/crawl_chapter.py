from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
import time
import pandas

basePath = Path(__file__).absolute().parent.parent
columns = ['book', 'name', 'content']
geckodriver = basePath.joinpath('geckodriver.exe')

caps = DesiredCapabilities().FIREFOX
caps["pageLoadStrategy"] = "eager"
driver = webdriver.Firefox(executable_path=str(geckodriver), desired_capabilities=caps)


def getBookUrls():
    df = pandas.read_csv(basePath.joinpath('allnovel.net/book.csv'))
    return df['path'].tolist()


def initializeCSV(book):
    df = pandas.DataFrame(columns=columns)
    csvPath = basePath.joinpath(f'allnovel.net/{book}.csv')
    df.to_csv(csvPath, index=False)
    return csvPath


def crawlChapters(bookUrl):
    driver.get(bookUrl)
    book = driver.find_element_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div/div[1]/div[1]/h1').text
    csvPath = initializeCSV(book)
    print("===============================================")
    print(f"Crawling book: {book}")
    data = []
    chapters = [el.get_attribute('href') for el in driver.find_elements_by_xpath('//*[@id="list_chapter"]/div[2]/table/tbody/tr/td[2]/a')]
    for i in range(1, 10):
        print(f'Crawling chapter {i}')
        driver.get(chapters[i])
        content = '\r\n'.join([el.text for el in driver.find_elements_by_xpath('//*[@id="content-wrapper"]/div/div[1]/div[2]/div/p')])
        data.append({'book': book, 'name': f'Chapter {i}', 'content': content})
    df = pandas.DataFrame(data=data, columns=columns)
    df.to_csv(csvPath, header=False, index=False)


def main():
    bookUrls = getBookUrls()
    for bookUrl in bookUrls:
        crawlChapters(bookUrl)


main()

driver.close()
