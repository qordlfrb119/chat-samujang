async function analyzeCase() {
  const caseNumber = document.getElementById("caseNumber").value.trim();
  const resultBox = document.getElementById("result");

  if (!caseNumber) {
    alert("사건번호를 입력하세요.");
    return;
  }

  resultBox.textContent = "📡 분석 중입니다...";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ caseNumber })
    });

    const data = await response.json();
    resultBox.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    resultBox.textContent = "❌ 오류 발생: " + error.message;
  }
}
