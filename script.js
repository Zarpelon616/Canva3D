// Configuração básica do Three.js
const canvas = document.getElementById('viewport');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);


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

// Adicionar os eixos cartesianos à cena
const axesHelper = new THREE.AxesHelper(50); // Tamanho dos eixos (10 unidades)
scene.add(axesHelper);


// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

// Adiciona luz à cena
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiente
scene.add(ambientLight);

// Lista para armazenar objetos adicionados
let objects = [];


// Renderização inicial
updateViewport();

// Configuração da câmera
camera.position.set(2, 1, 10);

// Controles orbitais
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Função de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

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

function createRandomPolygon() {
    // Gerar um número mínimo de 8 pontos aleatórios
    const numPoints = 8;
    const points = [];

    // Gerar pontos aleatórios dentro de um intervalo para x, y, z
    for (let i = 0; i < numPoints; i++) {
        const x = Math.random() * 10 - 5;  // Coordenada x aleatória entre -5 e 5
        const y = Math.random() * 10 - 5;  // Coordenada y aleatória entre -5 e 5
        const z = Math.random() * 10 - 5;  // Coordenada z aleatória entre -5 e 5
        points.push(new THREE.Vector3(x, y, z));
    }

    // Criar geometria do polígono a partir dos pontos
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Criar material para o polígono (cor aleatória)
    const material = new THREE.LineBasicMaterial({ color: Math.random() * 0xffffff });

    // Criar o objeto de linha (polígono)
    const polygon = new THREE.LineLoop(geometry, material);  // LineLoop cria uma forma fechada

    // Adicionar o polígono à cena
    scene.add(polygon);

    // Atualizar a lista de objetos
    const name = "Polígono Aleatório";
    objects.push({ name, object: polygon });

    // Atualizar a tabela com o novo polígono
    updateTable(name, polygon);

    // Atualizar o viewport
    updateViewport();
}

createRandomPolygon();  // Chama a função para criar o polígono aleatório

animate();

class Matrix {
    constructor() {
        // Inicializando a matriz identidade 4x4
        this.matrix = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    // Multiplicar esta matriz por outra matriz
    multiply(otherMatrix) {
        let result = new Matrix();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result.matrix[i][j] = 0;
                for (let k = 0; k < 4; k++) {
                    result.matrix[i][j] += this.matrix[i][k] * otherMatrix.matrix[k][j];
                }
            }
        }
        return result;
    }

    // Função para realizar a translação
    translate(tx, ty, tz) {
        let translationMatrix = new Matrix();
        translationMatrix.matrix = [
            [1, 0, 0, tx],
            [0, 1, 0, ty],
            [0, 0, 1, tz],
            [0, 0, 0, 1]
        ];
        this.matrix = this.multiply(translationMatrix).matrix;
    }

    // Função para realizar a rotação em torno do eixo X
    rotateX(angle) {
        let radians = angle * Math.PI / 180;
        let rotationMatrix = new Matrix();
        rotationMatrix.matrix = [
            [1, 0, 0, 0],
            [0, Math.cos(radians), -Math.sin(radians), 0],
            [0, Math.sin(radians), Math.cos(radians), 0],
            [0, 0, 0, 1]
        ];
        this.matrix = this.multiply(rotationMatrix).matrix;
    }

    // Função para realizar a rotação em torno do eixo Y
    rotateY(angle) {
        let radians = angle * Math.PI / 180;
        let rotationMatrix = new Matrix();
        rotationMatrix.matrix = [
            [Math.cos(radians), 0, Math.sin(radians), 0],
            [0, 1, 0, 0],
            [-Math.sin(radians), 0, Math.cos(radians), 0],
            [0, 0, 0, 1]
        ];
        this.matrix = this.multiply(rotationMatrix).matrix;
    }

    // Função para realizar a rotação em torno do eixo Z
    rotateZ(angle) {
        let radians = angle * Math.PI / 180;
        let rotationMatrix = new Matrix();
        rotationMatrix.matrix = [
            [Math.cos(radians), -Math.sin(radians), 0, 0],
            [Math.sin(radians), Math.cos(radians), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        this.matrix = this.multiply(rotationMatrix).matrix;
    }

    // Função para realizar o escalonamento
    scale(sx, sy, sz) {
        let scaleMatrix = new Matrix();
        scaleMatrix.matrix = [
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ];
        this.matrix = this.multiply(scaleMatrix).matrix;
    }

    // Função para aplicar a matriz de transformação a um vetor 3D
    applyToVector(x, y, z) {
        let vector = [x, y, z, 1];
        let result = [0, 0, 0, 0];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                result[i] += this.matrix[i][j] * vector[j];
            }
        }
        // Retorna o vetor transformado (x, y, z)
        return [result[0], result[1], result[2]];
    }
}

