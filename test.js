// Traduzioni
const traduzioni = {
    it: {
        titolo: '💰 BudgetWise ITALIANO',
        testo: 'Questo è un testo di prova in italiano',
        pulsante: 'Cliccami IT'
    },
    en: {
        titolo: '💰 BudgetWise ENGLISH',
        testo: 'This is a test text in English',
        pulsante: 'Click me EN'
    }
};

// Variabile lingua
let linguaCorrente = 'it';

// Funzione per aggiornare la pagina
function aggiornaLingua() {
    document.getElementById('titolo').textContent = traduzioni[linguaCorrente].titolo;
    document.getElementById('testo').textContent = traduzioni[linguaCorrente].testo;
    document.getElementById('pulsante').textContent = traduzioni[linguaCorrente].pulsante;
    
    console.log('Lingua cambiata a:', linguaCorrente);
}

// Event listener per il select
document.getElementById('lingua').addEventListener('change', function(e) {
    linguaCorrente = e.target.value;
    aggiornaLingua();
});

// Avvio
aggiornaLingua();
console.log('Test avviato');