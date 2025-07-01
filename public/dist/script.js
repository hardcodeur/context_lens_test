
const btnSub = document.querySelector('#btnSearch');
const inputSearch = document.querySelector('input[name=search]');
const graphComponent = document.querySelector('#graphComponent');

btnSub.addEventListener("click", async () => {
    graphComponent.style.display = "none";
    try {
        const query = inputSearch.value;
        const apiUri = encodeURI(`/api/graph?q=${query}`);
        
        const response = await fetch(apiUri);
        if (!response.ok) {
            throw new Error(`Erreur ${response.status}`);
        }
        
        const data = await response.json();
        graphComponent.style.display = "block";
        updateGraph(data);

    } catch (error) {
        console.error('Erreur:', error);
    }
});

function updateGraph(graphData) {
    const graphElement = document.querySelector('#graphComponent');
    graphElement.setAttribute('data-graphe', JSON.stringify(graphData));
}