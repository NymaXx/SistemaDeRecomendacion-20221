
const comparisonForm = document.querySelector(".comparisonForm");
const personSelect = comparisonForm.person;
const neighborsSize = comparisonForm.neighbors;
const resultSection = document.querySelector(".comparisonForm__results");
const resultGraphicSection = document.querySelector(".comparisonForm__graphic");

let url = './data/databaseNames.csv';
let url2 = './data/databaseSongs.csv';
let result = 0;
let resultSong = 0;
let data = [];
let dataname = [];
let songs = []
let nameList = [];
let neighborsList = [];

Papa.parse(url, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
        data = results.data;
        data.forEach(elem => {
            nameList.push(elem.Nombre);
        });
        renderOptions(0);
        renderOptions(1);
        renderOptions(2);
        renderOptions(3);
        renderOptions(4);


    }
});


Papa.parse(url2, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
        songs = results.data;
    }
});

comparisonForm.addEventListener('submit', event => {
    event.preventDefault();
    const personas = []
    personSelect.forEach(e => {
        const valor = e.value;
        personas.push(getPersonFromList(valor));
    });
    const canciones = [];
    personas.forEach((e) => {
        canciones.push(neighbor(e));
    })
    const cancioneslist = [];
    canciones.forEach((e) => {
        for (let i = 0; i < e.length; i++) {
            cancioneslist.push(e[i]);
        }
    })

    const cancionesInterset = [];
    const arrName = []
    cancioneslist.forEach(e => arrName.push(e.Nombre));
    const noRepeat = new Set(arrName);
    const array = [...noRepeat];
    for (let i = 0; i < array.length; i++) {
        const cancion = array[i];
        let count = 0;

        cancioneslist.forEach(e => {
            if (cancion === e.Nombre) {
                count++;
            }
            if (count == 5) {
                cancionesInterset.push(e);
                count = 0;
            }

        });
    }

    if (cancionesInterset.length < 10) {
        const residuoK = 10 - (cancionesInterset.length);

        personSelect.forEach(e => {
            const valor = e.value;
            if (personas.length < 5) {
                personas.push(getPersonFromList(valor));
            }
        });

        const rock = lessMisery(getCaracteristic(personas, 0));
        const urban = lessMisery(getCaracteristic(personas, 1));
        const latino = lessMisery(getCaracteristic(personas, 2));
        const rb = lessMisery(getCaracteristic(personas, 3));
        const pop = lessMisery(getCaracteristic(personas, 4));
        const instrumental = lessMisery(getCaracteristic(personas, 5));
        const edm = lessMisery(getCaracteristic(personas, 6));
        const dur = ArrayAvg(getCaracteristic(personas, 7));
        const anim = ArrayAvg(getCaracteristic(personas, 8));
        const alegre = ArrayAvg(getCaracteristic(personas, 9));
        const letra = ArrayAvg(getCaracteristic(personas, 10));
        const conocida = ArrayAvg(getCaracteristic(personas, 11));

        const protoPerson = {
            Rock: rock,
            Urbano: urban,
            Latino: latino,
            RB: rb,
            Pop: pop,
            Instrumental: instrumental,
            Electrónico: edm,
            duración: dur,
            animadas: anim,
            alegres: alegre,
            letra: letra,
            conocidas: conocida
        };

        cancionesInterset.push(...neighborProto(protoPerson,residuoK-1));
    }
    console.log(cancionesInterset)
    renderResult(cancionesInterset);
})

function getCaracteristic(array, value) {
    const newArray = [];
    array.forEach(e => {
        if (value == 0) {
            newArray.push(e.Rock);
        } else if (value == 1) {
            newArray.push(e.Urbano);
        } else if (value == 2) {
            newArray.push(e.Latino);
        } else if (value == 3) {
            newArray.push(e.RB);
        } else if (value == 4) {
            newArray.push(e.Pop)
        } else if (value == 5) {
            newArray.push(e.Instrumental)
        } else if (value == 6) {
            newArray.push(e.Electrónico)
        } else if (value == 7) {
            newArray.push(e.duración)
        } else if (value == 8) {
            newArray.push(e.animadas)
        } else if (value == 9) {
            newArray.push(e.alegres)
        } else if (value == 10) {
            newArray.push(e.letra)
        } else {
            newArray.push(e.conocidas)
        }
    })
    return newArray;
}
function lessMisery(array) {
    const bol = array.some(e => e <= 0.66);
    if (bol) {
        return 0;
    } else {
        return ArrayAvg(array);
    }
}

function ArrayAvg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + myArray[i++];
    }
    return summ / ArrayLen;
}

