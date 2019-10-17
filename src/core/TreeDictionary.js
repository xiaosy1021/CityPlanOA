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
            arrValue.push(arrMatch[j].Code)
        }

        return arrValue;
    },
    getDisplayByRSearchTree(leafNodeCode,topNodeCode) {
        var txtDisplay = "";
        var arrMatch = [];
        this.treeRSearch(arrMatch, leafNodeCode, topNodeCode);
        for (var j = arrMatch.length - 1; j >= 0; j--) {
            txtDisplay += arrMatch[j].DisplayText;
            if (j > 0) {
                txtDisplay += " / ";
            }
        }

        return txtDisplay;
    },

    treeRSearch(arrMatch, childNodeCode, topNodeCode) {
        var node = CONSTCFG.DataDictionary.find(p => p.Code == childNodeCode);
        if (node) {
            arrMatch.push(node);
            if (node.ParentCode !== topNodeCode) {
                this.treeRSearch(arrMatch, node.ParentCode, topNodeCode);
            }
        }
    },

};