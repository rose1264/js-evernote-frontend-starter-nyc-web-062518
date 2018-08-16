document.addEventListener("DOMContentLoaded", ()=>{
  // render all notes
  function renderData(data) {
    let div = document.createElement('div')
    let body = document.getElementsByTagName('body')[0]
    let notesDiv = document.createElement('div')
    div.innerHTML = `<h3>User Name: ${data[0].user.name}</h3>`
    body.appendChild(div)
    data.forEach((note)=>{
      let noteDiv = document.createElement('div')
      noteDiv.innerHTML = displayNotes(note) + `<button class="preview">Preview</button>` + `<button class="edit">Edit</button>` + `<button class="delete">Delete</button>`
      body.appendChild(noteDiv)
      noteDiv.addEventListener("click", function(e){
        if (e.target.className === "preview"){
          noteDiv.innerHTML = displayNotesDetails(note)
        }
        if(e.target.className === "edit"){
          noteDiv.innerHTML = updateNotes(note)
          let updateBtnsArray = [...document.getElementsByClassName('update')]
          updateBtnsArray.forEach((updateBtn)=>{
            updateBtn.addEventListener('click', function() {
              let titleValue = updateBtn.previousElementSibling.previousElementSibling.firstElementChild.value
              let bodyValue = updateBtn.previousElementSibling.firstElementChild.value
              // debugger
              fetch(`http://localhost:3000/api/v1/notes/${note.id}`, {
                method: 'PATCH',
                body: JSON.stringify({title:titleValue, body:bodyValue, user_id:1}),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
          })

          })
        }
        if(e.target.className === "delete"){
          noteDiv.remove()
        }
      })
    })
  }

  // create new notes
  let submit = document.getElementById('submit')
  submit.addEventListener('click', function() {
    let titleValue = document.getElementById('title').value
    let bodyValue = document.getElementById('body').value

    fetch('http://localhost:3000/api/v1/notes', {
      method: 'POST',
      body: JSON.stringify({title:titleValue, body:bodyValue, user_id:1}),
      headers: {
        'Content-Type': 'application/json'
      }
    })

  })

  //update notes


  function updateNotes(note){
    return `<form>
      <input type="hidden" name="_method" value="PUT" />
      <h3>update the note</h3>
      <p>title:<input id='title' value=${note.title}/></p>
      <p>note:<input id='body'value=${note.body}/></p>
      <button class='update'>update</button>
    </form>`
  }

  //helper-function display note title
  function displayNotes(note){
    return `<p>title: ${note.title}</p><p style="display:none">note: ${note.body}</p>`
  }

  //helper-function display note details
  function displayNotesDetails(note){
    return `<p>title: ${note.title}</p><p style="display:block">note: ${note.body}</p>`
  }

  fetch('http://localhost:3000/api/v1/notes')
    .then(res=>res.json())
    .then(data=>renderData(data))
})
