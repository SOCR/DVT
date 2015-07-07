# DVT
Dynamic Visualization Toolkit
<br>
To install dependancies:
<br>
<ul>
<li>Install <a href= https://nodejs.org/> Node.js</a>, if you haven't done so already</li>
<li> Install Gulp:
<br>
```node
npm install gulp -g
```
</li>
<li>Navigate to lib subdirectory, and install dependancies:
<br>
```node
cd DVT/js/lib
npm install
npm install bower -g
bower install
```
</li>

<br>
To compile:
```node
cd DVT/js/lib
gulp 
```

## Objective

The DVT is a framework from which one can visualize dynamic 4-D models from a given file.
This includes, but is not limited to:

<li> Animated brain tractographies (.TRK files) </li>

<li> Animated meshes </li>

<li> Dynamic volume rendering </li>

<li> Cell and nuclear visualization </li>

