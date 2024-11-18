import CONFIG from '../../config';
import Cookies from 'js-cookie';

import React, { useState } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import _ from 'lodash';
import toast from 'react-hot-toast'

export function Card(props) {

  const [deleted, setDeleted] = useState(false)

  function deleteCard() {

    fetch(CONFIG.baseURL + 'todo/' + props.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': Cookies.get('planbuddy-jwt')
      }
    })
      .then(res => {
        if (res.status === 200) {
          setDeleted(true)
          toast.success('Todo gelöscht')
        } else {
          toast.error('Todo konnte nicht gelöscht werden')
        }
      })
      .catch(error => {
      });

  }

  if (deleted) {
    return (
      <div></div>
    )
  }

  let dragging = props.isDragging ? 'Card--dragging' : '';
  let spacer = props.isSpacer ? 'Card--spacer' : '';
  return _.flowRight(props.connectDragSource, props.connectDropTarget)(
    <div
      className={'Card '+dragging+' '+spacer}
    >
      <p className="Card__title">{props.title}<span className="Card__delete" onClick={deleteCard}>❌</span></p>
      <div>️🔥 {props.workload}</div>
      <div className="TextField">Notiz: {props.note}</div>
    </div>
  );
}

export const DraggableCard = _.flowRight([
  DropTarget(
    'Card',
    {
      hover(props, monitor) {
        const { columnId, columnIndex } = props;
        const draggingItem = monitor.getItem();
        if (draggingItem.id !== props.id) {
          props.moveCard(draggingItem.id, columnId, columnIndex);
        }
      },
    },
    connect => ({
      connectDropTarget: connect.dropTarget(),
    })
  ),
  DragSource(
    'Card',
    {
      beginDrag(props) {
        return { id: props.id };
      },

      isDragging(props, monitor) {
        return props.id === monitor.getItem().id;
      },
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    })
  ),
])(Card);
