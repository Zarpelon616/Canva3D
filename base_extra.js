// Configuração básica do Three.js
const canvas = document.getElementById('viewport');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

// Adiciona luz à cena
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiente
scene.add(ambientLight);

// Criação de um cubo
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Configuração da câmera
camera.position.z = 5;

// Controles orbitais
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Animação
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01; // Rotação contínua do cubo
    cube.rotation.y += 0.01;
    controls.update(); // Atualiza os controles
    renderer.render(scene, camera);
}

animate();

// Ajusta a tela ao redimensionar
window.addEventListener('resize', () => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

let selectedObject = null;  // Armazenar o objeto selecionado
let selectedRow = null;     // Armazenar a linha selecionada

// Adicionar evento de clique nas linhas da tabela
document.querySelector('#object-table tbody').addEventListener('click', (event) => {
    // Verificar se o clique foi em uma célula da tabela
    const row = event.target.closest('tr');
    if (row) {
        // Remover a classe de seleção da linha anteriormente selecionada
        if (selectedRow) {
            selectedRow.classList.remove('selected-row');
        }

        // Adicionar a classe de seleção na nova linha
        row.classList.add('selected-row');
        selectedRow = row; // Atualizar a linha selecionada

        // Encontrar o objeto correspondente
        const name = row.cells[0].textContent;
        selectedObject = objects.find(obj => obj.name === name)?.object;
        

    }
});

// Alternar exibição de todos os controles
document.getElementById('show-all-buttons').addEventListener('click', () => {
    const controls = document.getElementById('all-controls');
    if (controls.style.display === 'none' || controls.style.display === '') {
        controls.style.display = 'block'; // Mostra os controles
    } else {
        controls.style.display = 'none'; // Esconde os controles
    }
});

document.getElementById('show-table-button').addEventListener('click', () => {
    const controls = document.getElementById('table-container');
    if (controls.style.display === 'none' || controls.style.display === '') {
        controls.style.display = 'block'; // Mostra os controles
    } else {
        controls.style.display = 'none'; // Esconde os controles
    }
});

// Função para atualizar o viewport (renderizar a cena novamente)
function updateViewport() {
    renderer.render(scene, camera);
}

// Função para adicionar ponto com coordenadas, cor e nome personalizado
document.getElementById('add-point').addEventListener('click', () => {
    // Solicitar informações ao usuário
    const name = prompt("Digite o nome do ponto:", "Ponto");
    const x = parseFloat(prompt("Digite a coordenada X do ponto:", "0"));
    const y = parseFloat(prompt("Digite a coordenada Y do ponto:", "0"));
    const z = parseFloat(prompt("Digite a coordenada Z do ponto:", "0"));

    // Validar entradas do usuário
    if (!name || isNaN(x) || isNaN(y) || isNaN(z)) {
        alert("Por favor, insira um nome válido e valores numéricos para as coordenadas.");
        return;
    }

    // Criar o ponto como uma esfera
    const geometry = new THREE.SphereGeometry(0.1, 16, 16); // Esfera como ponto
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Cor vermelha
    const point = new THREE.Mesh(geometry, material);

    // Definir as coordenadas fornecidas
    point.position.set(x, y, z);

    // Adicionar o ponto à cena
    scene.add(point);

    // Adicionar à lista de objetos
    objects.push({ name, object: point });

    // Atualizar a tabela com o novo ponto
    updateTable(name, point);

    // Atualizar o viewport
    updateViewport();
});