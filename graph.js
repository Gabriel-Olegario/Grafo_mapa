class Vertex {
    constructor(label, distanceToObjective) {
        this.label = label;
        this.visited = false;
        this.distanceToObjective = distanceToObjective;
        this.adjacents = [];
        this.x = 0; // Will be set by visualization
        this.y = 0; // Will be set by visualization
    }

    addAdjacent(vertex, cost) {
        this.adjacents.push({ vertex, cost });
    }
}

class Graph {
    constructor() {
        // Create vertices
        this.arad = new Vertex('Arad', 366);
        this.zerind = new Vertex('Zerind', 374);
        this.oradea = new Vertex('Oradea', 380);
        this.sibiu = new Vertex('Sibiu', 253);
        this.timisoara = new Vertex('Timisoara', 329);
        this.lugoj = new Vertex('Lugoj', 244);
        this.mehadia = new Vertex('Mehadia', 241);
        this.dobreta = new Vertex('Dobreta', 242);
        this.craiova = new Vertex('Craiova', 160);
        this.rimnicu = new Vertex('Rimnicu', 193);
        this.fagaras = new Vertex('Fagaras', 178);
        this.pitesti = new Vertex('Pitesti', 98);
        this.bucharest = new Vertex('Bucharest', 0);
        this.giurgiu = new Vertex('Giurgiu', 77);
        // Novas cidades
        this.urziceni = new Vertex('Urziceni', 80);
        this.hirsova = new Vertex('Hirsova', 151);
        this.eforie = new Vertex('Eforie', 161);
        this.vaslui = new Vertex('Vaslui', 199);
        this.iasi = new Vertex('Iasi', 226);
        this.neamt = new Vertex('Neamt', 234);

        // Add edges
        this.arad.addAdjacent(this.zerind, 75);
        this.arad.addAdjacent(this.sibiu, 140);
        this.arad.addAdjacent(this.timisoara, 118);

        this.zerind.addAdjacent(this.arad, 75);
        this.zerind.addAdjacent(this.oradea, 71);

        this.oradea.addAdjacent(this.zerind, 71);
        this.oradea.addAdjacent(this.sibiu, 151);

        this.sibiu.addAdjacent(this.oradea, 151);
        this.sibiu.addAdjacent(this.arad, 140);
        this.sibiu.addAdjacent(this.fagaras, 99);
        this.sibiu.addAdjacent(this.rimnicu, 80);

        this.timisoara.addAdjacent(this.arad, 118);
        this.timisoara.addAdjacent(this.lugoj, 111);

        this.lugoj.addAdjacent(this.timisoara, 111);
        this.lugoj.addAdjacent(this.mehadia, 70);

        this.mehadia.addAdjacent(this.lugoj, 70);
        this.mehadia.addAdjacent(this.dobreta, 75);

        this.dobreta.addAdjacent(this.mehadia, 75);
        this.dobreta.addAdjacent(this.craiova, 120);

        this.craiova.addAdjacent(this.dobreta, 120);
        this.craiova.addAdjacent(this.pitesti, 138);
        this.craiova.addAdjacent(this.rimnicu, 146);

        this.rimnicu.addAdjacent(this.craiova, 146);
        this.rimnicu.addAdjacent(this.sibiu, 80);
        this.rimnicu.addAdjacent(this.pitesti, 97);

        this.fagaras.addAdjacent(this.sibiu, 99);
        this.fagaras.addAdjacent(this.bucharest, 211);

        this.pitesti.addAdjacent(this.rimnicu, 97);
        this.pitesti.addAdjacent(this.craiova, 138);
        this.pitesti.addAdjacent(this.bucharest, 101);

        this.bucharest.addAdjacent(this.fagaras, 211);
        this.bucharest.addAdjacent(this.pitesti, 101);
        this.bucharest.addAdjacent(this.giurgiu, 90);
        this.bucharest.addAdjacent(this.urziceni, 85);

        this.giurgiu.addAdjacent(this.bucharest, 90);

        // Novas conexões
        this.urziceni.addAdjacent(this.bucharest, 85);
        this.urziceni.addAdjacent(this.hirsova, 98);
        this.urziceni.addAdjacent(this.vaslui, 142);

        this.hirsova.addAdjacent(this.urziceni, 98);
        this.hirsova.addAdjacent(this.eforie, 86);

        this.eforie.addAdjacent(this.hirsova, 86);

        this.vaslui.addAdjacent(this.urziceni, 142);
        this.vaslui.addAdjacent(this.iasi, 92);

        this.iasi.addAdjacent(this.vaslui, 92);
        this.iasi.addAdjacent(this.neamt, 87);

        this.neamt.addAdjacent(this.iasi, 87);

        // Get all vertices for easier access
        this.vertices = [
            this.arad, this.zerind, this.oradea, this.sibiu,
            this.timisoara, this.lugoj, this.mehadia, this.dobreta,
            this.craiova, this.rimnicu, this.fagaras, this.pitesti,
            this.bucharest, this.giurgiu,
            this.urziceni, this.hirsova, this.eforie, this.vaslui, this.iasi, this.neamt
        ];
    }
} 