function neighbor(personaA) {
    const personA = personaA;
    const neighborNumber = Number.parseInt(9);
    let list = [];
    let similarityList = [];
    let sortedList = [];

    for (let i = 0; i < songs.length; i++) {
        const personB = songs[i];

        let dotProduct = getDotProduct(personA, personB);
        let magnitudeA = getMagnitude(personA);
        let magnitudeB = getMagnitude(personB);
        let cosineSimilarity = getCosineSimilarity(dotProduct, magnitudeA, magnitudeB);

        similarityList.push({
            ...personB,
            cosineSimilarity: cosineSimilarity
        })
    }

    sortedList = getSortneighbors(similarityList);
    return list = sortedList.splice(0, neighborNumber + 1);
}

function neighborProto(personaA, k) {
    const personA = personaA;
    const neighborNumber = Number.parseInt(k);
    let list = [];
    let similarityList = [];
    let sortedList = [];

    for (let i = 0; i < songs.length; i++) {
        const personB = songs[i];

        let dotProduct = getDotProduct(personA, personB);
        let magnitudeA = getMagnitude(personA);
        let magnitudeB = getMagnitude(personB);
        let cosineSimilarity = getCosineSimilarity(dotProduct, magnitudeA, magnitudeB);

        similarityList.push({
            ...personB,
            cosineSimilarity: cosineSimilarity
        })
    }

    sortedList = getSortneighbors(similarityList);
    return list = sortedList.splice(0, neighborNumber + 1);
}

function renderNameOptions() {
    nameList.forEach(elem => {
        const optionsElem = document.createElement("option");
        optionsElem.innerText = elem;
        optionsElem.value = elem;
        personSelect.appendChild(optionsElem);
    });
}

function getPersonFromList(value) {
    let person = data.find(elem => {
        return elem.Nombre == value;
    });
    return person;
}

function getDotProduct(elemA, elemB) {
    let dotProduct = 0;
    let elemProps = Object.keys(elemA)
    for (let i = 1; i < elemProps.length; i++) {
        let prop = elemProps[i];
        if (prop === 'Link' || prop === 'Nombre') {
            console.log("xdd");
        } else {
            dotProduct += (elemA[prop] * elemB[prop]);
        }

    }
    return dotProduct;
}

function getMagnitude(elem) {
    let magnitude = 0;
    let elemProps = Object.keys(elem);
    for (let i = 1; i < elemProps.length; i++) {
        let prop = elemProps[i];
        if (prop === 'Link' || prop === 'Nombre') {
            console.log("xdd");
        } else {
            magnitude += Math.pow(elem[prop], 2);
        }
    }
    return Math.sqrt(magnitude);
}

function getCosineSimilarity(dotProduct, magnitudeA, magnitudeB) {
    let cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
    return cosineSimilarity;
}

function getSortneighbors(list) {
    let copy = list.sort((a, b) => {
        return b.cosineSimilarity - a.cosineSimilarity;
    })
    return copy;
}

function renderResult(list) {
    resultSection.innerHTML = "";
    let copy = [...list];
    copy.forEach(elem => {
        const listItem = document.createElement("li");
        listItem.classList.add("comparisonForm__li");
        listItem.innerHTML = `${elem.Nombre}: ${getCosineSimilarityToPercent(elem.cosineSimilarity)}%`
        resultSection.appendChild(listItem)
    })
}

function renderGraphic(list) {
    resultGraphicSection.innerHTML = "";
    let copy = [...list];
    let multiplier = 1.75;

    copy.forEach((elem, i) => {
        const iconItem = document.createElement("div");
        iconItem.classList.add("comparisonForm__icon");
        let substract = (100 - (getCosineSimilarityToPercent(elem.cosineSimilarity))) * multiplier;
        iconItem.classList.add(`${i === 0 ? "comparisonForm__icon--first" : "comparisonForm__icon"}`)
        iconItem.innerHTML =
            `
            <div class="arrow-left"></div>
            <section>
            <p>${elem.Nombre}${i !== 0 ? `: ${getCosineSimilarityToPercent(elem.cosineSimilarity)}%` : ""}</p>
            </section>
            `
        iconItem.style.zIndex = `${copy.length - i}`
        iconItem.style.top = `${substract}%`;
        resultGraphicSection.appendChild(iconItem);
    })
}

function getCosineSimilarityToPercent(value) {
    return Math.round(value * 100);
}
function renderOptions(i) {
    nameList.forEach(elem => {
        const optionsElem = document.createElement("option");
        optionsElem.innerText = elem;
        optionsElem.value = elem;
        personSelect[i].appendChild(optionsElem);
    });
}