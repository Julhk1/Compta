const scenarios = {
    1: {
        title: "Étape 1 : Le Financement de base",
        description: `<p>Pierre ouvre sa boulangerie. Il dépose <strong>20 000 €</strong> de capital social à la banque et reçoit son prêt bancaire de <strong>30 000 €</strong>.</p>
                      <p><em>Objectif : Enregistrer ces entrées de fonds au débit de la banque (512) et l'origine au crédit du Capital (101) et de l'Emprunt (164).</em></p>`,
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
        description: `<p>Pour faire du bon pain, il faut un four ! Pierre achète un four professionnel d'une valeur de <strong>15 000 € HT</strong>. Il paie par virement bancaire.</p>
                      <p><em>Note : Le four est une immobilisation durable (Compte 215). L'argent sort de la banque (512).</em></p>`,
        accounts: { "512": "512 - Banque", "215": "215 - Matériel Industriel" },
        validate: (balances) => {
            return balances["215"].debit === 15000 && (balances["512"].debit - balances["512"].credit) === 35000;
        }
    },
    3: {
        title: "Étape 3 : Premier mois d'activité & TVA",
        description: `<p>Le premier mois est fini ! La caisse enregistreuse indique <strong>4 220 € TTC</strong> de ventes de pain (TVA à 5,5% incluse).</p>
                      <p>Pierre a aussi acheté de la farine pour <strong>1 055 € TTC</strong> (1 000 € HT + 55 € de TVA déductible).</p>
                      <p><strong>Calculs :</strong><br>
                      • Ventes HT = 4 220 / 1,055 = 4 000 € (Crédit 701) | TVA Collectée = 220 € (Crédit 44571)<br>
                      • Achats HT = 1 000 € (Débit 601) | TVA Déductible = 55 € (Débit 44566)</p>
                      <p><em>Enregistre les 4 lignes au journal (2 pour l'achat, 2 pour la vente). Les contreparties sur la banque (512) se feront automatiquement à l'étape suivante.</em></p>`,
        accounts: { "601": "601 - Achats Farine", "701": "701 - Ventes de pain", "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible" },
        validate: (balances) => {
            return balances["701"].credit === 4000 && balances["44571"].credit === 220 && balances["601"].debit === 1000 && balances["44566"].debit === 55;
        }
    },
    4: {
        title: "Étape 4 : Le Calendrier Fiscal - Déclaration de TVA",
        description: `<p>C'est le 15 du mois, l'heure de télétransmettre la TVA sur <strong>impots.gouv.fr</strong>. Tu dois solder (mettre à zéro) les comptes de TVA du mois précédent et calculer la TVA due.</p>
                      <p>• Débite le compte <strong>44571</strong> pour 220 € (pour le vider).<br>
                         • Crédite le compte <strong>44566</strong> pour 55 € (pour le vider).<br>
                         • Constate la dette envers l'État en mettant la différence au Crédit du compte <strong>44551 (TVA à payer)</strong> pour 165 €.</p>`,
        accounts: { "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible", "44551": "44551 - TVA à payer" },
        validate: (balances) => {
            return balances["44571"].debit === 220 && balances["44566"].credit === 55 && balances["44551"].credit === 165;
        }
    },
    5: {
        title: "Étape 5 : Travaux d'Inventaire - L'Amortissement",
        description: `<p>On arrive à la fin de l'année. Le four acheté 15 000 € s'use. En France, un four s'amortit en mode linéaire sur 5 ans (soit 20% par an).</p>
                      <p><strong>Calcul de la dotation :</strong> 15 000 € x 20% = <strong>3 000 €</strong>.</p>
                      <p><em>Objectif : Enregistre cette perte de valeur. Débite le compte de charge <strong>6811 (Dotation)</strong> pour 3 000 € et crédite le compte d'actif soustractif <strong>2815 (Amortissement du matériel)</strong> pour 3 000 €.</em></p>`,
        accounts: { "6811": "6811 - Dotation aux Amortissements", "2815": "2815 - Amortissement Matériel" },
        validate: (balances) => {
            return balances["6811"].debit === 3000 && balances["2815"].credit === 3000;
        }
    },
    6: {
        title: "Étape 6 : Clôture de l'Exercice - L'Impôt sur les Sociétés (IS)",
        description: `<p>Faisons le point sur le Compte de Résultat avant impôt :<br>
                      • Produits (Ventes 701) : 4 000 €<br>
                      • Charges (Farine 601 + Usure 6811) : 1 000 € + 3 000 € = 4 000 €.</p>
                      <p>Le bénéfice imposable de la boulangerie est de <strong>0 €</strong> cette année ! Grâce à l'amortissement du four, l'entreprise ne dégage aucun profit fiscal.</p>
                      <p>Puisque le résultat est de 0 €, l'Impôt sur les Sociétés (IS) est de 0 €. Félicitations, tu viens de valider ton premier exercice comptable de A à Z !</p>
                      <p><em>Pour terminer le jeu et valider définitivement ton diplôme de Praticien, passe une ligne de 0 € au Débit du compte 695 (Impôts sur les bénéfices) ou clique directement sur Enregistrer.</em></p>`,
        accounts: { "695": "695 - Impôts sur les bénéfices" },
        validate: (balances) => {
            return true; // Étape finale, validation automatique pour célébrer la fin
        }
    }
};