// Exemplo de uso

// Criar uma nova matriz
let mat = new Matrix();

// Translação de 2 unidades no eixo X, 3 no Y e 4 no Z
mat.translate(2, 3, 4);

// Rotação de 45 graus no eixo X
mat.rotateX(45);

// Escalonamento em 2x no eixo X, 3x no eixo Y e 1x no eixo Z
mat.scale(2, 3, 1);

// Aplicar a matriz de transformação a um vetor (1, 1, 1)
let transformedVector = mat.applyToVector(1, 1, 1);

console.log('Vetor transformado:', transformedVector);


// ** Funções de controle **

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



// Função para adicionar reta com coordenadas e nome personalizados
document.getElementById('add-line').addEventListener('click', () => {
    // Solicitar informações ao usuário
    const name = prompt("Digite o nome da reta:", "Reta");
    const x1 = parseFloat(prompt("Digite a coordenada X do ponto inicial:", "0"));
    const y1 = parseFloat(prompt("Digite a coordenada Y do ponto inicial:", "0"));
    const z1 = parseFloat(prompt("Digite a coordenada Z do ponto inicial:", "0"));
    const x2 = parseFloat(prompt("Digite a coordenada X do ponto final:", "1"));
    const y2 = parseFloat(prompt("Digite a coordenada Y do ponto final:", "1"));
    const z2 = parseFloat(prompt("Digite a coordenada Z do ponto final:", "1"));

    // Validar entradas do usuário
    if (
        !name ||
        isNaN(x1) || isNaN(y1) || isNaN(z1) ||
        isNaN(x2) || isNaN(y2) || isNaN(z2)
    ) {
        alert("Por favor, insira um nome válido e valores numéricos para as coordenadas.");
        return;
    }

    // Criar a reta
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // Cor verde para a reta
    const points = [
        new THREE.Vector3(x1, y1, z1),
        new THREE.Vector3(x2, y2, z2),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);

    // Adicionar a reta à cena
    scene.add(line);

    // Adicionar à lista de objetos
    objects.push({ name, object: line });

    // Atualizar a tabela com a nova reta
    updateTable(name, line);

    // Atualizar o viewport
    updateViewport();
});

// Adicionar Polilinha
document.getElementById('add-polyline').addEventListener('click', () => {
    // Solicitar pontos para a polilinha
    const pointsCount = parseInt(prompt("Quantos pontos a polilinha terá?", "2"));
    const points = [];

    for (let i = 0; i < pointsCount; i++) {
        const x = parseFloat(prompt(`Digite a coordenada X do ponto ${i + 1}:`, "0"));
        const y = parseFloat(prompt(`Digite a coordenada Y do ponto ${i + 1}:`, "0"));
        const z = parseFloat(prompt(`Digite a coordenada Z do ponto ${i + 1}:`, "0"));

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            alert("Coordenadas inválidas. Tente novamente.");
            return;
        }

        points.push(new THREE.Vector3(x, y, z));
    }

    // Criar material e geometria para a polilinha
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const polyline = new THREE.Line(geometry, material);

    // Definindo o tipo explicitamente para 'polyline'
    polyline.type = "polyline"; // Agora o tipo está explicitamente como "polyline"

    // Adicionar a polilinha à cena
    scene.add(polyline);

    // Registrar o objeto na lista de objetos
    objects.push({ name: 'Polilinha', object: polyline });

    // Atualizar a tabela de objetos
    updateTable('Polilinha', polyline);
});


