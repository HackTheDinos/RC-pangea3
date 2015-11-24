# FOSSILS ON ANCIENT MAPS!

Visualize fossil paleogeography superimposed on continental drift over 230 million years.

## [hackthedinos.github.io/RC-pangea3/public](http://hackthedinos.github.io/RC-pangea3/public)

<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11322974/9e572610-910b-11e5-9775-698cbe868a67.png' height='59px'/></a>

**Team RC-Pangea**
 * Harry Truong @harrytruong 
 * Jackie Gu @jackielgu
 * Miriam Shiffman @meereeum
 * Sher Minn Chong @piratefsh
 * Shad Hopson @Shadhopson

## Development 
### Install
```
npm install
npm install webpack-dev-server webpack -g
```

### Serve

To serve at http://localhost:8080/:

```
webpack-dev-server --inline  --content-base public/ 
```

### Build

To compile HTML/CSS and JavaScript files for production:

```
webpack --config webpack.config.js
```

## Data

* Continental drift model --> Müller <i>et al.</i> (2016) [Ocean basin evolution and global-scale plate reorganization events since Pangea breakup](http://www.earthbyte.org/ocean-basin-evolution-and-global-scale-plate-reorganization-events-since-pangea-breakup/).

* Fossil specimens --> [The Paleobiology Database](https://paleobiodb.org/).
