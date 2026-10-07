let saints = [];

const chooseSaintButton = document.getElementById("chooseSaintButton");
const helpMeChooseButton = document.getElementById("helpMeChooseButton");
const questionnaire = document.getElementById("questionnaire");
const questionnaireResult = document.getElementById("questionnaireResult");
const serviceButton = document.getElementById("serviceButton");
const courageButton = document.getElementById("courageButton");

const saintResult = document.getElementById("saintResult");

fetch("saints.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        saints = data;
        console.log("Saint database loaded:", saints);
    });

chooseSaintButton.addEventListener("click", function() {
    questionnaire.innerHTML = "";
    questionnaireResult.innerHTML = "";

    const randomIndex = Math.floor(Math.random() * saints.length);

    const selectedSaint = saints[randomIndex];

saintResult.innerHTML = `
    <div class="cross">✝</div>
    <h2>${selectedSaint.name}</h2>
    <p class="feast-day"><strong>Feast Day:</strong> ${selectedSaint.feastDay}</p>
    <p><strong>Region:</strong> ${selectedSaint.region}</p>
    <p><strong>Country:</strong> ${selectedSaint.country}</p>
    <p><strong>Patronage:</strong> ${selectedSaint.patronage}</p>

    <p><strong>Qualities:</strong></p>
    <div class="saint-tags">
        ${selectedSaint.qualities.map(function(quality) {
            return `<span class="saint-tag">${quality}</span>`;
        }).join("")}
    </div>

    <p><strong>Causes:</strong></p>
    <div class="saint-tags">
        ${selectedSaint.causes.map(function(cause) {
            return `<span class="saint-tag">${cause}</span>`;
        }).join("")}
    </div>

    <p><strong>Life Themes:</strong></p>
    <div class="saint-tags">
        ${selectedSaint.lifeThemes.map(function(theme) {
            return `<span class="saint-tag">${theme}</span>`;
        }).join("")}
    </div>

    <h3>About This Saint</h3>
    <p>${selectedSaint.description}</p>

    <button id="startOverButton" class="start-over-button">Start Over</button>
`;

const startOverButton = document.getElementById("startOverButton");

startOverButton.addEventListener("click", function() {
    saintResult.innerHTML = "";
    questionnaireResult.innerHTML = "";
    helpMeChooseButton.click();
});
});


