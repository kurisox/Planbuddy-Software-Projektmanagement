import React from 'react';
import {Column} from './Column';
import {DraggableCard} from './Card';

export function Board({cards, columns, moveCard, addCard}) {
  return (
    <div className="Board">
      {columns.map(column => (
        <Column
          key={column.id}
          title={column.title}
          addCard={addCard.bind(null, column.id)}
        >
          {column.cardIds
            .map(cardId => cards.find(card => card.id === cardId))
            .map((card, index) => (
              <DraggableCard
                key={card.id}
                id={card.id}
                columnId={column.id}
                columnIndex={index}
                title={card.title}
                note={card.todo.NOTIZ}
                workload={card.todo.WORKLOAD}
                moveCard={moveCard}
              />
            ))}
          {column.cardIds.length === 0 && (
            <DraggableCard
              isSpacer
              moveCard={cardId => moveCard(cardId, column.id, 0)}
            />
          )}
        </Column>
      ))}
     
    </div>
  );
}
