import React from 'react';
import { TfiLoop } from "react-icons/tfi";

function SubtitleRow({ segment, index, loopRange, onSubtitleClick, onLoopClick, showEng, showKor }) {
    const isLooping = loopRange && loopRange.index === index;
    return (
         <div key={index} className={`lyrics-block  ${isLooping ? 'active-highlight' : ''}`} style={{ marginBottom: '15px'}}>
            <div className='subtile'>
              {showEng && (
              <button className='eng' style={{ fontWeight: 'bold'}} 
                  onClick={() => onSubtitleClick(segment.start)}
              >
                {segment.en}
              </button>
            )}
              {showKor && (
              <p className='kor' style={{ color: '#666', margin: '5px 0' }}>
                {segment.ko}
              </p>
            )}
            </div>
            <button className={`loop-btn ${isLooping ? 'active' : ''}`} onClick={() => onLoopClick(segment, index)}><TfiLoop size={28} /></button>
        </div>
    );
}

export default React.memo(SubtitleRow);