import CONFIG from '../config';
import Cookies from 'js-cookie';
import React from 'react';
import moment from 'moment';
import HeaderApplication from "../components/HeaderApplication";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import CreateEventDialog from '../components/calendar/CreateEventDialog';
import { computeColor } from '../components/calendar/CalendarUtils';
import LearnButton from '../components/LearnButton';
import Swal from 'sweetalert2';

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


class PrivateCalendar extends React.Component {

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

    fetchEvents() {
        fetch(CONFIG.baseURL + 'event/user/' + Cookies.get('planbuddy-user'), {
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

    removeGlobalEvent(event, userID) {
        fetch(CONFIG.baseURL + 'event/' + event.ID_TERMIN + '/removeUser/' + userID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
        .then((res) => {
            if (res.ok) {
                Swal.fire({ text: 'Event deleted', timer: 1000, icon: 'success', confirmButtonColor: '#335C7D' })
                    .then(() => this.fetchEvents());
            } else if (res.status === 400) {
                throw new Error("An error occured");
            }
        })
        .catch(error => Swal.fire({ text: error.message, icon: 'error', confirmButtonColor: '#335C7D' }));
    }

    deleteEvent(event) {
        fetch(CONFIG.baseURL + 'event/' + event.ID_TERMIN, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
        .then((res) => {
            if (res.ok) {
                Swal.fire({ text: 'Event deleted', timer: 1000, icon: 'success', confirmButtonColor: '#335C7D' })
                    .then(() => this.fetchEvents());
            } else if (res.status === 400) {
                throw new Error("An error occured");
            }
        })
        .catch(error => Swal.fire({ text: error.message, icon: 'error', confirmButtonColor: '#335C7D' }));
    }

    componentDidMount() {
        this.fetchEvents();
    }

    showEventDetails(event) {
        let userID = Cookies.get('planbuddy-user');
        let myEvent = (Number(event.ID_BESITZER) === Number(userID)) ? true : false;
        Swal.fire({
            title: '<strong>' + event.NAME + '</strong>',
            html:
                'Notiz: ' + event.NOTIZ,
            focusConfirm: false,
            confirmButtonText:
                'Delete Event',
            confirmButtonColor: '#335C7D',
        })
        .then((result) => {
            if (result.isConfirmed) {
                if (!myEvent) {
                    this.removeGlobalEvent(event, userID);
                } else {
                    if(event.OEFFENTLICH) {
                        Swal.fire({
                            icon: 'info',
                            text: 'You are about to delete a public event! Continue?',
                            confirmButtonColor: '#335C7D',
                            showCancelButton: true
                        }).then((result) => {
                            if(result.isConfirmed) {
                                this.deleteEvent(event);
                            }
                        })
                    } else {
                        this.deleteEvent(event);
                    }
                }
            }
        })
    }

    render() {
        return (
            <div>
                <HeaderApplication />
                <CreateEventDialog />
                <Calendar
                    selectable
                    localizer={this.state.localizer}
                    formats={this.state.calendarFormats}
                    events={this.state.events}
                    titleAccessor="NAME"
                    onSelectEvent={(event) => this.showEventDetails(event)}
                    onSelectSlot={({ start, end }) => { window.formDialog.showDialog(start, end) }}
                    eventPropGetter={eventStyling}
                    style={{ height: 500, top: 64, position: 'relative' }}
                />
                <LearnButton />
            </div>
        );
    }
}

export default PrivateCalendar;