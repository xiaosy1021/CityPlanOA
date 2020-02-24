import Vue from 'vue';

import {
    CONSTCFG
} from "@/core/const";

export const treeDicHelper = {
    
    getArrValueByRSearchTree(leafNodeCode,topNodeCode) {
        var arrValue = [];
        var arrMatch = [];
        this.treeRSearch(arrMatch, leafNodeCode, topNodeCode);
        for (var j = arrMatch.length - 1; j >= 0; j--) {
            arrValue.push(arrMatch[j].code)
        }

        return arrValue;
    },
    getDisplayByRSearchTree(leafNodeCode,topNodeCode) {
        var txtDisplay = "";
        var arrMatch = [];
        this.treeRSearch(arrMatch, leafNodeCode, topNodeCode);
        for (var j = arrMatch.length - 1; j >= 0; j--) {
            txtDisplay += arrMatch[j].displayText;
            if (j > 0) {
                txtDisplay += " / ";
            }
        }

        return txtDisplay;
    },

    treeRSearch(arrMatch, childNodeCode, topNodeCode) {
        var node = CONSTCFG.DataDictionary.find(p => p.code == childNodeCode);
        if (node) {
            arrMatch.push(node);
            if (node.parentCode !== topNodeCode) {
                this.treeRSearch(arrMatch, node.parentCode, topNodeCode);
            }
        }
    },

};