const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ 기본 홈 라우트 (서버 상태 확인용)
app.get('/', (req, res) => {
  res.send('✅ 챗사무장 서버가 정상 작동 중입니다.');
});

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('📩 사용자 입력:', userMessage);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // 필요 시 'gpt-4'로 변경 가능
      messages: [
        {
          role: 'system',
          content: `
당신은 '챗사무장'이라는 아파트 경매 분석 전문 챗봇입니다.

사용자가 타경번호 또는 주소를 입력하면, 다음 순서로 응답하세요:
1. 사건 기본 정보 요약 (사건번호, 소재지, 전용면적 등)
2. 감정가 vs 실거래가 비교
3. 낙찰가 예측 (GPT 추정)
4. 권리분석 (말소기준권리 존재 여부, 인수 위험 등)
5. 입찰 시 주의사항 (5개 이내 체크포인트)
6. [최종 분석 코멘트] : 안전 / 주의 / 위험 중 판단과 사유를 명확히 제시

※ 반드시 전문가처럼 공손하고 신중한 말투를 사용하세요.  
※ 추가로, 아래 형식으로 TTS 음성 멘트도 마지막 줄에 작성하세요:
🎧 "이 물건은 권리관계가 불안정하므로 반드시 신중히 접근하세요."
`
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const reply = chatCompletion.choices[0].message.content;
    console.log('🤖 챗사무장 응답:', reply);
    res.json({ reply });
  } catch (error) {
    console.error('❌ GPT 오류:', error);
    res.status(500).json({ error: 'GPT 응답 실패' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 챗사무장 서버 실행 중: http://localhost:${PORT}`));
