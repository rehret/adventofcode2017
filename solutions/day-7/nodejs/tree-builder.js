'use strict';

module.exports.TreeBuilder = class TreeBuilder {
    static GetRootTreeNode(input) {
        const treeNodes = parse(input);
        const rootNodeIndex = treeNodes.reduce((rootIndex, node, index, arr) => {
            if (arr.some(n => n.children.filter(c => c.name === node.name).length > 0)) {
                return rootIndex;
            } else {
                return index;
            }
        }, 0);
        return treeNodes[rootNodeIndex];
    }
};

function parse(input) {
    const treeNodes = [];
    const childrenToAssociate = [];
    input.split(/\n/).forEach(line => {
        // Matches
        // matches[0] -- original string
        // matches[1] -- node name
        // matches[2] -- node weight
        // matches[3] -- '-> node1, node2, node3'
        // matches[4] -- 'node1, node2, node3'
        const matches = line.match(/(\w+)\s\((\d+)\)(\s->\s((\w+(,\s)?)+))?/);
        const nodeName = matches[1];
        const weight = parseInt(matches[2]);
        treeNodes.push(new TreeNode(nodeName, weight));

        if (matches[3] !== undefined) {
            const children = matches[4].split(/,/).map(name => name.trim());
            childrenToAssociate.push({
                name: nodeName,
                children: children
            });
        }
    });

    childrenToAssociate.forEach(childMapping => {
        const parent = treeNodes.filter(node => node.name === childMapping.name)[0];
        childMapping.children.forEach(child => {
            parent.children.push(treeNodes.filter(node => node.name === child)[0]);
        });
    });

    return treeNodes;
}

class TreeNode {
    constructor(name, weight) {
        this.name = name;
        this.weight = weight;
        this.children = [];
    }
}