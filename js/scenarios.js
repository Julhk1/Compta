const scenarios = {
    1: {
        title: "Étape 1 : Le Financement de base",
        description: `<p>Pierre ouvre sa boulangerie. Il dépose <strong>20 000 €</strong> de capital social et reçoit son prêt bancaire de <strong>30 000 €</strong>.</p>`,
        accounts: { "512": "512 - Banque", "101": "101 - Capital Social", "164": "164 - Emprunts" },
        expectedEntries: {
            "512": { debit: 50000 },
            "101": { credit: 20000 },
            "164": { credit: 30000 }
        }
    },
    2: {
        title: "Étape 2 : L'Investissement du matériel",
        description: `<p>Pierre achète un four professionnel d'une valeur de <strong>15 000 € HT</strong> (payé par virement bancaire).</p>`,
        accounts: { "512": "512 - Banque", "215": "215 - Matériel Industriel" },
        expectedEntries: {
            "215": { debit: 15000 },
            "512": { credit: 15000 }
        }
    },
    3: {
        title: "Étape 3 : Premier mois d'activité & TVA",
        description: `<p>Ventes de pain : <strong>4 220 € TTC</strong> (4 000 € HT + 220 € TVA Collectée).<br>
                      Achats farine : <strong>1 055 € TTC</strong> (1 000 € HT + 55 € TVA Déductible).</p>`,
        accounts: { "601": "601 - Achats Farine", "701": "701 - Ventes de pain", "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible" },
        expectedEntries: {
            "701": { credit: 4000 },
            "44571": { credit: 220 },
            "601": { debit: 1000 },
            "44566": { debit: 55 }
        }
    },
    4: {
        title: "Étape 4 : Déclaration de TVA",
        description: `<p>Télétransmission de la TVA : solde la TVA collectée (220 €) et la TVA déductible (55 €) pour constater ta dette fiscale (165 €).</p>`,
        accounts: { "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible", "44551": "44551 - TVA à payer" },
        expectedEntries: {
            "44571": { debit: 220 },
            "44566": { credit: 55 },
            "44551": { credit: 165 }
        }
    },
    5: {
        title: "Étape 5 : Amortissement de fin d'année",
        description: `<p>Constate l'usure annuelle du four linéaire sur 5 ans (15 000 € / 5 = <strong>3 000 €</strong>).</p>`,
        accounts: { "6811": "6811 - Dotation aux Amortissements", "2815": "2815 - Amortissement Matériel" },
        expectedEntries: {
            "6811": { debit: 3000 },
            "2815": { credit: 3000 }
        }
    },
    6: {
        title: "Étape 6 : Clôture & Résultat Fiscal",
        description: `<p>Le bénéfice est à 0 € (4 000 € de ventes - 4 000 € de charges). L'Impôt sur les Sociétés est donc de 0 €.</p>`,
        accounts: { "695": "695 - Impôts sur les bénéfices" },
        expectedEntries: {
            "695": { debit: 0 }
        }
    }
};
