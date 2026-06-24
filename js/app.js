let gameState = {
    step: 1,
    xp: 100,
    journal: [],
    balances: {
        "512": { debit: 0, credit: 0 }, "101": { debit: 0, credit: 0 }, "164": { debit: 0, credit: 0 },
        "215": { debit: 0, credit: 0 }, "2815": { debit: 0, credit: 0 }, "601": { debit: 0, credit: 0 }, 
        "701": { debit: 0, credit: 0 }, "44571": { debit: 0, credit: 0 }, "44566": { debit: 0, credit: 0 },
        "44551": { debit: 0, credit: 0 }, "6811": { debit: 0, credit: 0 }, "695": { debit: 0, credit: 0 }
    }
};

function initGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const localSave = localStorage.getItem('financial_hero_save');
    
    if (urlParams.get('load') === 'true' && localSave) {
        try {
            gameState = JSON.parse(atob(localSave));
        } catch(e) {
            alert("Erreur de chargement.");
        }
    }
    renderUI();
}

function renderUI() {
    const scenario = scenarios[gameState.step];
    if (!scenario) {
        alert("Félicitations, tu as terminé toutes les quêtes !");
        return;
    }

    document.getElementById('mission-title').innerText = scenario.title;
    document.getElementById('quest-title').innerText = scenario.title;
    document.getElementById('quest-description').innerHTML = scenario.description;
    document.getElementById('xp-display').innerText = gameState.xp;
    document.getElementById('xp-bar').style.width = (gameState.step * 16.6) + "%"; // 6 étapes au total

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

    if (debit === 0 && credit === 0) return alert("Indique un montant.");
    if (debit > 0 && credit > 0) return alert("Pas de montant Débit et Crédit sur la même ligne !");

    // VALIDATION STRICTE DE LA LIGNE SELON LE SCÉNARIO
    const expected = scenario.expectedEntries[account];
    if (!expected) {
        showError(`⚠️ Ce compte n'est pas censé bouger à cette étape.`);
        return;
    }

    if ((expected.debit && debit !== expected.debit) || (expected.credit && credit !== expected.credit) || (expected.debit && credit > 0) || (expected.credit && debit > 0)) {
        gameState.xp = Math.max(0, gameState.xp - 20); // Pénalité d'XP
        showError(`❌ Erreur d'écriture ! Le compte ${account} n'est pas correctement mouvementé. Réfléchis au sens du flux (Débit ou Crédit) et au montant exact.`);
        document.getElementById('xp-display').innerText = gameState.xp;
        return;
    }

    // Si tout est bon, on valide la ligne
    errorBox.style.display = 'none';
    gameState.journal.push({ account, debit, credit });
    gameState.balances[account].debit += debit;
    gameState.balances[account].credit += credit;

    document.getElementById('input-debit').value = 0;
    document.getElementById('input-credit').value = 0;

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
        const soldeDebiteur = d - c;
        const soldeCrediteur = c - d;

        if (soldeDebiteur === 0 && soldeCrediteur === 0) continue;

        // 1. COMPTE DE RÉSULTAT (Classes 6 et 7)
        if (acc.startsWith('6')) {
            chargesList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${soldeDebiteur} €</strong></div>`;
            totalCharges += soldeDebiteur;
        } else if (acc.startsWith('7')) {
            produitsList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${soldeCrediteur} €</strong></div>`;
            totalProduits += soldeCrediteur;
        } 
        // 2. BILAN (Classes 1 à 4)
        else if (["512", "215", "44566"].includes(acc)) { // Actif
            actifList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${soldeDebiteur} €</strong></div>`;
            totalActif += soldeDebiteur;
        } else { // Passif (101, 164, 44571, 44551, 2815)
            actifList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${soldeCrediteur} €</strong></div>`;
            totalPassif += soldeCrediteur;
        }
    }

    // Injection des totaux Bilan
    document.getElementById('total-actif').innerText = totalActif;
    document.getElementById('total-passif').innerText = totalPassif;

    // Injection des totaux Résultat
    document.getElementById('total-charges').innerText = totalCharges;
    document.getElementById('total-produits').innerText = totalProduits;
    document.getElementById('resultat-net').innerText = totalProduits - totalCharges;

    // Validation automatique de l'étape si le nombre de lignes requises est atteint sans erreur
    const scenario = scenarios[gameState.step];
    const requiredLines = Object.keys(scenario.expectedEntries).length;
    if (gameState.journal.length >= requiredLines && totalActif === totalPassif) {
        document.getElementById('success-panel').style.display = 'block';
        const encryptedSave = btoa(JSON.stringify(gameState));
        document.getElementById('save-code-display').innerText = encryptedSave;
        localStorage.setItem('financial_hero_save', encryptedSave);
    } else {
        document.getElementById('success-panel').style.display = 'none';
    }
}

function deleteLine(index) {
    const item = gameState.journal[index];
    gameState.balances[item.account].debit -= item.debit;
    gameState.balances[item.account].credit -= item.credit;
    gameState.journal.splice(index, 1);
    renderUI();
}

function manualSaveAndExit() {
    const encryptedSave = btoa(JSON.stringify(gameState));
    localStorage.setItem('financial_hero_save', encryptedSave);
    alert(`Partie sauvegardée !`);
    window.location.href = 'index.html';
}

function goToNextStep() {
    gameState.step += 1;
    gameState.xp += 150;
    gameState.journal = []; // On nettoie le journal pour le nouveau mois
    renderUI();
}

window.onload = initGame;
