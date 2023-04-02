document.addEventListener("DOMContentLoaded",() => {
    let tBody = document.querySelector("#table-body")
    let dogForm = document.querySelector("#dog-form")

    function renderDog(dog) {
        let tr = document.createElement("tr")
        tr.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button data-id=${dog.id}>Edit</button></td>
        `
        tBody.appendChild(tr)
    }

    function renderDogs(dogs) {
        tBody.innerHTML = " "
        dogs.forEach(dog => renderDog(dog))
    }

    function fetchDogs() {
        return fetch("http://localhost:3000/dogs")
        .then(res=>res.json())
    }

    function patchDog(dog) {
        const options = {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dog)
        }
        return fetch(`http://localhost:3000/dogs/${dog.id}`, options)
          .then(resp => resp.json())
    }

    function populateForm(dog) {
        dogForm.name.value = dog.name
        dogForm.breed.value = dog.breed
        dogForm.sex.value = dog.sex
        dogForm.dataset.id = dog.id
    }

    function handleEdit(e) {
        let dogId = e.target.dataset.id
        fetch(`http://localhost:3000/dogs/${dogId}`)
        .then(resp => resp.json())
        .then(dog => populateForm(dog))
    }

    function handleFormSubmit(e) {
        e.preventDefault()
        let dog = {
            id: dogForm.dataset.id,
            name: dogForm.name.value,
            breed: dogForm.breed.value,
            sex: dogForm.sex.value
        }
        patchDog(dog)
        .then(() => fetchDogs())
        .then(renderDogs)
        .then(() => {
            dogForm.reset()
            delete dogForm.dataset.id
        })
    }
    fetchDogs().then(renderDogs)

    tableBody.addEventListener('click', handleEdit)
    dogForm.addEventListener('submit', handleFormSubmit)
})