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
        const lineParts = line.split(/->/);
        const node = lineParts[0];
        const nodeName = node.split(/\(/)[0].trim();
        const weight = parseInt(node.split(/\(/)[1].split(/\)/)[0].trim());
        treeNodes.push(new TreeNode(nodeName, weight));

        if (lineParts.length > 1) {
            const children = lineParts[1].split(/,/).map(name => name.trim());
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