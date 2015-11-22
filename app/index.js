import 'styles/style.scss' 
import api from './api'
import plotPoints from './points'
import topojsons from './geojson'
import worlds from './geojson';
import map from 'file!json/map'
import d3 from 'd3'
import _ from 'lodash';

let RECORDS = {};

api.getInterval('Jurassic').then((data)=> {
    addRecords(data.records);
}).then(()=> {
    api.getInterval('Triassic').then((data) => {
        addRecords(data.records);
        drawMap();
    });

});

function addRecords(records) {
    for (let record of records) {
        if (!record || !('oid' in record)) {
            continue;
        }

        const oid = record.oid;
        if (RECORDS[oid]) {
            RECORDS[oid].push(record);
        } else {
            RECORDS[oid] = [record];
        }
    }
}

function findDuplicates(records) {
    for (let oid in records) {
        const record = records[oid];
        if (record.length > 1) {
            const latlng = record.map((r, i) => {
                return `${r.lat}, ${r.lng}`;
            });
            console.log(latlng);
        }
    }
}

function drawMap() {
    const width = window.innerWidth, height = window.innerHeight - 150;
    let isRotating = false;
    let mousePos = [];

    const lambda = d3.scale.linear()
        .domain([0, width])
        .range([-360, 360]);

    const phi = d3.scale.linear()
        .domain([0, height])
        .range([180, -180]);

    const projection = d3.geo.orthographic()
        .scale(250)
        .translate([width / 2, height / 2])
        .clipAngle(90);

    const path = d3.geo.path()
        .projection(projection);

    projection.rotate([82, -44])


    const mapMouseMove = () => {
        if(isRotating){
            const [x, y] = [d3.event.pageX, d3.event.pageY]
            //console.log(lambda(x),phi(y))
            projection.rotate([lambda(x), phi(y)])
            svg.selectAll("path.feature").attr("d", path);
            svg.selectAll("path.fossil").attr("d", function(d) { console.log(path(d)); return path(d); })
        }
    };

    const mapMouseDown = () => {
        d3.event.preventDefault();
        isRotating = true;
    };

    const mapMouseUp = () => {
        d3.event.preventDefault();
        isRotating = false;
    };

    // create map svg
    var svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('id', 'svgmap')
        .on('mousedown', mapMouseDown)
        .on('mousemove', mapMouseMove)
        .on('mouseup', mapMouseUp);

    svg = d3.select('#svgmap')
        .attr('width', width)
        .attr('height', height);

    // create tooltip
    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'map-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style("visibility", "hidden")
        .style('left', '20px')
        .style('top', '20px')
        .text('a simple tooltip');


    let start;
    let year = 0;
    let locked = false;

    window.foo = (givenYear) => {
        if (!givenYear){
            givenYear = year++;

        } 
        if (givenYear < worlds.length) {
            console.log(worlds.length, givenYear)
            render(worlds[worlds.length - givenYear - 1], path, svg, tooltip, projection);
            plotPoints(svg, path, projection);
        }
    };

    // setInterval(window.foo, 100)
    window.foo()

    const slider = document.getElementById('mya')
    slider.max = worlds.length + 1
    slider.addEventListener('change', (e)=>{
        window.foo(parseInt(e.target.value))
    })

}

let patch_cache = false;
const patch_fix = (geojson) => {

    geojson.features = _.filter(geojson.features, f => {
        return f.properties['NAME'] !== 'East Antarctica'
    })
    return geojson
};


function render(mapUrl, path, svg, tooltip, projection) {
    d3.json(mapUrl, function(error, world) {

        world = patch_fix(world);
        let year = world.features[0].properties.TIME;
        document.getElementById('year').innerHTML = year;

        // remove all features
        d3.selectAll('path.feature').remove();

        const data = svg.selectAll('path.feature')
            .data(world.features, (e) => {
                return e.properties.FEATURE_ID
            });

        //plot map
        data.enter()
            .append('path')
            .attr('class', 'feature')
            .style('fill', 'rgba(255,255,255,0.1)')
            .style('stroke', 'grey')
            .attr('d', path)
            .attr('name', path)
            .on('mouseover', (d) => {
                const rect = d3.event.target.getBoundingClientRect()
                tooltip.text(d.properties['NAME'])
                    .style('top', `${Math.floor(rect.top + rect.height/2)}px`)
                    .style('left', `${Math.floor(rect.left + rect.width/2)}px`)
                    .style("visibility", "visible")
            })
            .on('mouseout', (d) => {
                tooltip.style('visibility', 'hidden')
            })


        //plot points
        // svg.select('g.fossils').node()
        const fossil_points = svg.select('g.fossils').node()
        svg.node().removeChild(fossil_points)
        svg.node().appendChild(fossil_points)

        
    });

}
