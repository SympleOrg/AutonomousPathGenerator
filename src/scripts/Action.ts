export type actionType = "scoreOnChamber" | "wait" | "takeFromWall" | "pickupFromFloor" | "intakeToBasket" | "scoreBasket" | "none"

export default class Action {
    id: string
    type: actionType
    data: any  

    constructor(id: string, type: actionType, data: any = {}) {
        this.id = id
        this.type = type
        this.data = data
    }

    toCommand(): string {
        if(this.type == "none") return "";
        let command = this.type + "(" + Object.values(this.data).join(", ") + ")"
        return command;
    }

    toHtml(): string {
        let template = document.getElementById("action-list-item-" + this.type).innerHTML
        template = template.replace(/{{actionId}}/g, this.id)
        for(const key of Object.keys(this.data)) {
            template = template.replace(new RegExp(`{{data.${key}}}`, "g"), this.data[key])
        }
        return template
    }

    toJson(): any {
        return {
            id: this.id,
            type: this.type,
            data: this.data
        }
    }

    static fromJson(json: any): Action {
        return new Action(json.id, json.type, json.data)
    }
}