// Adicionar Polígono 3D
document.getElementById('add-polygon').addEventListener('click', () => {
    // Solicitar o número mínimo de pontos (6)
    const pointsCount = parseInt(prompt("Digite o número de pontos do polígono (mínimo 6):", "6"));
    
    if (pointsCount < 6) {
        alert("O polígono precisa de pelo menos 6 pontos.");
        return;
    }

    const points = [];
    
    // Coletar coordenadas dos pontos
    for (let i = 0; i < pointsCount; i++) {
        const x = parseFloat(prompt(`Digite a coordenada X do ponto ${i + 1}:`, "0"));
        const y = parseFloat(prompt(`Digite a coordenada Y do ponto ${i + 1}:`, "0"));
        const z = parseFloat(prompt(`Digite a coordenada Z do ponto ${i + 1}:`, "0"));

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            alert("Coordenadas inválidas. Tente novamente.");
            return;
        }

        points.push(new THREE.Vector3(x, y, z));
    }

    // Criar a geometria e adicionar faces (triângulos)
    const geometry = new THREE.Geometry();

    // Adicionando os pontos na geometria
    geometry.vertices.push(...points);

    // Criar faces (aqui, vamos supor que formamos triângulos entre os pontos, você pode modificar para outros tipos)
    for (let i = 1; i < pointsCount - 1; i++) {
        geometry.faces.push(new THREE.Face3(0, i, i + 1));  // Criando triângulos entre o ponto 0 e os outros pontos
    }

    // Criando o material do polígono
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide });
    const polygon = new THREE.Mesh(geometry, material);
    polygon.type = "polygon"; // Garantir que o tipo seja atribuído

    // Adiciona o polígono à cena
    scene.add(polygon);

    // Adiciona o polígono à lista de objetos e atualiza a tabela
    objects.push({ name: 'Polígono', object: polygon });
    updateTable('Polígono', polygon);
});



// ** Funções secundaria **

