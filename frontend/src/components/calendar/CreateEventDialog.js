import CONFIG from '../../config';
import Cookies from 'js-cookie';

import * as React from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DateTimePicker from '@mui/lab/DateTimePicker';
import AdapterMoment from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Swal from "sweetalert2";


class CreateEventDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            courses: [],
            dialogData: {
                NAME: "",
                TYP: "",
                NOTIZ: "",
                ID_FACH: 1,
                START_DATUM_UHRZEIT: null,
                END_DATUM_UHRZEIT: null,
                OEFFENTLICH: false
            }
        };
        this.fetchCourses = this.fetchCourses.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.showDialog = this.showDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        window.formDialog = this;
    }

    fetchCourses() {
        fetch(CONFIG.baseURL + 'course', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
        .then(res => res.json())
        .then(result => {
            this.setState({ courses: result });
            if (this.state.courses && this.state.courses.length > 0) {
                this.setState({
                    dialogData: {
                        ...this.state.dialogData,
                        ID_FACH: this.state.courses[0].ID_FACH
                    }
                });
            } else {
                this.setState({
                    dialogData: {
                        ...this.state.dialogData,
                        ID_FACH: 1
                    }
                });
            }
        })
        .catch(error => console.error("error on fetching courses"));
    }

    createEvent() {
        fetch(CONFIG.baseURL + 'event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            },
            body: JSON.stringify(this.state.dialogData, (key, value) => {
                if (key === 'START_DATUM_UHRZEIT' || key === 'END_DATUM_UHRZEIT') {
                    return value.replace('T', ' ').replace('Z', '');
                }
                return value;
            })
        })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else if (res.status === 400) {
                throw new Error("Invalid Request");
            }
        })
        .then(e => {
            this.closeDialog();
            window.location.reload();
        })
        .catch(error => Swal.fire({text: error.message, icon: 'error', confirmButtonColor: '#335C7D'}));
    }

    showDialog(start, end) {
        this.setState({ open: true });
        this.setState({
            dialogData: {
                ...this.state.dialogData,
                START_DATUM_UHRZEIT: start
            }
        });
        this.setState({
            dialogData: {
                ...this.state.dialogData,
                END_DATUM_UHRZEIT: end
            }
        });
        this.fetchCourses();
    }

    closeDialog() {
        this.setState({ open: false })
    }

    render() {
        return (
            <div>
                <Dialog open={this.state.open} onClose={this.closeDialog}>
                    <DialogTitle>New event</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
                        <DialogContentText>
                            Create a new event. Make it public so other Students can import the event.
                        </DialogContentText>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={this.state.dialogData.NAME}
                                onChange={(changeEvent) => {
                                    this.setState({
                                        dialogData: {
                                            ...this.state.dialogData,
                                            NAME: changeEvent.target.value
                                        }
                                    })
                                }}
                            />
                            <TextField
                                margin="dense"
                                label="Note"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={this.state.dialogData.NOTIZ}
                                onChange={(changeEvent) => {
                                    this.setState({
                                        dialogData: {
                                            ...this.state.dialogData,
                                            NOTIZ: changeEvent.target.value
                                        }
                                    })
                                }}
                                sx={{ marginBottom: 5 }}
                            />
                            <FormControl fullWidth sx={{ marginBottom: 5 }}>
                                <InputLabel>Course</InputLabel>
                                <Select
                                    value={this.state.dialogData.ID_FACH}
                                    label="Course"
                                    onChange={(changeEvent) => {
                                        this.setState({
                                            dialogData: {
                                                ...this.state.dialogData,
                                                ID_FACH: changeEvent.target.value
                                            }
                                        })
                                    }}
                                >
                                    {this.state.courses.map((course) =>
                                        <MenuItem key={course.ID_FACH} value={course.ID_FACH}>{course.NAME}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            <div style={{ width: 250 }}>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DateTimePicker
                                        label="Start"
                                        value={this.state.dialogData.START_DATUM_UHRZEIT}
                                        onChange={(newValue) => {
                                            this.setState({
                                                dialogData: {
                                                    ...this.state.dialogData,
                                                    START_DATUM_UHRZEIT: newValue
                                                }
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <div style={{ display: "block", padding: 20 }}></div>
                                    <DateTimePicker
                                        label="End"
                                        value={this.state.dialogData.END_DATUM_UHRZEIT}
                                        onChange={(newValue) => {
                                            this.setState({
                                                dialogData: {
                                                    ...this.state.dialogData,
                                                    END_DATUM_UHRZEIT: newValue
                                                }
                                            });
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </LocalizationProvider>
                            </div>

                            <FormGroup sx={{ marginTop: 2 }}>
                                <FormControlLabel control={
                                    <Checkbox
                                        checked={this.state.dialogData.OEFFENTLICH}
                                        onChange={(changeEvent) => {
                                            this.setState({
                                                dialogData: {
                                                    ...this.state.dialogData,
                                                    OEFFENTLICH: changeEvent.target.checked
                                                }
                                            })
                                        }} />} label="Public event" />
                            </FormGroup>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog}>Cancel</Button>
                        <Button onClick={this.createEvent}>Create Event</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}


export default CreateEventDialog;