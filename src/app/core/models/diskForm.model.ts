export interface IdiskForm {
    name: string;
    description: string;
}
export interface IdiskEdit extends IdiskForm{
    id: number;
}

export interface IDocumentForm {
    documentName: string;
    documentCode: string;
    documentGroup: string;
}