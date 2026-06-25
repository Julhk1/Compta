let gameState = {
    step: 1,
    xp: 100,
    journal: [],
    balances: {
        "101": { debit: 0, credit: 0, label: "101 - Capital Social" },
        "164": { debit: 0, credit: 0, label: "164 - Emprunts" },
        "215": { debit: 0, credit: 0, label: "215 - Matériel Industriel" },
        "2815": { debit: 0, credit: 0, label: "2815 - Amortissement Matériel" },
        "401": { debit: 0, credit: 0, label: "401 - Fournisseurs" },
        "44566": { debit: 0, credit: 0, label: "44566 - TVA Déductible" },
        "44571": { debit: 0, credit: 0, label: "44571 - TVA Collectée" },
        "44551": { debit: 0, credit: 0, label: "44551 - TVA à payer" },
        "512": { debit: 0, credit: 0, label: "512 - Banque" },
        "601": { debit: 0, credit: 0, label: "601 - Achats Farine" },
        "6811": { debit: 0, credit: 0, label: "6811 - Dotation Amortissements" },
        "695": { debit: 0, credit: 0, label: "695 - Impôts sur les bénéfices" },
        "701": { debit: 0, credit: 0, label: "701 - Ventes de pain" }
    }
};

function initGame() {
    const localSave = localStorage.getItem('financial_hero_save');
    
    if (localSave) {
        try {
            gameState = JSON.parse(atob(localSave));
            console.log("Session précédente rechargée automatiquement !");
        } catch(e) {
            console.error("Erreur lors du chargement automatique de la sauvegarde.");
        }
    }
    renderUI();
}

function renderUI() {
    const scenario = scenarios[gameState.step];
    if (!scenario) {
        alert("Félicitations, tu as terminé toutes les quêtes comptables !");
        return;
    }

    document.getElementById('mission-title').innerText = scenario.title;
    document.getElementById('quest-title').innerText = scenario.title;
    document.getElementById('quest-description').innerHTML = scenario.description;
    document.getElementById('xp-display').innerText = gameState.xp;
    document.getElementById('xp-bar').style.width = (gameState.step * 16.6) + "%";

    const select = document.getElementById('account-select');
    select.innerHTML = '';
    for (let code in scenario.accounts) {
        select.innerHTML += `<option value="${code}">${scenario.accounts[code]}</option>`;
    }

    const tbody = document.getElementById('journal-table-body');
    tbody.innerHTML = '';
    gameState.journal.forEach((item, index) => {
        tbody.innerHTML += `<tr>
            <td><strong>${item.account}</strong></td>
            <td>${item.debit || '-'}</td>
            <td>${item.credit || '-'}</td>
            <td><button onclick="deleteLine(${index})" class="btn-danger">❌ Effacer</button></td>
        </tr>`;
    });

    renderFinancials();
}

function handleFormSubmit() {
    const scenario = scenarios[gameState.step];
    const account = document.getElementById('account-select').value;
    const debit = parseFloat(document.getElementById('input-debit').value) || 0;
    const credit = parseFloat(document.getElementById('input-credit').value) || 0;
    const errorBox = document.getElementById('error-message');

    if (debit === 0 && credit === 0 && gameState.step !== 6) {
        return alert("Indique un montant.");
    }
    if (debit > 0 && credit > 0) return alert("Pas de montant Débit et Crédit sur la même ligne !");

    const expected = scenario.expectedEntries[account];
    if (!expected) {
        showError(`⚠️ Erreur : Le compte ${account} n'est pas utilisé dans cette mission.`);
        return;
    }

    if ((expected.debit && debit !== expected.debit) || (expected.credit && credit !== expected.credit) || (expected.debit && credit > 0) || (expected.credit && debit > 0)) {
        gameState.xp = Math.max(0, gameState.xp - 15);
        showError(`❌ Écriture incorrecte ! Vérifie le sens (Débit/Crédit) ou le montant pour le compte ${account}.`);
        document.getElementById('xp-display').innerText = gameState.xp;
        return;
    }

    errorBox.style.display = 'none';
    gameState.journal.push({ account, debit, credit });
    gameState.balances[account].debit += debit;
    gameState.balances[account].credit += credit;

    document.getElementById('input-debit').value = 0;
    document.getElementById('input-credit').value = 0;

    autoSave();
    renderUI();
}

function showError(msg) {
    const errorBox = document.getElementById('error-message');
    errorBox.style.display = 'block';
    errorBox.innerText = msg;
}

