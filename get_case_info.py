from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_case_info(case_number):
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--headless")  # 개발 중엔 꺼두자

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        print("1️⃣ 대법원 경매 사이트 접속 중...")
        driver.get("https://www.courtauction.go.kr/pgm/inqire/inqire_lwet_estate.jsp")

        # 2️⃣ 검색창 대기
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "searchKeyword"))
        )

        # 3️⃣ 사건번호 입력
        input_box = driver.find_element(By.ID, "searchKeyword")
        input_box.send_keys(case_number)

        # 4️⃣ 검색 버튼 클릭
        search_button = driver.find_element(By.ID, "mf_btn_quickSearchGds")
        search_button.click()

        # 5️⃣ 결과 테이블 뜰 때까지 기다림
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".tbl_list tbody tr td a"))
        )

        # 6️⃣ 첫 번째 결과 클릭
        result_link = driver.find_element(By.CSS_SELECTOR, ".tbl_list tbody tr td a")
        result_link.click()

        # 7️⃣ 상세페이지 로딩 대기
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "case_title"))
        )

        # 8️⃣ 물건 제목 가져오기
        title = driver.find_element(By.CSS_SELECTOR, ".case_title span").text.strip()

        # 9️⃣ 말소기준권리 가져오기
        기준권리 = "없음"
        label_elements = driver.find_elements(By.CSS_SELECTOR, "th")
        for th in label_elements:
            if "말소기준권리" in th.text:
                기준권리 = th.find_element(By.XPATH, "following-sibling::td").text.strip()
                break

        print(f"✅ 사건번호: {case_number}")
        print(f"📦 물건 제목: {title}")
        print(f"🔑 말소기준권리: {기준권리}")

    except Exception as e:
        print("❌ 오류 발생:", e)

    finally:
        input("🔍 창 확인 후 [Enter] 키를 누르면 브라우저가 닫힙니다.")
        driver.quit()

if __name__ == "__main__":
    get_case_info("2023타경3743")




