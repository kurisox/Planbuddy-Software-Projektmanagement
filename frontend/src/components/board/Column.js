import React from 'react';
import Button from '@mui/material/Button';
import Swal from 'sweetalert2';

export function Column(props) {
  return (
    <div className="Column">
      <div className="Column__title">{props.title}</div>
      {props.children}
      <Button variant="contained" sx={{ background: '#335C7D' }} onClick={() => {
        Swal.fire({
          title: 'Create a new TODO!',
          confirmButtonColor: '#335C7D',
          html:
            '<input type="text" class="swal2-input" id="new-todo-title" placeholder="Titel"/> <br/>' +
            '<input type="number" class="swal2-input" id="new-todo-workload" placeholder="Workload"/> <br/>' +
            '<input type="text" class="swal2-input" id="new-todo-note" placeholder="Notiz"/>'
        })
        .then((result) => {
          if (result.isConfirmed) {
            let title = document.getElementById('new-todo-title').value;
            let workload = document.getElementById('new-todo-workload').value;
            let note = document.getElementById('new-todo-note').value;
            props.addCard(title, workload, note);
          }
        })
      }}
      >Add card</Button>
    </div>
  );
}
