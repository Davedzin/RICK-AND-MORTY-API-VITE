import React, { useRef } from 'react';
import './App.css';

function App() {
  const URL = "https://rickandmortyapi.com/api/character";
  const charactersContainerRef = useRef(null);
  const characterDetailRef = useRef(null);
  const searchInputRef = useRef(null);
  const currentPageRef = useRef(1);
  const maxPagesRef = useRef(1);
  const currentCharacterIndexRef = useRef(0);

  async function chamarApi(page = 1, query = "") {
    let apiURL = `${URL}?page=${page}`;
    if (query) {
      apiURL += `&name=${query}`;
    }

    const resp = await fetch(apiURL);
    if (resp.status === 200) {
      const data = await resp.json();
      maxPagesRef.current = data.info.pages;
      renderCharacters(data.results);
    }
  }

  function renderCharacters(characters) {
    charactersContainerRef.current.innerHTML = '';
    characters.forEach((character, index) => {
      const characterElement = document.createElement('div');
      characterElement.className = 'character';
      characterElement.textContent = character.name;
      characterElement.onclick = () => showCharacterDetail(character, index);
      charactersContainerRef.current.appendChild(characterElement);
    });
    // Inicializa o detalhe do primeiro personagem
    if (characters.length > 0) {
      showCharacterDetail(characters[0], 0);
    }
  }

  function showCharacterDetail(character, index) {
    characterDetailRef.current.innerHTML = `
      <h2>${character.name}</h2>
      <img src="${character.image}" alt="${character.name}" />
      <p>Status: ${character.status}</p>
      <p>Espécie: ${character.species}</p>
      <p>Gênero: ${character.gender}</p>
      <p>Origem: ${character.origin.name}</p>
      <p>Localização: ${location.name}</p>
      <p>Criada: ${character.created}</p>
    `;
    currentCharacterIndexRef.current = index;
  }

  function handleNextPage() {
    if (currentPageRef.current < maxPagesRef.current) {
      currentPageRef.current += 1;
      chamarApi(currentPageRef.current, searchInputRef.current.value);
    }
  }

  function handlePreviousPage() {
    if (currentPageRef.current > 1) {
      currentPageRef.current -= 1;
      chamarApi(currentPageRef.current, searchInputRef.current.value);
    }
  }

  function handleNextCharacter() {
    const characters = charactersContainerRef.current.children;
    if (currentCharacterIndexRef.current < characters.length - 1) {
      const nextIndex = currentCharacterIndexRef.current + 1;
      characters[nextIndex].click();
    }
  }

  function handlePreviousCharacter() {
    const characters = charactersContainerRef.current.children;
    if (currentCharacterIndexRef.current > 0) {
      const prevIndex = currentCharacterIndexRef.current - 1;
      characters[prevIndex].click();
    }
  }

  function handleSearch(event) {
    event.preventDefault();
    currentPageRef.current = 1; 
    chamarApi(1, searchInputRef.current.value);
  }

  chamarApi();

  return (
    <div className='bg-dark text-white container mt-4' >
      <h1 className="text-center mb-4" >Personagens de Rick and Morty</h1>
      
      <div className="row mb-3">
        <button onClick={handlePreviousPage}>Pagina Anterior</button>
        <button onClick={handleNextPage}>Próxima Pagina</button>
      </div>
      

      <div className="">
        <form onSubmit={handleSearch}>
          <input type="text" ref={searchInputRef} placeholder="Buscar personagem" />
          <button type="submit">Buscar</button>
        </form>
      </div>
      
    <div class="d-flex bd-highlight">

      <div className=" p-2 flex-grow-1 bd-highlight">
        <div className="">
          <div className="character-detail">
            <div ref={characterDetailRef} className="character-detail card-body"></div>
          </div>
       </div>
      </div>
      <div class="p-2 flex-grow-1 bd-highlight" ref={charactersContainerRef}>Carregando dados...</div>
    
    </div>
      
      
      <div>
        <button onClick={handlePreviousCharacter}>Anterior Personagem</button>
        <button onClick={handleNextCharacter}>Próximo Personagem</button>
      </div>
    </div>
  );
}

export default App;
