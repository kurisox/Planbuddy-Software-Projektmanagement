import CONFIG from '../config';
import Cookies from 'js-cookie';
import React from 'react';
import moment from 'moment';
import HeaderApplication from "../components/HeaderApplication";
import { computeColor } from '../components/calendar/CalendarUtils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Swal from "sweetalert2";
import LearnButton from '../components/LearnButton';


function eventStyling(event) {
    let backgroundColor = computeColor(event.ID_FACH);
    var style = {
        backgroundColor: backgroundColor,
        borderRadius: '8px',
        color: 'black',
        border: '0px',
        display: 'block'
    };
    return {
        style: style
    };
}


class GlobalCalendar extends React.Component {

    constructor(props) {
        super(props);
        moment.locale('en', {
            week: {
                dow: 1,
                doy: 1
            }
        });
        this.state = {
            localizer: momentLocalizer(moment),
            calendarFormats: { weekdayFormat: 'dddd' },
            events: [],
            showDetailsDialog: false
        };
    }

    componentDidMount() {
        fetch(CONFIG.baseURL + 'event/public', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            result.forEach(event => {
                event.start = new Date(event.START_DATUM_UHRZEIT);
                event.end = new Date(event.END_DATUM_UHRZEIT);
            });
            this.setState({ events: result });
        })
        .catch(error => console.error("error on fetching events"));
    }

    showEventDetails(event) {
        Swal.fire({
            title: '<strong>'+ event.NAME +'</strong>',
            html:
                'Notiz: '+ event.NOTIZ,
            showDenyButton: true,
            focusConfirm: false,
            confirmButtonText:
                'Import Event',
            confirmButtonColor: '#335C7D',
            denyButtonText:
                'Import all Events',
            denyButtonColor: '#6a6a6a'
        })
        .then((result) => {
            if(result.isConfirmed) {
                this.importGlobalEvent(event);
            } else if(result.isDenied) {
                this.importAllCourseSpecificGlobalEvents(event);
            }
        })
    }


    importGlobalEvent(event) {
        fetch(CONFIG.baseURL + 'event/' + event.ID_TERMIN + '/addUser/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            },
            body: JSON.stringify({ "ID_USER": Cookies.get('planbuddy-user') })
        })
        .then((res) => {
            this.setState({showDetailsDialog: false });
            if (res.ok) {
                Swal.fire({ text: 'Event imported', icon: 'success', confirmButtonColor: '#335C7D' });
                return res.json();
            } else if (res.status === 400) {
                throw new Error("Something went wrong! Probably you imported this event already");
            }
        })
        .catch(error => Swal.fire({ text: error.message, icon: 'error', confirmButtonColor: '#335C7D' }));
    }

    importAllCourseSpecificGlobalEvents(event) {
        let eventList = [];
        let userID = Cookies.get('planbuddy-user');
        fetch(CONFIG.baseURL + 'event/public', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 400) {
                throw new Error("An error occured");
            }
        })
        .then((events) => {
            eventList = events;
            eventList = eventList.filter((e) => ((e.ID_FACH === event.ID_FACH) && (Number(e.ID_BESITZER) !== Number(userID))));
            eventList.forEach((e) => {
                this.importGlobalEvent(e);
            });
        })
        .catch(error => Swal.fire({ text: error.message, icon: 'error', confirmButtonColor: '#335C7D' }));
    }


    render() {
        return (
            <div>
                <HeaderApplication />
                <Calendar
                    localizer={this.state.localizer}
                    formats={this.state.calendarFormats}
                    events={this.state.events}
                    titleAccessor="NAME"
                    onSelectEvent={(event) => this.showEventDetails(event)}
                    eventPropGetter={eventStyling}
                    style={{ height: 500, top: 64, position: 'relative' }}
                />
                <LearnButton/>
            </div>
        );
    }
}

export default GlobalCalendar;