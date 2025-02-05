import { deselectNode } from "./selection.js";
import { state } from "./state.js"

export function deleteItem() {
    let selectedNode = state.selectedNode
    console.log(state.selectedNode)
    if (selectedNode) {
        deselectNode()
        selectedNode.destroy();

    }
}