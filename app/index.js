import api from './api'
import 'styles/style.scss' 
import d3 from 'd3'
// import topojsons from './topojson'
import topojsons from './geojson'
import map from 'file!json/map'

let RECORDS = {}

api.getInterval('Jurassic').then((data)=>{
    addRecords(data.records)
}).then(()=> {
    api.getInterval('Triassic').then((data) => {
        addRecords(data.records)
        drawMap()
    })

})

function addRecords(records){
    for(let record of records){
        if (!record || !('oid' in record)){
            continue;
        }

        const oid = record.oid
        if (RECORDS[oid]){
            RECORDS[oid].push(record)
        }
        else {
            RECORDS[oid] = [record]
        }
    }
}

function findDuplicates(records){
    for (let oid in records){
        const record = records[oid]
        if(record.length > 1){
            const latlng = record.map((r, i) =>{
                return `${r.lat}, ${r.lng}`
            })
            console.log(latlng)
        }
    }
}


function drawMap(){
    const width = window.innerWidth, height = window.innerHeight;
    let isRotating = false
    let mousePos = []

    const lambda = d3.scale.linear()
        .domain([0, width])
        .range([-360, 360]);

    const phi = d3.scale.linear()
        .domain([0, height])
        .range([180, -180]);

    const projection = d3.geo.orthographic()
        .scale(300)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    const path = d3.geo.path()
        .projection(projection);


    const mapMouseMove = () => {
        if(isRotating){
            const [x, y] = [d3.event.pageX, d3.event.pageY]
            projection.rotate([lambda(x), phi(y)])
            svg.selectAll("path").attr("d", path);
        }
    }

    const mapMouseDown = () => {
        d3.event.preventDefault()
        isRotating = true
    }

    const mapMouseUp = () => {
        d3.event.preventDefault()
        isRotating = false
    }


    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "svgmap")
        .on('mousedown', mapMouseDown)
        .on('mousemove', mapMouseMove)
        .on('mouseup', mapMouseUp)


    svg = d3.select("#svgmap")
        .attr("width", width)
        .attr("height", height);

    let start;
    let frame = 0;
    let locked = false

    window.foo = () =>{
        frame++
        if(frame < topojsons.length) render(topojsons[topojsons.length - frame - 1], path, svg)
    }

    setInterval(window.foo, 100)

}

function render(mapUrl, path, svg){
    d3.json(mapUrl, function(error, world) { 
        console.log(world.features[0].properties.TIME)
        svg.selectAll("path").remove()
        const data = svg.selectAll("path")
            .data(world.features, (e) => {
                return e.properties['FEATURE_ID']
            })


        data.enter()
            .append("path")
            .attr("class", "feature")
            .style("fill", "white")
            .style("stroke", 'grey')
            .attr("d", path)

    });

}