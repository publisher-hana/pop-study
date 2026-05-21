import { useState, useRef, useEffect} from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessons } from "../data/data";
import SubtitleRow from '../component/SubtitleRow';
import YouTube from 'react-youtube';

function DetailPage() {
  //주소창의 :id 값을 가져옵니다.
  const { id } = useParams();

  //lessons 배열에서 주소창의 id와 일치하는 '단 하나의 레슨'만 찾습니다.
  const lesson = lessons.find((item) => item.id === Number(id));

  // 2. 유튜브 플레이어 객체를 담아둘 변수(ref)
  const playerRef = useRef(null);
  const [loopRange, setLoopRange] = useState(null);
  const [showEng, setShowEng] = useState(true);
  const [showKor, setShowKor] = useState(true);
  //==추가==//
  const [currentTime, setCurrentTime] = useState(0); // 현재 비디오 재생 시간(초)
  const [activeIndex, setActiveIndex] = useState(-1); // 현재 재생 중인 자막 행의 인덱스
  const rowRefs = useRef([]); // 각 자막 컴포넌트 엘리먼트를 담을 배열 Ref

  // "1:37" 같은 문자열 시간을 초(숫자)로 바꿔주는 함수
  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    let intervalId;

    // 비디오 플레이어가 준비되었을 때 실시간 시간 감지 스케줄러 시작 (매 200ms 마다 실행)
    if (lesson) {
      intervalId = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime();
            setCurrentTime(time); // 실시간 재생 시간 업데이트

            // 구간 반복 조건 체크 (기존 로직 유지)
            if (loopRange && time >= loopRange.end) {
              playerRef.current.seekTo(loopRange.start, true);
            }
          } catch (error) {
            console.error(error);
          }
        }
      }, 200);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loopRange, lesson]);

  // ================= [추가 3] 재생 시간에 알맞은 자막 인덱스 계산 및 싱크 검사 =================
  useEffect(() => {
    if (!lesson || !lesson.segments) return;

    // 현재 비디오 타임라인에 들어오는 단 한 줄의 자막 인덱스를 서칭
    const index = lesson.segments.findIndex((segment) => {
      const startSec = timeToSeconds(segment.start);
      const endSec = timeToSeconds(segment.end);
      return currentTime >= startSec && currentTime <= endSec;
    });

    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [currentTime, lesson, activeIndex]);
  // ====================================================================================

  // ================= [추가 4] 활성화된 자막 인덱스가 변경되면 부드럽게 스크롤링 =================
  useEffect(() => {
    if (activeIndex !== -1 && rowRefs.current[activeIndex]) {
      rowRefs.current[activeIndex].scrollIntoView({
        behavior: 'smooth', // 부드러운 스크롤 애니메이션 효과
        block: 'center',    // 스크롤 대상 행이 화면 정중앙에 배치되도록 타겟팅
      });
    }
  }, [activeIndex]);

  if (!lesson) {
    return <div style={{ padding: '20px' }}>해당 레슨을 찾을 수 없습니다.</div>;
  }

  // en 버튼 클릭 시 호출될 함수
 const handleSubtitleClick = (startTimeStr) => {
    setLoopRange(null);
    const seconds = timeToSeconds(startTimeStr);
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  const handleLoopClick = (segment, index) => {
    const startSec = timeToSeconds(segment.start);
    const endSec = timeToSeconds(segment.end);

    if (loopRange && loopRange.index === index) {
      setLoopRange(null);
    } else {
      setLoopRange({ start: startSec, end: endSec, index });
      if (playerRef.current) {
        playerRef.current.seekTo(startSec, true);
        playerRef.current.playVideo();
      }
    }
  };

  // 유튜브 플레이어 설정 옵션
  const opts = {
    playerVars: {
      autoplay: 0, // 자동재생 끔
    },
  };

  // 플레이어가 준비되면 실행되는 함수 (여기서 플레이어 객체를 ref에 저장)
  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  return (
    <div className="lesson-card">
       <div className='link-back'>
        <Link to="/">← 목록으로</Link>
      </div>


      {/* 유튜브 비디오 플레이어 배치 */}
      <div className="video-container">
        <YouTube 
          videoId={lesson.videoId} 
          opts={opts} 
          onReady={onPlayerReady} 
          className='player'
        />
      </div>
      <div className='control'>
        <button onClick={() => setShowEng(!showEng)}>
          {showEng ? '영어 숨기기' : '영어 보이기'}
        </button>
        <button onClick={() => setShowKor(!showKor)}>
          {showKor ? '한글 숨기기' : '한글 보이기'}
        </button>
      </div>
     <div className="subtitles-list">
        {lesson.segments.map((segment, index) => {
          const isActive = index === activeIndex; // 매핑 단계에서 하이라이트 여부 불리언 계산
          
          return (
            <div 
              key={index}
              ref={(el) => (rowRefs.current[index] = el)} // DOM 수집용 엘리먼트 함수 레퍼런스 연결
              className={`subtitle-row-wrapper ${isActive ? 'active-highlight' : ''}`} // 하이라이트용 동적 클래스 추가
            >
              <SubtitleRow 
                segment={segment}
                index={index}
                loopRange={loopRange}
                onSubtitleClick={handleSubtitleClick}
                onLoopClick={handleLoopClick}
                showEng={showEng}
                showKor={showKor}
                isActive={isActive} // 자막 내부 컴포넌트 자체에서도 응용할 수 있게 prop 추가 전달
              />
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default DetailPage
