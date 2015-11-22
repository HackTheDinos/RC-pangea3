import api from './api'
import 'styles/style.scss' 
import d3 from 'd3'
import topojsons from './geojson'
import map from 'file!json/map'
import plotPoints from './points'
// import worlds from './topojson'
import _ from 'lodash';
import worlds from './geojson';

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
    const width = window.innerWidth, height = window.innerHeight;
    let isRotating = false;
    let mousePos = [];

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

    const tooltip = d3.select('body')
        .append('div')
        .attr('class', 'map-tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        // .style("visibility", "hidden")
        .style('left', '20px')
        .style('top', '20px')
        .text('a simple tooltip');


    plotPoints(svg, path, projection);
    render(map, path, svg, tooltip);

    let start;
    let frame = 0;
    let locked = false;

    window.foo = () => {
        frame++;
        if (frame < worlds.length) {
            render(worlds[worlds.length - frame - 1], path, svg, tooltip);
        }
    };

    setInterval(window.foo, 100)
    // window.foo()

}


let patch_cache = false;
const patch_fix = (geojson) => {

    console.log(geojson.features.length);

    // reference features
    const features = geojson.features;

    // start a new cache, based on this geojson
    const new_patch_cache = _.reduce(features, (cache, f) => {

        if (!(f.geometry && f.geometry.coordinates.length)) {

            debugger;
        }

        const idx = f.properties['FEATURE_ID'];
        if (!cache[idx]) cache[idx] = [f];
        else cache[idx].push(f);
        return cache;
    }, {});

    // if no previous cache, just use this new one
    if (patch_cache == false) patch_cache = new_patch_cache;

    // check this geojson against previous cache
    // to fill in missing features
    else {
        for (let key in patch_cache) {
            if (!(key in new_patch_cache)) {
                new_patch_cache[key] = patch_cache[key];

                // also update geojson to fill it in
                features.push(...patch_cache[key]);
            }
        }

        patch_cache = new_patch_cache;
    }

    return geojson;
};


function render(mapUrl, path, svg, tooltip) {
    d3.json(mapUrl, function(error, world) {

        // world = patch_fix(world);
        // let year = world.features[0].properties.TIME;
        // document.getElementById('year').innerHTML = year;

        // remove all features
        d3.selectAll('path.feature').remove();

        const data = svg.selectAll('path.feature')
            .data(world.features);

        data.enter()
            .append('path')
            .attr('class', 'feature')
            .style('fill', 'transparent')
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

    });

}
