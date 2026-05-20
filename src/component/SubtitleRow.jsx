import React from 'react';

function SubtitleRow({ segment, index, loopRange, onSubtitleClick, onLoopClick }) {
    const isLooping = loopRange && loopRange.index === index;
    return (
         <div key={index} className="lyrics-block" style={{ marginBottom: '15px' }}>
            <button className='eng' style={{ fontWeight: 'bold'}} 
                onClick={() => handleSubtitleClick(segment.start)}
            >{segment.en}</button>
            <button className=''></button>
            <p className='kor' style={{ color: '#666'}}>{segment.ko}</p>
            <button onClick={() => onLoopClick(segment, index)}>{isLooping ? '반복 중' : '구간 반복'}</button>
        </div>
    );
}

export default React.memo(SubtitleRow);