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

  // "1:37" 같은 문자열 시간을 초(숫자)로 바꿔주는 함수
  const timeToSeconds = (timeStr) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  useEffect(() => {
    let intervalId;
    if (loopRange && playerRef.current) {
      intervalId = setInterval(() => {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime >= loopRange.end) {
            playerRef.current.seekTo(loopRange.start, true);
          }
        } catch (error) {
          console.error(error);
        }
      }, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loopRange]);

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
        {lesson.segments.map((segment, index) => (
          <SubtitleRow 
            key={index}
            segment={segment}
            index={index}
            loopRange={loopRange}
            onSubtitleClick={handleSubtitleClick}
            onLoopClick={handleLoopClick}
            showEng={showEng}
            showKor={showKor}
          />
        ))}
      </div>
    </div>
  )
}

export default DetailPage