function renderFinancials() {
    const actifList = document.getElementById('actif-list');
    const passifList = document.getElementById('passif-list');
    const chargesList = document.getElementById('charges-list');
    const produitsList = document.getElementById('produits-list');
    
    actifList.innerHTML = ''; passifList.innerHTML = ''; chargesList.innerHTML = ''; produitsList.innerHTML = '';
    
    let totalActif = 0; let totalPassif = 0; let totalCharges = 0; let totalProduits = 0;

    for (let acc in gameState.balances) {
        const d = gameState.balances[acc].debit;
        const c = gameState.balances[acc].credit;
        const labelComplexe = gameState.balances[acc].label;

        if (acc.startsWith('6')) {
            const solde = d - c;
            if (solde !== 0) {
                chargesList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${solde} €</strong></div>`;
                totalCharges += solde;
            }
        } else if (acc.startsWith('7')) {
            const solde = c - d;
            if (solde !== 0) {
                produitsList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${solde} €</strong></div>`;
                totalProduits += solde;
            }
        } 
        else {
            if (["215", "44566", "512"].includes(acc)) {
                const soldeActif = d - c;
                if (soldeActif !== 0) {
                    actifList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${soldeActif} €</strong></div>`;
                    totalActif += soldeActif;
                }
            } 
            else {
                const soldePassif = c - d;
                if (soldePassif !== 0) {
                    passifList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${soldePassif} €</strong></div>`;
                    totalPassif += soldePassif;
                }
            }
        }
    }

    const resultatCourant = totalProduits - totalCharges;
    if (resultatCourant > 0) {
        passifList.innerHTML += `<div class="financial-line" style="color:var(--accent-green)"><span>120 - Bénéfice de l'exercice</span><strong>${resultatCourant} €</strong></div>`;
        totalPassif += resultatCourant;
    } else if (resultatCourant < 0) {
        passifList.innerHTML += `<div class="financial-line" style="color:var(--accent-red)"><span>129 - Perte de l'exercice</span><strong>${resultatCourant} €</strong></div>`;
        totalPassif += resultatCourant;
    }

    document.getElementById('total-actif').innerText = totalActif;
    document.getElementById('total-passif').innerText = totalPassif;
    document.getElementById('total-charges').innerText = totalCharges;
    document.getElementById('total-produits').innerText = totalProduits;
    document.getElementById('resultat-net').innerText = resultatCourant;

    const scenario = scenarios[gameState.step];
    const linesRequired = Object.keys(scenario.expectedEntries).length;
    
    if (gameState.journal.length === linesRequired && totalActif === totalPassif) {
        document.getElementById('success-panel').style.display = 'block';
        autoSave();
    } else {
        document.getElementById('success-panel').style.display = 'none';
    }
}

function deleteLine(index) {
    const item = gameState.journal[index];
    gameState.balances[item.account].debit -= item.debit;
    gameState.balances[item.account].credit -= item.credit;
    gameState.journal.splice(index, 1);
    autoSave();
    renderUI();
}

function autoSave() {
    const encryptedSave = btoa(JSON.stringify(gameState));
    localStorage.setItem('financial_hero_save', encryptedSave);
}

function manualSaveAndExit() {
    autoSave();
    window.location.href = 'index.html';
}

function skipStepTesting() {
    const scenario = scenarios[gameState.step];
    if (!scenario) return;

    gameState.journal = [];

    for (let acc in scenario.expectedEntries) {
        const expected = scenario.expectedEntries[acc];
        const deb = expected.debit || 0;
        const cred = expected.credit || 0;

        gameState.journal.push({ account: acc, debit: deb, credit: cred });
        gameState.balances[acc].debit += deb;
        gameState.balances[acc].credit += cred;
    }

    autoSave();
    renderUI();
}

// AJOUT : Nouvelle fonction de retour arrière pour tes tests de navigation
function previousStepTesting() {
    if (gameState.step > 1) {
        gameState.step -= 1;
        gameState.xp = Math.max(100, gameState.xp - 150);
        
        // Optionnel : Nettoie le journal visuel courant pour la clarté de l'étape reprise
        gameState.journal = []; 
        
        autoSave();
        renderUI();
    } else {
        alert("Vous êtes déjà à la première étape !");
    }
}

function goToNextStep() {
    gameState.step += 1;
    gameState.xp += 150;
    gameState.journal = [];
    autoSave();
    renderUI();
}

window.onload = initGame;
