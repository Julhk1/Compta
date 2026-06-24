const scenarios = {
    1: {
        title: "Étape 1 : Le Financement de base",
        description: `<p>Pierre ouvre sa boulangerie. Il dépose <strong>20 000 €</strong> de capital social à la banque et reçoit son prêt bancaire de <strong>30 000 €</strong>.</p><p><em>Objectif : Enregistrer ces entrées de fonds.</em></p>`,
        accounts: { "512": "512 - Banque", "101": "101 - Capital Social", "164": "164 - Emprunts" },
        validate: (balances) => {
            const banque = balances["512"].debit - balances["512"].credit;
            const capital = balances["101"].credit - balances["101"].debit;
            const emprunt = balances["164"].credit - balances["164"].debit;
            return banque === 50000 && capital === 20000 && emprunt === 30000;
        }
    },
    2: {
        title: "Étape 2 : L'Investissement du matériel",
        description: `<p>Pour faire du bon pain, il faut un four ! Pierre achète un four professionnel d'une valeur de <strong>15 000 € HT</strong>. Il paie par virement bancaire.</p><p><em>Note : On ignore temporairement la TVA pour cette étape. Le four est une immobilisation (Compte 215).</em></p>`,
        accounts: { "512": "512 - Banque", "215": "215 - Matériel Industriel" },
        validate: (balances) => {
            return balances["215"].debit === 15000 && (balances["512"].debit - balances["512"].credit) === 35000;
        }
    },
    3: {
        title: "Étape 3 : Premier mois d'activité & TVA",
        description: `<p>Le premier mois est fini ! La caisse enregistreuse certifiée indique <strong>4 220 € TTC</strong> de ventes de pain (TVA à 5,5% incluse).</p>
                      <p>Pierre a aussi acheté de la farine pour <strong>1 055 € TTC</strong> (1 000 € HT + 55 € de TVA déductible).</p>
                      <p><em>Astuce : Calcule les montants HT et isole la TVA collectée (44571) et déductible (44566) !</em></p>`,
        accounts: { "512": "512 - Banque", "601": "601 - Achats Farine", "701": "701 - Ventes de pain", "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible" },
        validate: (balances) => {
            return balances["701"].credit === 4000 && balances["44571"].credit === 220 && balances["601"].debit === 1000 && balances["44566"].debit === 55;
        }
    }
};