// Função para mover o objeto selecionado
function moveSelectedObject() {
    if (!selectedObject) {
        alert("Nenhum objeto selecionado para mover.");
        return;
    }

    // Verifica o tipo do objeto e coleta as novas coordenadas
    if (selectedObject.isMesh) {
        // Para pontos (Mesh)
        const x = parseFloat(prompt("Digite a nova coordenada X:", selectedObject.position.x));
        const y = parseFloat(prompt("Digite a nova coordenada Y:", selectedObject.position.y));
        const z = parseFloat(prompt("Digite a nova coordenada Z:", selectedObject.position.z));

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            alert("Entradas inválidas! Certifique-se de fornecer valores numéricos.");
            return;
        }

        // Atualiza a posição do ponto
        selectedObject.position.set(x, y, z);
    } else if (selectedObject.isLine) {
        // Para retas e polilinhas (Line)
        const positions = selectedObject.geometry.attributes.position;
        const newPositions = [];

        for (let i = 0; i < positions.count; i++) {
            const x = parseFloat(prompt(`Digite a nova coordenada X do ponto ${i + 1}:`, positions.getX(i)));
            const y = parseFloat(prompt(`Digite a nova coordenada Y do ponto ${i + 1}:`, positions.getY(i)));
            const z = parseFloat(prompt(`Digite a nova coordenada Z do ponto ${i + 1}:`, positions.getZ(i)));

            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                alert("Entradas inválidas! Certifique-se de fornecer valores numéricos.");
                return;
            }

            newPositions.push(x, y, z);
        }

        // Atualiza os vértices da geometria
        for (let i = 0; i < positions.count; i++) {
            positions.setXYZ(i, newPositions[i * 3], newPositions[i * 3 + 1], newPositions[i * 3 + 2]);
        }
        positions.needsUpdate = true; // Marcar a geometria como atualizada
    } else if (selectedObject.isMesh && selectedObject.geometry.isShapeGeometry) {
        // Para polígonos
        const points = selectedObject.geometry.attributes.position;
        const newPoints = [];

        for (let i = 0; i < points.count; i++) {
            const x = parseFloat(prompt(`Digite a nova coordenada X do ponto ${i + 1}:`, points.getX(i)));
            const y = parseFloat(prompt(`Digite a nova coordenada Y do ponto ${i + 1}:`, points.getY(i)));
            const z = parseFloat(prompt(`Digite a nova coordenada Z do ponto ${i + 1}:`, points.getZ(i)));

            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                alert("Entradas inválidas! Certifique-se de fornecer valores numéricos.");
                return;
            }

            newPoints.push(new THREE.Vector3(x, y, z));
        }

        // Atualizar o polígono (recriando a geometria)
        const newShape = new THREE.Shape(newPoints.map(p => new THREE.Vector2(p.x, p.y)));
        const newGeometry = new THREE.ShapeGeometry(newShape);

        selectedObject.geometry.dispose(); // Descarta a geometria antiga
        selectedObject.geometry = newGeometry;
    } else {
        alert("Tipo de objeto não suportado para movimentação.");
        return;
    }

    // Atualizar a tabela (se necessário)
    const objectRow = Array.from(document.querySelectorAll('#object-table tbody tr')).find(
        row => row.cells[0].textContent === selectedObject.name
    );
    if (objectRow && selectedObject.position) {
        objectRow.cells[1].textContent = selectedObject.position.x.toFixed(2);
        objectRow.cells[2].textContent = selectedObject.position.y.toFixed(2);
        objectRow.cells[3].textContent = selectedObject.position.z.toFixed(2);
    }

    // Atualizar o viewport
    updateViewport();

    // Atualiza a tabela com as novas coordenadas
    updateTable(selectedObject.name, selectedObject);
}

// Botão para mover objeto
document.getElementById('move-object').addEventListener('click', moveSelectedObject);

// Função para transladar o objeto selecionado
function translateSelectedObject() {
    if (!selectedObject) {
        alert('Nenhum objeto selecionado!');
        return;
    }

    // Log para verificar qual objeto foi selecionado
    console.log("Objeto selecionado: ", selectedObject);

    // Solicitar as translações nos eixos X, Y e Z
    const tx = parseFloat(prompt("Digite a translação no eixo X:", "0"));
    const ty = parseFloat(prompt("Digite a translação no eixo Y:", "0"));
    const tz = parseFloat(prompt("Digite a translação no eixo Z:", "0"));

    // Validar entradas do usuário
    if (isNaN(tx) || isNaN(ty) || isNaN(tz)) {
        alert("Por favor, insira valores numéricos válidos para as translações.");
        return;
    }

    // Criar uma nova instância da classe Matrix para translação
    let matrix = new Matrix();
    matrix.translate(tx, ty, tz);

    // Ação de translação com base no tipo do objeto
    if (selectedObject.isMesh) {
        // Para objetos Mesh (como esferas, polígonos, etc.)
        selectedObject.position.add(new THREE.Vector3(tx, ty, tz));
        selectedObject.geometry.attributes.position.needsUpdate = true; // Para atualizar a geometria caso seja um polígono
    } else if (selectedObject.isLine) {
        // Para linhas: transladar os dois pontos finais
        const positions = selectedObject.geometry.attributes.position.array;
        const start = matrix.applyToVector(positions[0], positions[1], positions[2]);
        const end = matrix.applyToVector(positions[3], positions[4], positions[5]);

        // Atualizar a geometria da linha com as novas posições
        selectedObject.geometry.attributes.position.set([start[0], start[1], start[2], end[0], end[1], end[2]]);
        selectedObject.geometry.attributes.position.needsUpdate = true;
    } else if (selectedObject.isPolyline || selectedObject.isPolygon) {
        // Para polilinhas ou polígonos: transladar todos os vértices
        const positions = selectedObject.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const newVertex = matrix.applyToVector(positions[i], positions[i + 1], positions[i + 2]);
            positions[i] = newVertex[0];
            positions[i + 1] = newVertex[1];
            positions[i + 2] = newVertex[2];
        }

        // Marcar a geometria para atualização
        selectedObject.geometry.attributes.position.needsUpdate = true;
    } else {
        // Para objetos que não sejam reconhecidos
        console.warn('Tipo de objeto não reconhecido ou não manipulável!', selectedObject);
        return;
    }

    // Atualizar o viewport
    updateViewport();
    // Atualizar a tabela de objetos
    updateTable(selectedObject.name, selectedObject);
}

