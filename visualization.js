class GraphVisualization {
    constructor() {
        this.canvas = document.getElementById('mapCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.graph = new Graph();
        this.nodeRadius = 10;
        this.animationSpeed = 1000; // ms
        this.currentPath = [];
        this.isAnimating = false;

        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Initialize positions
        this.initializePositions();

        // Populate selects
        this.populateSelects();

        // Add event listeners
        document.getElementById('startSearch').addEventListener('click', () => this.startGreedySearch());

        // Initial draw
        this.draw();
    }

    populateSelects() {
        const originSelect = document.getElementById('originSelect');
        const destSelect = document.getElementById('destSelect');
        originSelect.innerHTML = '';
        destSelect.innerHTML = '';
        this.graph.vertices.forEach(v => {
            const opt1 = document.createElement('option');
            opt1.value = v.label;
            opt1.textContent = v.label;
            originSelect.appendChild(opt1);
            const opt2 = document.createElement('option');
            opt2.value = v.label;
            opt2.textContent = v.label;
            destSelect.appendChild(opt2);
        });
        // Defaults
        originSelect.value = 'Arad';
        destSelect.value = 'Bucharest';
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.draw();
    }

    initializePositions() {
        // Coordenadas fixas ajustadas para um canvas de 1200x600
        const positions = {
            'Arad':        { x: 150,  y: 130 },
            'Zerind':      { x: 180,  y: 70  },
            'Oradea':      { x: 250,  y: 40  },
            'Sibiu':       { x: 340,  y: 130 },
            'Timisoara':   { x: 120,  y: 210 },
            'Lugoj':       { x: 180,  y: 270 },
            'Mehadia':     { x: 210,  y: 340 },
            'Dobreta':     { x: 250,  y: 390 },
            'Craiova':     { x: 340,  y: 440 },
            'Rimnicu':     { x: 430,  y: 160 },
            'Fagaras':     { x: 530,  y: 70  },
            'Pitesti':     { x: 530,  y: 270 },
            'Bucharest':   { x: 700,  y: 340 },
            'Giurgiu':     { x: 770,  y: 440 },
            // Novas cidades
            'Urziceni':    { x: 800,  y: 270 },
            'Hirsova':     { x: 950,  y: 200 },
            'Eforie':      { x: 1050, y: 220 },
            'Vaslui':      { x: 950,  y: 120 },
            'Iasi':        { x: 1020, y: 70  },
            'Neamt':       { x: 1100, y: 40  }
        };

        this.graph.vertices.forEach(vertex => {
            const pos = positions[vertex.label];
            if (pos) {
                vertex.x = pos.x;
                vertex.y = pos.y;
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenhar as arestas (estradas)
        this.graph.vertices.forEach(vertex => {
            vertex.adjacents.forEach(adj => {
                // Desenhar a linha
                this.ctx.beginPath();
                this.ctx.moveTo(vertex.x, vertex.y);
                this.ctx.lineTo(adj.vertex.x, adj.vertex.y);
                this.ctx.strokeStyle = '#666';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();

                // Desenhar a distância apenas uma vez por aresta
                if (vertex.label < adj.vertex.label) {
                    // Calcular o ponto médio da linha
                    const midX = (vertex.x + adj.vertex.x) / 2;
                    const midY = (vertex.y + adj.vertex.y) / 2;

                    // Calcular o ângulo da linha
                    const angle = Math.atan2(adj.vertex.y - vertex.y, adj.vertex.x - vertex.x);
                    
                    // Calcular o deslocamento perpendicular para o texto
                    const offset = 25;
                    const textX = midX - Math.sin(angle) * offset;
                    const textY = midY + Math.cos(angle) * offset;

                    // Desenhar o fundo do texto para melhor legibilidade
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    this.ctx.font = '16px Arial';
                    const text = adj.cost.toString();
                    const textWidth = this.ctx.measureText(text).width;
                    this.ctx.fillRect(textX - textWidth/2 - 2, textY - 12, textWidth + 4, 20);

                    // Desenhar a distância
                    this.ctx.fillStyle = '#666';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(text, textX, textY);
                }
            });
        });

        // Desenhar os vértices (cidades) como quadrados
        this.graph.vertices.forEach(vertex => {
            // Desenhar quadrado da cidade
            const size = this.nodeRadius * 2;
            this.ctx.beginPath();
            this.ctx.rect(vertex.x - this.nodeRadius, vertex.y - this.nodeRadius, size, size);
            this.ctx.fillStyle = vertex.visited ? '#4CAF50' : '#1a73e8';
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();

            // Desenhar nome da cidade à direita do quadrado
            this.ctx.fillStyle = '#222';
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(vertex.label, vertex.x + this.nodeRadius + 8, vertex.y);
        });

        // Desenhar o caminho atual
        if (this.currentPath.length > 1) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentPath[0].x, this.currentPath[0].y);
            for (let i = 1; i < this.currentPath.length; i++) {
                this.ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
            }
            this.ctx.strokeStyle = '#4CAF50';
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        }
    }

    updateHeuristics(goal) {
        // BFS para calcular a menor quantidade de arestas de cada cidade até o destino
        // (poderia ser melhor com distâncias reais, mas já melhora a busca gulosa)
        this.graph.vertices.forEach(v => v.distanceToObjective = Infinity);
        goal.distanceToObjective = 0;
        const queue = [goal];
        while (queue.length > 0) {
            const current = queue.shift();
            current.adjacents.forEach(adj => {
                if (adj.vertex.distanceToObjective > current.distanceToObjective + 1) {
                    adj.vertex.distanceToObjective = current.distanceToObjective + 1;
                    queue.push(adj.vertex);
                }
            });
        }
    }

    async startGreedySearch() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // Reset graph
        this.graph.vertices.forEach(v => v.visited = false);
        this.currentPath = [];
        this.draw();

        // Pega origem e destino dos selects
        const originLabel = document.getElementById('originSelect').value;
        const destLabel = document.getElementById('destSelect').value;
        const start = this.graph.vertices.find(v => v.label === originLabel);
        const goal = this.graph.vertices.find(v => v.label === destLabel);
        if (!start || !goal) return;

        // Atualiza heurística para o destino escolhido
        this.updateHeuristics(goal);

        // Busca gulosa com vetor ordenado (em JS)
        let current = start;
        this.currentPath = [current];
        let found = false;
        let explanationSteps = [];
        while (!found) {
            current.visited = true;
            this.draw();
            if (current === goal) {
                found = true;
                break;
            }
            // Vetor ordenado dos adjacentes não visitados
            const adjacentesNaoVisitados = current.adjacents
                .filter(adj => !adj.vertex.visited)
                .map(adj => adj.vertex);
            const sortedAdj = [...adjacentesNaoVisitados].sort((a, b) => a.distanceToObjective - b.distanceToObjective);
            if (adjacentesNaoVisitados.length === 0) break;
            // Explicação do passo
            let stepExp = `<b>Na cidade <span style='color:#1a73e8'>${current.label}</span>:</b> `;
            stepExp += `Candidatas: ` + sortedAdj.map(v => `${v.label} (h=${v.distanceToObjective})`).join(', ');
            stepExp += `. Escolhida: <span style='color:#4CAF50'>${sortedAdj[0].label}</span> (menor heurística).`;
            explanationSteps.push(stepExp);
            current = sortedAdj[0];
            this.currentPath.push(current);
            document.getElementById('pathInfo').textContent =
                `Caminho atual: ${this.currentPath.map(v => v.label).join(' → ')}`;
            await new Promise(resolve => setTimeout(resolve, this.animationSpeed));
        }
        this.isAnimating = false;
        if (this.currentPath[this.currentPath.length - 1] !== goal) {
            document.getElementById('pathInfo').textContent = 'Caminho não encontrado.';
            document.getElementById('explanation').innerHTML = '';
        } else {
            document.getElementById('pathInfo').textContent =
                `Caminho final: ${this.currentPath.map(v => v.label).join(' → ')}`;
            document.getElementById('explanation').innerHTML =
                `<b>Explicação passo a passo:</b><br>` + explanationSteps.join('<br>');
        }
    }
}

// Initialize visualization when the page loads
window.addEventListener('load', () => {
    new GraphVisualization();
}); 