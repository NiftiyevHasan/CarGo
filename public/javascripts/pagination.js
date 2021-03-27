const paginate = document.querySelector('#paginate')
const cargoContainer = document.querySelector('#cargoContainer')

paginate.addEventListener('click', function (event) {
    event.preventDefault();
    fetch(this.href)
        .then(response => response.json())
        .then(data => {
            for (const cargo of data.docs) {
                const template = generateCargo(cargo);
                const content = document.createElement("div");
                content.className="col"
                content.innerHTML = template;
                cargoContainer.append(content);
            }
            const { nextPage } = data;
            this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
        });
})


function generateCargo(cargo) {
    const template = `<div class="card h-100">
        <img src="${cargo.images.length ? cargo.images[0].url : 'https://res.cloudinary.com/dgviuwbga/image/upload/v1616777099/CarGO/photo-1595246007497-15e0ed4b8d96_msx3jh.jpg'}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${cargo.type}</h5>
                <p class="card-text">${cargo.description}</p>
                <p class="card-text">
                    <small class="text-muted"> From ${cargo.location} to ${cargo.destination}</small></p>
                <a class="btn btn-primary" href=" /cargopanel/${cargo.id}"> View ${cargo.type}</a>
            </div>
            <div class="card-footer">
                <small class="text-muted">Last updated 3 mins ago</small>
            </div>
        </div>` 

    return template;
}




