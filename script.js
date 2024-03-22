let brush = 1
document.getElementById('brushPicker').addEventListener('change', function () { brush = Number(this.options[this.selectedIndex].value) })
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let grid, width, height, cellSize

const colorKey = [
    '#000',
    '#666',
    '#0f0',
    '#00f',
    '#f00'
]

function updateGrid() {
    width = Number(document.getElementById('gridWidth').value)
    height = Number(document.getElementById('gridHeight').value)
    grid = new Array(height).fill(0).map(() => new Array(width).fill(0))
    const boundingBox = document.getElementById('canvasShell').getBoundingClientRect()
    cellSize = Math.min(boundingBox.width / width, boundingBox.height / height)
    canvas.width = width * cellSize
    canvas.height = height * cellSize
    render()
}
document.getElementById('update').addEventListener('click', updateGrid)
updateGrid()

canvas.addEventListener('contextmenu', event => event.preventDefault())

function draw(x, y, brush) {
    grid[y][x] = brush
    render()
}

canvas.addEventListener('mousemove', event => {
    if (event.buttons > 0) draw(
        Math.floor((event.clientX - canvas.getBoundingClientRect().left) / cellSize),
        Math.floor((event.clientY - canvas.getBoundingClientRect().top) / cellSize),
        event.buttons == 1 ? brush : 0
    )
})

canvas.addEventListener('mousedown', event => draw(
    Math.floor((event.clientX - canvas.getBoundingClientRect().left) / cellSize),
    Math.floor((event.clientY - canvas.getBoundingClientRect().top) / cellSize),
    event.button == 0 ? brush : 0
))

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let x = 0; x < grid[0].length; x++)
        for (let y = 0; y < grid.length; y++) {
            ctx.fillStyle = colorKey[grid[y][x]]
            ctx.fillRect(Math.floor(x * cellSize), Math.floor(y * cellSize), Math.ceil(cellSize), Math.ceil(cellSize))
        }
}

window.onresize = updateGrid

document.getElementById('copy').addEventListener('click', async () => {
    try {
        // Write the text to the clipboard
        await navigator.clipboard.writeText('   [\n' + grid.map(row => '[' + row.join(', ') + ']').join(',\n') + '\n],')

        // Alert or log success message
        alert("Grid copied to clipboard")
    } catch (error) {
        // Handle errors
        console.error("Failed to copy text: ", error)
        alert("Failed to copy text: " + error.message)
    }
})
document.getElementById('copyRaw').addEventListener('click', async () => {
    try {
        // Write the text to the clipboard
        await navigator.clipboard.writeText(JSON.stringify(grid))

        // Alert or log success message
        alert("Raw grid copied to clipboard")
    } catch (error) {
        // Handle errors
        console.error("Failed to copy text: ", error)
        alert("Failed to copy text: " + error.message)
    }
})