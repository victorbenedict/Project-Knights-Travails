const cl = console.log
const ct = console.table

class Graph {
  constructor() {
    this.moveList = new Map()
    this.generatePaths()
  }

  // vertex is the coordinates of each squares
  // each vertex has an array of adjacent squares or the next possible positions of the knight piece
  // invoke this function to generatePaths
  addVertex(vertex) {
    if(!this.moveList.has(vertex)){
      this.moveList.set(vertex, [])
    }
  }

  // adding edges to each vertices
  // invoke this function to addAllEdges
  addEdge(vertexA, vertexB) {
    if (this.moveList.has(vertexA) && this.moveList.has(vertexB)) {
      this.moveList.get(vertexA).push(vertexB)
      this.moveList.get(vertexB).push(vertexA)
    }
  }

  // generate all the possible moves for each position/vertices
  // filter all the off board moves
  // filter all duplicate edges
  // invoke this function to generatePaths
  addAllEdges(position) {
    const vertexA = position.join('')
    const isOffBoard = (x, y) => {
      return x < 0 || y < 0 || x > 7 || y > 7
    }
  
    if (isOffBoard(position[0], position[1])) {
      return null
    }
  
    const knightMoves = [
      [-2, -1], [-2, +1], [-1, -2], [-1, +2],
      [+1, -2], [+1, +2], [+2, -1], [+2, +1],
    ]
    const existingNeighbors = this.moveList.get(vertexA)
  
    knightMoves.forEach(move => {
      const nextX = position[0] + move[0]
      const nextY = position[1] + move[1]
      if (!isOffBoard(nextX, nextY)) {
        const vertexB = [nextX,nextY].join('')
        if (!existingNeighbors.includes(vertexB)) {
          this.addEdge(vertexA, vertexB)
        }
      }
    })
  }

  // generate all the squares as vertices
  // generate all the edges for each vertices to graph all the paths
  // immediately invoke this method when a Graph is declared
  generatePaths() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const vertexString = [j, i].join('')
        this.addVertex(vertexString)        
      }      
    }
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.addAllEdges([j, i])        
      }      
    }
  }

  // use BFS to find the shortest path from start to end position
  knightMoves(start, end) {
    const visitedArr = new Set()
    const queueArr = []
    queueArr.push([start, [start]])

    while (queueArr.length > 0) {
        const [currentVertex, path] = queueArr.shift()

        if (currentVertex === end) {
            return path
        }

        visitedArr.add(currentVertex)

        const nextMove = this.moveList.get(currentVertex)
        for (const adjacent of nextMove) {
            if (!visitedArr.has(adjacent)) {
                queueArr.push([adjacent, path.concat(adjacent)])
            }
        }
    }
    return null
  }
}

const myGraph = new Graph()
cl(myGraph.knightMoves('00','12')) // [ '00', '12' ]
cl(myGraph.knightMoves('00','33')) // [ '00', '12', '33' ]
cl(myGraph.knightMoves('33','00')) // [ '33', '21', '00' ]
