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
                content.innerHTML = template;
                cargoContainer.append(content);
            }
            const { nextPage } = data;
            this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
        });
})


function generateCargo(cargo) {
    const template = `<div class="card mb-3">
    <div class="row">
        <div class="col-md-4">

            <img src="${cargo.images.length ? cargo.images[0].url : 'https://res.cloudinary.com/dgviuwbga/image/upload/v1615736103/CarGO/dgmvebjmkwkubyw8nrgc.jpg'} " class="img-fluid" alt="">

        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">
                    ${cargo.type}
    
                </h5>
                <p class="card-text">
                    ${cargo.description}
                </p>
                <p class="card-text">
                    <small class="text-muted">
                        ${cargo.location}
                    </small>
                </p>
                <a class="btn btn-primary" href="/cargopanel/${cargo.id}"> View ${cargo.type}</a>
            </div>
        </div>
    </div>
    </div>`

    return template;
}
