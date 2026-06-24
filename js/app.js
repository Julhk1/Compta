let gameState = {
    step: 1,
    xp: 100,
    journal: [],
    balances: {
        "512": { debit: 0, credit: 0 }, "101": { debit: 0, credit: 0 }, "164": { debit: 0, credit: 0 },
        "215": { debit: 0, credit: 0 }, "601": { debit: 0, credit: 0 }, "701": { debit: 0, credit: 0 },
        "44571": { debit: 0, credit: 0 }, "44566": { debit: 0, credit: 0 }
    }
};

function initGame() {
    // Vérifier si une sauvegarde est présente dans l'URL ou le LocalStorage
    const urlParams = new URLSearchParams(window.location.search);
    const localSave = localStorage.getItem('financial_hero_save');
    
    if (urlParams.get('load') === 'true' && localSave) {
        try {
            gameState = JSON.parse(atob(localSave));
        } catch(e) {
            alert("Erreur de chargement du code.");
        }
    }
    renderUI();
}

function renderUI() {
    const scenario = scenarios[gameState.step];
    if (!scenario) {
        alert("Félicitations, tu as terminé la version Alpha du jeu !");
        return;
    }

    // Titres & Objectifs
    document.getElementById('mission-title').innerText = scenario.title;
    document.getElementById('quest-title').innerText = scenario.title;
    document.getElementById('quest-description').innerHTML = scenario.description;
    document.getElementById('xp-display').innerText = gameState.xp;
    document.getElementById('xp-bar').style.width = (gameState.step * 33) + "%";

    // Remplir la liste des comptes autorisés pour cette étape
    const select = document.getElementById('account-select');
    select.innerHTML = '';
    for (let code in scenario.accounts) {
        select.innerHTML += `<option value="${code}">${scenario.accounts[code]}</option>`;
    }

    // Mettre à jour le Journal
    const tbody = document.getElementById('journal-table-body');
    tbody.innerHTML = '';
    gameState.journal.forEach(item => {
        tbody.innerHTML += `<tr><td><strong>${item.account}</strong></td><td>${item.debit || '-'}</td><td>${item.credit || '-'}</td></tr>`;
    });

    // Mettre à jour les États Financiers (Bilan)
    renderFinancials();

    // Vérifier la condition de victoire de l'étape
    if (scenario.validate(gameState.balances)) {
        document.getElementById('success-panel').style.display = 'block';
        const encryptedSave = btoa(JSON.stringify(gameState));
        document.getElementById('save-code-display').innerText = encryptedSave;
        localStorage.setItem('financial_hero_save', encryptedSave);
    } else {
        document.getElementById('success-panel').style.display = 'none';
    }
}

function renderFinancials() {
    const actifList = document.getElementById('actif-list');
    const passifList = document.getElementById('passif-list');
    actifList.innerHTML = ''; passifList.innerHTML = '';

    let totalActif = 0; let totalPassif = 0;

    for (let acc in gameState.balances) {
        const d = gameState.balances[acc].debit;
        const c = gameState.balances[acc].credit;
        
        // Comptes d'actif (512, 215, 44566, 601) -> solde débiteur
        if (["512", "215", "44566", "601"].includes(acc)) {
            const solde = d - c;
            if (solde !== 0) {
                actifList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${solde} €</strong></div>`;
                totalActif += solde;
            }
        } 
        // Comptes de passif / produit (101, 164, 701, 44571) -> solde créditeur
        else {
            const solde = c - d;
            if (solde !== 0) {
                passifList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${solde} €</strong></div>`;
                totalPassif += solde;
            }
        }
    }

    document.getElementById('total-actif').innerText = totalActif;
    document.getElementById('total-passif').innerText = totalPassif;
}

function handleFormSubmit() {
    const account = document.getElementById('account-select').value;
    const debit = parseFloat(document.getElementById('input-debit').value) || 0;
    const credit = parseFloat(document.getElementById('input-credit').value) || 0;

    if (debit === 0 && credit === 0) return alert("Indique un montant.");
    if (debit > 0 && credit > 0) return alert("Pas de montant Débit et Crédit sur la même ligne !");

    // Ajouter l'écriture
    gameState.journal.push({ account, debit, credit });
    gameState.balances[account].debit += debit;
    gameState.balances[account].credit += credit;

    // Reset inputs proprement
    document.getElementById('input-debit').value = 0;
    document.getElementById('input-credit').value = 0;

    renderUI();
}

function goToNextStep() {
    gameState.step += 1;
    gameState.xp += 150;
    renderUI();
}

window.onload = initGame;