// Adicionar evento para transladar o objeto selecionado
document.getElementById('translate-object').addEventListener('click', translateSelectedObject);

document.getElementById('rotate-object').addEventListener('click', () => {
    const modal = document.getElementById('rotate-modal');
    modal.style.display = 'block'; // Exibe o modal de rotação

    // Mostrar ou esconder campos para ponto customizado
    document.getElementById('rotation-point').addEventListener('change', (e) => {
        const customPointInput = document.getElementById('custom-point-input');
        customPointInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
    });

    // Aplicar rotação ao clicar no botão
    document.getElementById('apply-rotation').addEventListener('click', () => {
        // Obter o ângulo, eixo e ponto de rotação
        const angle = parseFloat(document.getElementById('rotation-angle').value);
        const axis = document.getElementById('rotation-axis').value;
        const rotationPoint = document.getElementById('rotation-point').value;
    
        // Validar o ângulo
        if (isNaN(angle)) {
            alert('Por favor, insira um ângulo válido.');
            return;
        }
    
        // Determinar o eixo de rotação com base na seleção do modal
        const rotationAxis = 
            axis === 'x' ? new THREE.Vector3(1, 0, 0) :
            axis === 'y' ? new THREE.Vector3(0, 1, 0) :
            axis === 'z' ? new THREE.Vector3(0, 0, 1) :
            null;
    
        if (!rotationAxis) {
            alert('Seleção do eixo inválida.');
            return;
        }
    
        // Converter o ângulo de graus para radianos
        const radianAngle = THREE.MathUtils.degToRad(angle);
    
        // Criar matriz de transformação
        const matrix = new THREE.Matrix4();
    
        // Determinar o ponto de rotação
        let customPoint = new THREE.Vector3(
            parseFloat(document.getElementById('custom-point-x').value || 0),
            parseFloat(document.getElementById('custom-point-y').value || 0),
            parseFloat(document.getElementById('custom-point-z').value || 0)
        );
    
        if (selectedObject) {
            if (rotationPoint === 'center') {
                // Rotação em torno do centro do objeto
                if (selectedObject.geometry.boundingBox === null) {
                    selectedObject.geometry.computeBoundingBox(); // Garantir que o boundingBox seja calculado
                }
                const objectCenter = new THREE.Vector3();
                selectedObject.geometry.boundingBox.getCenter(objectCenter); // Calcula o centro do objeto
                matrix.makeTranslation(-objectCenter.x, -objectCenter.y, -objectCenter.z); // Translada para o centro
                matrix.multiply(new THREE.Matrix4().makeRotationAxis(rotationAxis, radianAngle)); // Aplica rotação
                matrix.multiply(new THREE.Matrix4().makeTranslation(objectCenter.x, objectCenter.y, objectCenter.z)); // Translada de volta
            } else if (rotationPoint === 'origin') {
                // Rotação em torno da origem
                matrix.makeRotationAxis(rotationAxis, radianAngle);
            } else if (rotationPoint === 'custom') {
                // Rotação em torno de um ponto customizado
                matrix.makeTranslation(-customPoint.x, -customPoint.y, -customPoint.z); // Translada para o ponto customizado
                matrix.multiply(new THREE.Matrix4().makeRotationAxis(rotationAxis, radianAngle)); // Aplica rotação
                matrix.multiply(new THREE.Matrix4().makeTranslation(customPoint.x, customPoint.y, customPoint.z)); // Translada de volta
            }

            // Aplica a rotação ao objeto selecionado
            selectedObject.applyMatrix4(matrix); // Aplica a matriz diretamente
            selectedObject.updateMatrixWorld(true); // Atualiza a matriz mundial do objeto
        }

        // Após a rotação, atualiza a tabela com as novas coordenadas
        updateTable(selectedObject.name, selectedObject);

    
        // Fechar o modal
        document.getElementById('rotate-modal').style.display = 'none';
    });
    
    // Fechar o modal ao clicar no botão de fechar
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
});



