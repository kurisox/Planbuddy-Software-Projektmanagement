import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import CONFIG from '../config';

const jumpToLearnMode = () => window.location = CONFIG.frontendURL + 'timer';

export default function LearnButton() {
    return (
        <div className="book">
            <div className="back" onClick={jumpToLearnMode}></div>
            <span className="page6" onClick={jumpToLearnMode}><div className="book-font">MODE</div></span>
            <span className="page5" onClick={jumpToLearnMode}><div className="book-font">ИЯAƎ⅃</div></span>
            <div className="page4" onClick={jumpToLearnMode}></div>
            <div className="page3" onClick={jumpToLearnMode}></div>
            <div className="page2" onClick={jumpToLearnMode}></div>
            <div className="page1" onClick={jumpToLearnMode}></div>
            <div className="front" onClick={jumpToLearnMode}>
                <FontAwesomeIcon icon={faGraduationCap} className="graduation-cap" />
            </div>
        </div>
    );
}