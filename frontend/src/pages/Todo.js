import CONFIG from '../config';
import Cookies from 'js-cookie';

import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import _ from 'lodash';
import { Board } from '../components/board/Board';
import HeaderApplication from '../components/HeaderApplication';
import { Toaster } from 'react-hot-toast'
import LearnButton from '../components/LearnButton';

let _columnId = 0;

class Todo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            error: null,
            isLoaded: false,
            cards: [],
            columns: [],
        }
    }

    componentDidMount() {
        fetch(CONFIG.baseURL + 'todo/user/' + Cookies.get('planbuddy-user'), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            }
        })
            .then(res => res.json())
            .then(result => {
                var initialcards = []
                const initialcolumns = [{ id: 0, title: 'TODO', cardIds: [], }, { id: 1, title: 'DONE', cardIds: [] }]
                result.forEach((card) => {
                    initialcards.push({ id: card.ID_AUFGABE, title: card.NAME, todo: card })
                    if (card.ERLEDIGT === 0) {
                        initialcolumns[0].cardIds.push(card.ID_AUFGABE)
                    } else {
                        initialcolumns[1].cardIds.push(card.ID_AUFGABE)
                    }
                })
                this.setState({ isLoaded: true, cards: initialcards, columns: initialcolumns });
            })
            .catch(error => {
                this.setState({ isLoaded: true, error })
            });
    }


    addColumn = _title => {
        const title = _title.trim();
        if (!title) return;

        const newColumn = {
            id: ++_columnId,
            title,
            cardIds: [],
        };
        this.setState(state => ({
            columns: [...state.columns, newColumn],
        }));
    };

    addCard = (columnId, _title, _workload, _note) => {
        const title = _title.trim();
        const note = _note.trim();
        var card
        if (!title) return;
        fetch(CONFIG.baseURL + 'todo/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('planbuddy-jwt')
            },
            body: JSON.stringify({
                NAME: title,
                WORKLOAD: _workload,
                NOTIZ: note,
                ERLEDIGT: Number(columnId) === 1,
                OEFFENTLICH: false
            })
        })
            .then(res => res.json())
            .then(result => {
                card = result
                const newCard = { id: card.ID_AUFGABE, title: card.NAME, todo: card };
                this.setState(state => ({
                    cards: [...state.cards, newCard],
                    columns: state.columns.map(
                        column =>
                            column.id === columnId
                                ? { ...column, cardIds: [...column.cardIds, newCard.id] }
                                : column
                    ),
                }));
            })
            .catch(error => {
            });



    };

    moveCard = (cardId, destColumnId, index) => {
        this.setState(state => ({
            columns: state.columns.map(column => ({
                ...column,
                cardIds: _.flowRight(
                    // 2) If this is the destination column, insert the cardId.
                    ids =>
                        column.id === destColumnId
                            ? [...ids.slice(0, index), cardId, ...ids.slice(index)]
                            : ids,
                    // 1) Remove the cardId for all columns
                    ids => ids.filter(id => id !== cardId)
                )(column.cardIds),
            })),
        }));
        if (destColumnId === 1) {
            fetch(CONFIG.baseURL + 'todo/' + cardId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': Cookies.get('planbuddy-jwt')
                },
                body: JSON.stringify({ ERLEDIGT: true })
            })
                .then(result => {
                })
                .catch(error => {
                });
        } else {
            fetch(CONFIG.baseURL + 'todo/' + cardId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': Cookies.get('planbuddy-jwt')
                },
                body: JSON.stringify({ ERLEDIGT: false })
            })
                .then(result => {
                })
                .catch(error => {
                });
        }
    };

    render() {
        const { error, isLoaded, cards, columns } = this.state
        if (error) {
            return <div>Error: {error.message} </div>
        } else if (!isLoaded) {
            return <div>Loading...</div>
        } else {
            return (
                <div>
                    <HeaderApplication />
                    <Board
                        cards={cards}
                        columns={columns}
                        moveCard={this.moveCard}
                        addCard={this.addCard}
                    />
                     <Toaster position="bottom-right" />
                     <LearnButton/>
                </div>
            );
        }
    }
}

export default DragDropContext(HTML5Backend)(Todo);