// Função de escalonamento em relação ao ponto de origem (primeiro ponto)
function scaleAroundOrigin(object, scaleX, scaleY, scaleZ) {
    // Obter as coordenadas do primeiro ponto (ponto de origem)
    const originPoint = object.geometry.attributes.position.array.slice(0, 3);  // Obtém as coordenadas do primeiro vértice (assumindo que a geometria é um objeto com atributo "position")

    // Criar uma matriz de translação que leva o objeto para a origem
    const translateToOrigin = new THREE.Matrix4();
    translateToOrigin.makeTranslation(-originPoint[0], -originPoint[1], -originPoint[2]);

    // Criar a matriz de escala
    const scaleMatrix = new THREE.Matrix4();
    scaleMatrix.makeScale(scaleX, scaleY, scaleZ);

    // Criar uma matriz de translação que leva o objeto de volta à sua posição original
    const translateBack = new THREE.Matrix4();
    translateBack.makeTranslation(originPoint[0], originPoint[1], originPoint[2]);

    // Aplicar a transformação: Transladar -> Escalonar -> Reverter a translação
    const finalMatrix = new THREE.Matrix4();
    finalMatrix.multiply(translateBack);  // Primeiro, voltar à posição original
    finalMatrix.multiply(scaleMatrix);   // Em seguida, aplicar a escala
    finalMatrix.multiply(translateToOrigin); // Finalmente, aplicar a translação para a origem

    object.applyMatrix4(finalMatrix);  // Aplica a matriz final no objeto
}

// Função de escalonamento em relação ao centro do objeto
function scaleAroundCenter(object, scaleX, scaleY, scaleZ) {
    const boundingBox = new THREE.Box3().setFromObject(object);  // Obtém a caixa delimitadora do objeto
    const center = boundingBox.getCenter(new THREE.Vector3());  // Calcula o centro da caixa

    // Criar a matriz de translação para levar o objeto ao centro
    const translateToCenter = new THREE.Matrix4();
    translateToCenter.makeTranslation(-center.x, -center.y, -center.z);

    // Criar a matriz de escala
    const scaleMatrix = new THREE.Matrix4();
    scaleMatrix.makeScale(scaleX, scaleY, scaleZ);

    // Criar a matriz de translação para voltar à posição original
    const translateBack = new THREE.Matrix4();
    translateBack.makeTranslation(center.x, center.y, center.z);

    // Aplicar a transformação: Transladar -> Escalonar -> Reverter a translação
    const finalMatrix = new THREE.Matrix4();
    finalMatrix.multiply(translateBack);  // Volta à posição original
    finalMatrix.multiply(scaleMatrix);   // Aplica a escala
    finalMatrix.multiply(translateToCenter);  // Aplica a translação para o centro

    object.applyMatrix4(finalMatrix);  // Aplica a matriz final no objeto
}