helpMeChooseButton.addEventListener("click", function() {
    saintResult.innerHTML = "";
    questionnaireResult.innerHTML = "";

    let selectedQualities = [];
    let selectedGender = null;

    questionnaire.innerHTML = `
        <h2>What qualities are important to you?</h2>
        <p>Choose one or more qualities you feel drawn to.</p>

<div class="choice-group">   
    <button id="humilityButton">Humility</button>
    <button id="serviceButton">Service</button>
    <button id="faithButton">Faith</button>
    <button id="courageButton">Courage</button>
    <button id="compassionButton">Compassion</button>
    <button id="perseveranceButton">Perseverance</button>
    <button id="patienceButton">Patience</button>
    <button id="wisdomButton">Wisdom</button>
    <button id="charityButton">Charity</button>
    <button id="hopeButton">Hope</button>
    <button id="joyButton">Joy</button>
    <button id="simplicityButton">Simplicity</button>
</div>

       

        <h2>Do you have a preference for the saint's gender?</h2>

     <div class="choice-group">    
        <button id="maleButton">Male</button>
        <button id="femaleButton">Female</button>
        <button id="openToGuidanceButton">Open to where God leads</button>
     </div>   

     <button id="findMySaintButton" class="primary-button">Find My Saint</button>  
    `;

    const maleButton = document.getElementById("maleButton");
    const femaleButton = document.getElementById("femaleButton");
    const openToGuidanceButton = document.getElementById("openToGuidanceButton");
    const findMySaintButton = document.getElementById("findMySaintButton");

findMySaintButton.addEventListener("click", function() {
            if (selectedQualities.length === 0) {
            questionnaireResult.innerHTML = `
                <p>Please select at least one quality.</p>
            `;
            return;
        }

        if (selectedGender === null) {
            questionnaireResult.innerHTML = `
                <p>Please select a gender preference.</p>
            `;
            return;
        }

    const matchingSaints = saints.filter(function(saint) {
        const qualityMatches = selectedQualities.some(function(quality) {
            return saint.qualities.includes(quality);
        });

        const genderMatches =
            selectedGender === "open" ||
            saint.gender === selectedGender;

        return qualityMatches && genderMatches;
    });
    
    matchingSaints.forEach(function(saint) {
    saint.score = selectedQualities.filter(function(quality) {
        return saint.qualities.includes(quality);
    }).length;
});
matchingSaints.sort(function(a, b) {
    return b.score - a.score;
});

if (matchingSaints.length === 0) {
    questionnaireResult.innerHTML = `
        <p>No saints matched your selections.</p>
        <p>Try choosing different qualities or another gender preference.</p>
    `;
    return;
}

   questionnaireResult.innerHTML = `
   <h2>Saints You May Connect With</h2>
    <p>Matching saints found: ${matchingSaints.length}</p>
    ${matchingSaints.map(function(saint) {
    const matchedQualities = saint.qualities.filter(function(quality) {
        return selectedQualities.includes(quality);
    });

    return `
        <div class="saint-match">
            <h3 class="saint-choice" data-saint-id="${saint.id}">
                ${saint.name} — ${saint.score} of ${selectedQualities.length} qualities match
            </h3>
            <p class="match-reason">
                Matches: ${matchedQualities.join(" • ")}
            </p>
        </div>
    `;
}).join("")}
`;

document.querySelectorAll(".saint-choice").forEach(function(saintChoice) {
    saintChoice.addEventListener("click", function() {
        const selectedSaint = saints.find(function(saint) {
            return saint.id === saintChoice.dataset.saintId;
        });

 saintResult.innerHTML = `
    <div class="cross">✝</div>
<h2>${selectedSaint.name}</h2>
    <p class="feast-day"><strong>Feast Day:</strong> ${selectedSaint.feastDay}</p>
    <p><strong>Region:</strong> ${selectedSaint.region}</p>
    <p><strong>Country:</strong> ${selectedSaint.country}</p>
    <p><strong>Patronage:</strong> ${selectedSaint.patronage}</p>
    <p><strong>Qualities:</strong></p>
<div class="saint-tags">
    ${selectedSaint.qualities.map(function(quality) {
        return `<span class="saint-tag">${quality}</span>`;
    }).join("")}
</div>
    <p><strong>Causes:</strong></p>
<div class="saint-tags">
    ${selectedSaint.causes.map(function(cause) {
        return `<span class="saint-tag">${cause}</span>`;
    }).join("")}
</div>
    <p><strong>Life Themes:</strong></p>
<div class="saint-tags">
    ${selectedSaint.lifeThemes.map(function(theme) {
        return `<span class="saint-tag">${theme}</span>`;
    }).join("")}
</div>
   <h3>About This Saint</h3>
<p>${selectedSaint.description}</p>

<button id="startOverButton" class="start-over-button">Start Over</button>
`;
const startOverButton = document.getElementById("startOverButton");

startOverButton.addEventListener("click", function() {
    saintResult.innerHTML = "";
    questionnaireResult.innerHTML = "";
    helpMeChooseButton.click();
});
    });
});

});

const humilityButton = document.getElementById("humilityButton");
const serviceButton = document.getElementById("serviceButton");
const faithButton = document.getElementById("faithButton");
const courageButton = document.getElementById("courageButton");
const compassionButton = document.getElementById("compassionButton");
const perseveranceButton = document.getElementById("perseveranceButton");
const patienceButton = document.getElementById("patienceButton");
const wisdomButton = document.getElementById("wisdomButton");
const charityButton = document.getElementById("charityButton");
const hopeButton = document.getElementById("hopeButton");
const joyButton = document.getElementById("joyButton");
const simplicityButton = document.getElementById("simplicityButton");

maleButton.addEventListener("click", function() {
    selectedGender = "male";

    maleButton.classList.add("selected");
    femaleButton.classList.remove("selected");
    openToGuidanceButton.classList.remove("selected");
});  

femaleButton.addEventListener("click", function() {
    selectedGender = "female";

    femaleButton.classList.add("selected");
    maleButton.classList.remove("selected");
    openToGuidanceButton.classList.remove("selected");
});

openToGuidanceButton.addEventListener("click", function() {
    selectedGender = "open";

    openToGuidanceButton.classList.add("selected");
    maleButton.classList.remove("selected");
    femaleButton.classList.remove("selected");
});

humilityButton.addEventListener("click", function() {
    if (selectedQualities.includes("humility")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "humility";
        });

        humilityButton.classList.remove("selected");

    } else if (!selectedQualities.includes("humility")) {
        selectedQualities.push("humility");
        humilityButton.classList.add("selected");
    }
});

