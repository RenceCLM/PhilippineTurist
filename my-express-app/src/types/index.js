export interface MindmapData {
    id: string;
    title: string;
    nodes: Array<{
        id: string;
        label: string;
        children?: Array<string>;
    }>;
}