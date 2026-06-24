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
        alert("Félicitations, tu as terminé toutes les quêtes disponibles !");
        return;
    }

    document.getElementById('mission-title').innerText = scenario.title;
    document.getElementById('quest-title').innerText = scenario.title;
    document.getElementById('quest-description').innerHTML = scenario.description;
    document.getElementById('xp-display').innerText = gameState.xp;
    document.getElementById('xp-bar').style.width = (gameState.step * 33) + "%";

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

function renderFinancials() {
    const actifList = document.getElementById('actif-list');
    const passifList = document.getElementById('passif-list');
    const errorBox = document.getElementById('error-message');
    
    actifList.innerHTML = ''; passifList.innerHTML = '';
    let totalActif = 0; let totalPassif = 0;

    for (let acc in gameState.balances) {
        const d = gameState.balances[acc].debit;
        const c = gameState.balances[acc].credit;
        
        if (["512", "215", "44566", "601"].includes(acc)) {
            const solde = d - c;
            if (solde !== 0) {
                actifList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${solde} €</strong></div>`;
                totalActif += solde;
            }
        } else {
            const solde = c - d;
            if (solde !== 0) {
                passifList.innerHTML += `<div class="financial-line"><span>Comptes ${acc}</span><strong>${solde} €</strong></div>`;
                totalPassif += solde;
            }
        }
    }

    document.getElementById('total-actif').innerText = totalActif;
    document.getElementById('total-passif').innerText = totalPassif;

    // Détection des anomalies
    if (totalActif !== totalPassif && gameState.journal.length > 0) {
        errorBox.style.display = 'block';
        errorBox.innerText = `⚠️ Alerte Expert : Votre bilan n'est pas équilibré ! Total Actif (${totalActif}€) ≠ Total Passif (${totalPassif}€). Vérifiez vos débits et crédits.`;
    } else {
        errorBox.style.display = 'none';
    }

    // Validation du scénario
    const scenario = scenarios[gameState.step];
    if (scenario && scenario.validate(gameState.balances)) {
        document.getElementById('success-panel').style.display = 'block';
        const encryptedSave = btoa(JSON.stringify(gameState));
        document.getElementById('save-code-display').innerText = encryptedSave;
        localStorage.setItem('financial_hero_save', encryptedSave);
    } else {
        document.getElementById('success-panel').style.display = 'none';
    }
}

function handleFormSubmit() {
    const account = document.getElementById('account-select').value;
    const debit = parseFloat(document.getElementById('input-debit').value) || 0;
    const credit = parseFloat(document.getElementById('input-credit').value) || 0;

    if (debit === 0 && credit === 0) return alert("Indique un montant.");
    if (debit > 0 && credit > 0) return alert("Pas de montant Débit et Crédit sur la même ligne !");

    gameState.journal.push({ account, debit, credit });
    gameState.balances[account].debit += debit;
    gameState.balances[account].credit += credit;

    document.getElementById('input-debit').value = 0;
    document.getElementById('input-credit').value = 0;

    renderUI();
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
    alert(`Votre progression a été sauvegardée dans le navigateur !\n\nVoici votre code de sauvegarde si vous changez de PC :\n\n${encryptedSave}`);
    window.location.href = 'index.html';
}

function goToNextStep() {
    gameState.step += 1;
    gameState.xp += 150;
    renderUI();
}

window.onload = initGame;