// Função para escalonar o objeto, perguntando se é em relação à origem ou centro
function scaleObject() {
    // Verificar se há um objeto selecionado
    if (!selectedObject) {
        alert('Nenhum objeto selecionado!');
        return;
    }

    // Obter a escolha do usuário (em relação à origem ou centro)
    const referencePoint = prompt("Selecione o ponto de referência para escalonamento: (1) Origem (primeiro ponto) ou (2) Centro");
    
    // Solicitar os valores de escala
    const scaleX = parseFloat(prompt("Digite o valor de escala para X:"));
    const scaleY = parseFloat(prompt("Digite o valor de escala para Y:"));
    const scaleZ = parseFloat(prompt("Digite o valor de escala para Z:"));

    // Validar os valores de escala
    if (isNaN(scaleX) || isNaN(scaleY) || isNaN(scaleZ)) {
        alert("Por favor, insira valores válidos para a escala.");
        return;
    }

    // Se o usuário escolher "Origem"
    if (referencePoint === '1') {
        scaleAroundOrigin(selectedObject, scaleX, scaleY, scaleZ);
    }
    // Se o usuário escolher "Centro"
    else if (referencePoint === '2') {
        scaleAroundCenter(selectedObject, scaleX, scaleY, scaleZ);
    }
    else {
        alert("Opção inválida! Selecione 1 para Origem ou 2 para Centro.");
    }

    // Atualizar o viewport após a transformação
    updateViewport();
}

// Adicionar evento para escalonamento
document.getElementById('scale-object').addEventListener('click', scaleObject);


// ** Funções auxiliares **

// Função para remover o objeto selecionado da tabela e da cena
// Associando os botões aos eventos de remoção no HTML
document.getElementById('remove-selected').addEventListener('click', () => {
    removeSelectedObject();
});

document.getElementById('remove-all').addEventListener('click', () => {
    removeAllObjects();
});

// Função para remover o objeto selecionado da tabela e da cena
function removeSelectedObject() {
    if (!selectedObject) {
        alert('Nenhum objeto selecionado!');
        return;
    }

    // Remover o objeto da cena
    scene.remove(selectedObject);

    // Remover o objeto do array de objetos
    const objectIndex = objects.findIndex(obj => obj.object === selectedObject);
    if (objectIndex !== -1) {
        objects.splice(objectIndex, 1);
    }

    // Atualizar a tabela
    updateTable();
    alert('Objeto removido com sucesso!');
}

// Função para remover todos os objetos da cena e da tabela
function removeAllObjects() {
    // Remover todos os objetos da cena
    objects.forEach(obj => {
        scene.remove(obj.object);
    });

    // Limpar o array de objetos
    objects.length = 0;

    // Atualizar a tabela
    updateTable();
    alert('Todos os objetos foram removidos!');
}