serviceButton.addEventListener("click", function() {
    if (selectedQualities.includes("service")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "service";
        });

        serviceButton.classList.remove("selected");

    } else if (!selectedQualities.includes("service")) {
        selectedQualities.push("service");
        serviceButton.classList.add("selected");
    }
});

faithButton.addEventListener("click", function() {
    if (selectedQualities.includes("faith")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "faith";
        });

        faithButton.classList.remove("selected");

    } else if (!selectedQualities.includes("faith")) {
        selectedQualities.push("faith");
        faithButton.classList.add("selected");
    }
});

courageButton.addEventListener("click", function() {
    if (selectedQualities.includes("courage")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "courage";
        });

        courageButton.classList.remove("selected");

    } else if (!selectedQualities.includes("courage")) {
        selectedQualities.push("courage");
        courageButton.classList.add("selected");
    }
});
compassionButton.addEventListener("click", function() {
    if (selectedQualities.includes("compassion")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "compassion";
        });

        compassionButton.classList.remove("selected");
    } else {
        selectedQualities.push("compassion");
        compassionButton.classList.add("selected");
    }
});

perseveranceButton.addEventListener("click", function() {
    if (selectedQualities.includes("perseverance")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "perseverance";
        });

        perseveranceButton.classList.remove("selected");
    } else {
        selectedQualities.push("perseverance");
        perseveranceButton.classList.add("selected");
    }
});

patienceButton.addEventListener("click", function() {
    if (selectedQualities.includes("patience")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "patience";
        });

        patienceButton.classList.remove("selected");
    } else {
        selectedQualities.push("patience");
        patienceButton.classList.add("selected");
    }
});

wisdomButton.addEventListener("click", function() {
    if (selectedQualities.includes("wisdom")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "wisdom";
        });

        wisdomButton.classList.remove("selected");
    } else {
        selectedQualities.push("wisdom");
        wisdomButton.classList.add("selected");
    }
});

charityButton.addEventListener("click", function() {
    if (selectedQualities.includes("charity")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "charity";
        });

        charityButton.classList.remove("selected");
    } else {
        selectedQualities.push("charity");
        charityButton.classList.add("selected");
    }
});

hopeButton.addEventListener("click", function() {
    if (selectedQualities.includes("hope")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "hope";
        });

        hopeButton.classList.remove("selected");
    } else {
        selectedQualities.push("hope");
        hopeButton.classList.add("selected");
    }
});

joyButton.addEventListener("click", function() {
    if (selectedQualities.includes("joy")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "joy";
        });

        joyButton.classList.remove("selected");
    } else {
        selectedQualities.push("joy");
        joyButton.classList.add("selected");
    }
});

simplicityButton.addEventListener("click", function() {
    if (selectedQualities.includes("simplicity")) {
        selectedQualities = selectedQualities.filter(function(quality) {
            return quality !== "simplicity";
        });

        simplicityButton.classList.remove("selected");
    } else {
        selectedQualities.push("simplicity");
        simplicityButton.classList.add("selected");
    }
});

});
