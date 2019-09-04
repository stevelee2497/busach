from pathlib import Path
from selenium import webdriver
import time
import pandas


baseUrl = 'https://allnovel.net/{0}.html?page={1}'
basePath = Path(__file__).absolute().parent.parent
columns = ['book', 'name', 'content']
geckodriver = basePath.joinpath('geckodriver.exe')
csvPath = basePath.joinpath('allnovel.net/chapters.csv')
driver = webdriver.Firefox(executable_path=str(geckodriver))


def initializeCSV():
    df = pandas.DataFrame(columns=columns)
    df.to_csv(csvPath, index=False)


def main():
    pass


initializeCSV()
main()

driver.close()