function updateTable(name, object) {
    const tableBody = document.querySelector('#object-table tbody');
    const rows = tableBody.querySelectorAll('tr');
    let row = null;
    

    // Verificar se já existe uma linha com o nome do objeto
     rows.forEach(r => {
        if (r.getAttribute('data-name') === name) {
            row = r;
        }
    });

    // Caso o objeto não exista, cria uma nova linha
    if (!row) {
        row = document.createElement('tr');
        row.setAttribute('data-name', name);  //Atribui o nome ao atributo 'data-name', Atribui o nome como atributo de dados para identificar a linha

        // Determinar tipo de objeto e coordenadas
        let objectType;
        let coordinates;

    if (object.isMesh && object.geometry.type === "SphereGeometry") {
        // Caso seja um ponto (esfera)
        objectType = "Ponto";
        coordinates = `(${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`;
    } else if (object.isLine && object.geometry.type === "BufferGeometry") {
        // Caso seja uma linha ou polilinha
        if (object.geometry.attributes.position.array.length === 6) {
            // Linha com 2 pontos
            objectType = "Reta";
            const positions = object.geometry.attributes.position.array;
            coordinates = `Início: (${positions[0].toFixed(2)}, ${positions[1].toFixed(2)}, ${positions[2].toFixed(2)})<br>
                           Fim: (${positions[3].toFixed(2)}, ${positions[4].toFixed(2)}, ${positions[5].toFixed(2)})`;
        } else if (object.geometry.attributes.position.array.length > 6) {
            // Polilinha (vários pontos)
            objectType = "Polilinha";
            const positions = object.geometry.attributes.position.array;
            const points = [];
            for (let i = 0; i < positions.length; i += 3) {
                points.push(`(${positions[i].toFixed(2)}, ${positions[i + 1].toFixed(2)}, ${positions[i + 2].toFixed(2)})`);
            }
            coordinates = points.join("<br>");
        }
    } else if (object.isMesh && object.geometry.type === "Geometry" && object.geometry instanceof THREE.ShapeGeometry) {
        // Caso seja um polígono (forma fechada)
        objectType = "Polígono";
        const points = object.geometry.vertices.map(v => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
        coordinates = points.join("<br>");
    } else {
        // Caso seja outro tipo de objeto
        objectType = "Desconhecido";
        coordinates = "Não aplicável";
    }

    // Criar linha na tabela com as informações
    row.innerHTML = `
        <td>${name}</td>
        <td>${objectType}</td>
        <td>${coordinates}</td>
        <td><button class="remove-btn" onclick="removeObjectFromTable('${name}')">Remover</button></td>
    `;
    tableBody.appendChild(row);
    } else {
        // Caso o objeto já exista na tabela, apenas atualiza as coordenadas
        let coordinates;

        if (object.isMesh && object.geometry.type === "SphereGeometry") {
            // Caso seja um ponto (esfera)
            coordinates = `(${object.position.x.toFixed(2)}, ${object.position.y.toFixed(2)}, ${object.position.z.toFixed(2)})`;
        } else if (object.isLine && object.geometry.type === "BufferGeometry") {
            // Caso seja uma linha ou polilinha
            const positions = object.geometry.attributes.position.array;
            if (positions.length === 6) {
                // Linha com 2 pontos
                coordinates = `Início: (${positions[0].toFixed(2)}, ${positions[1].toFixed(2)}, ${positions[2].toFixed(2)})<br>
                               Fim: (${positions[3].toFixed(2)}, ${positions[4].toFixed(2)}, ${positions[5].toFixed(2)})`;
            } else if (positions.length > 6) {
                // Polilinha (vários pontos)
                const points = [];
                for (let i = 0; i < positions.length; i += 3) {
                    points.push(`(${positions[i].toFixed(2)}, ${positions[i + 1].toFixed(2)}, ${positions[i + 2].toFixed(2)})`);
                }
                coordinates = points.join("<br>");
            }
        } else if (object.isMesh && object.geometry.type === "Geometry" && object.geometry instanceof THREE.ShapeGeometry) {
            // Caso seja um polígono (forma fechada)
            const points = object.geometry.vertices.map(v => `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`);
            coordinates = points.join("<br>");
        } else {
            // Caso seja outro tipo de objeto
            coordinates = "Não aplicável";
        }

        // Atualiza as coordenadas na tabela
        row.cells[2].innerHTML = coordinates;
    }
}

// Função para remover o objeto da tabela
function removeObjectFromTable(name) {
    const tableBody = document.querySelector('#object-table tbody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        if (row.getAttribute('data-name') === name) {
            // Remover a linha correspondente
            tableBody.removeChild(row);
        }
    });

    // Também precisamos remover o objeto da cena e do array de objetos
    removeObjectFromScene(name);
}

// Função para remover o objeto da cena e da tabela
function removeObjectFromScene(name) {
    // Encontre o objeto no array e remova-o da cena
    const index = objects.findIndex(obj => obj.name === name);
    if (index !== -1) {
        // Remover da cena
        scene.remove(objects[index].object);
        objects.splice(index, 1); // Remover do array de objetos
    }
}



// Função para atualizar o viewport (renderizar a cena novamente)
function updateViewport() {
    renderer.render(scene, camera);
}

// Ajusta a tela ao redimensionar
window.addEventListener('resize', () => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});
