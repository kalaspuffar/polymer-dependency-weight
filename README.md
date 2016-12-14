# polymer-dependency-weight
Will count the weight of the dependency graph and visualize it.

### Todo
- Add polymer analyzer
- Analyze file and find all dependency
- Count sizes using file size?
- Analyze directories
- visualize result.

### Installation

Installation can be done using a simple node install step.

```node
npm install -g polymer-dependency-weight
```

### Usage

You'll run the application with the source directories you want to analyze for
dependencies.

```node
polymer-dependency-weight [dir1..dir(n)]
```

### Output

We will visualize the output data as a tree structure you can browse to figure
out which branch has the most weight so you can prune your dependency tree.
