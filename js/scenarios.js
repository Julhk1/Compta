const scenarios = {
    1: {
        title: "Étape 1 : Le Financement de base",
        description: `<p>Pierre ouvre sa boulangerie. Il dépose <strong>20 000 €</strong> de capital social et reçoit son prêt bancaire de <strong>30 000 €</strong>.</p>
                      <p><em>Écritures attendues :</em><br>
                      • Débit : 512 - Banque (50 000 €)<br>
                      • Crédit : 101 - Capital Social (20 000 €)<br>
                      • Crédit : 164 - Emprunts (30 000 €)</p>`,
        accounts: { "512": "512 - Banque", "101": "101 - Capital Social", "164": "164 - Emprunts" },
        expectedEntries: {
            "512": { debit: 50000 },
            "101": { credit: 20000 },
            "164": { credit: 30000 }
        }
    },
    2: {
        title: "Étape 2 : L'Investissement du matériel",
        description: `<p>Pierre achète un four professionnel d'une valeur de <strong>15 000 € HT</strong> par chèque de banque.</p>
                      <p><em>Écritures attendues :</em><br>
                      • Débit : 215 - Matériel Industriel (15 000 €)<br>
                      • Crédit : 512 - Banque (15 000 €)</p>`,
        accounts: { "215": "215 - Matériel Industriel", "512": "512 - Banque" },
        expectedEntries: {
            "215": { debit: 15000 },
            "512": { credit: 15000 }
        }
    },
    3: {
        title: "Étape 3 : Premier mois d'activité & TVA",
        description: `<p>Le premier mois est terminé. Passons les écritures d'exploitation avec les contreparties réelles :</p>
                      <p><strong>1. Ventes de pain (au comptant par banque) :</strong> 4 220 € TTC.<br>
                      • Crédit : 701 - Ventes de pain (4 000 € HT)<br>
                      • Crédit : 44571 - TVA Collectée (220 €)<br>
                      • Débit : 512 - Banque (4 220 €)</p>
                      <p><strong>2. Achats de farine (à crédit chez le fournisseur) :</strong> 1 055 € TTC.<br>
                      • Débit : 601 - Achats Farine (1 000 € HT)<br>
                      • Débit : 44566 - TVA Déductible (55 €)<br>
                      • Crédit : 401 - Fournisseurs (1 055 €)</p>`,
        accounts: { 
            "512": "512 - Banque", 
            "401": "401 - Fournisseurs", 
            "601": "601 - Achats Farine", 
            "701": "701 - Ventes de pain", 
            "44571": "44571 - TVA Collectée", 
            "44566": "44566 - TVA Déductible" 
        },
        expectedEntries: {
            "701": { credit: 4000 },
            "44571": { credit: 220 },
            "512": { debit: 4220 },
            "601": { debit: 1000 },
            "44566": { debit: 55 },
            "401": { credit: 1055 }
        }
    },
    4: {
        title: "Étape 4 : Déclaration de TVA",
        description: `<p>C'est l'heure de la déclaration. Solde tes comptes de TVA du mois pour constater ta dette envers l'État.</p>
                      <p><em>Écritures attendues :</em><br>
                      • Débit : 44571 - TVA Collectée (220 €) -> pour vider le compte<br>
                      • Crédit : 44566 - TVA Déductible (55 €) -> pour vider le compte<br>
                      • Crédit : 44551 - TVA à payer (165 €)</p>`,
        accounts: { "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible", "44551": "44551 - TVA à payer" },
        expectedEntries: {
            "44571": { debit: 220 },
            "44566": { credit: 55 },
            "44551": { credit: 165 }
        }
    },
    5: {
        title: "Étape 5 : Amortissement de fin d'année",
        description: `<p>Constate l'usure annuelle du four linéaire acheté 15 000 € sur 5 ans (15 000 € / 5 = <strong>3 000 €</strong>).</p>
                      <p><em>Écritures attendues :</em><br>
                      • Débit : 6811 - Dotation aux Amortissements (3 000 €)<br>
                      • Crédit : 2815 - Amortissement Matériel (3 000 €)</p>`,
        accounts: { "6811": "6811 - Dotation aux Amortissements", "2815": "2815 - Amortissement Matériel" },
        expectedEntries: {
            "6811": { debit: 3000 },
            "2815": { credit: 3000 }
        }
    },
    6: {
        title: "Étape 6 : Clôture & Résultat Fiscal",
        description: `<p>Le bénéfice de l'exercice avant impôt est à 0 € (4 000 € de ventes - 4 000 € de charges totales). L'Impôt sur les Sociétés (IS) est donc égal à 0 €.</p>
                      <p><em>Pour boucler définitivement la comptabilité, valide l'impôt à zéro :</em><br>
                      • Débit : 695 - Impôts sur les bénéfices (0 €)</p>`,
        accounts: { "695": "695 - Impôts sur les bénéfices" },
        expectedEntries: {
            "695": { debit: 0 }
        }
    }
};
