import Break from '../components/pomodoro-clock/Break'
import Session from '../components/pomodoro-clock/Session'
import Controls from '../components/pomodoro-clock/Controls'
import ThemeToggle from '../components/pomodoro-clock/ThemeToggle';
import { useStateValue } from '../contexts/pomodoro-clock/stateProvider';
import { useClockify } from '../components/pomodoro-clock/useClockify';
import ThemeProvider from '../contexts/pomodoro-clock/themeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import CONFIG from '../config';

export default function Timer() {

  const [{ projectName, timerLabel }] = useStateValue();
  const clockifiedValue = useClockify();

  return (
      <ThemeProvider>
        <div className="timer-home-icon" onClick={() => window.location = CONFIG.frontendURL}>
          <FontAwesomeIcon icon={faHome}/>
        </div>
        <div className="timer-wrapper">
          <div className="timer">
            <h2 className='timer__maintitle'>{projectName}</h2>
            <h3 id='timer-label' className='timer__label'>{timerLabel}</h3>
            <h1 id='time-left' className='timer__time'>{clockifiedValue}</h1>
            <Controls />
            <div className="timer__controllers">
              <Break />
              <Session />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </ThemeProvider>

  );
}