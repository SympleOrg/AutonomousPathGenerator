export default class Logger {
    element: HTMLElement;
    
    constructor(id: string) {
        this.element = document.getElementById(id)
    }

    log(text: string) {
        this.element.innerText += `${text}\n`
    }

    clear() {
        this.element.innerText = "";
    }
}