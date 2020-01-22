class MainControllerService {
    constructor(parentDiv) {
        this.parentDiv = parentDiv;
    }
    start(){
        this.html = thePageLoader.loadPage("main", this.parentDiv, true);
        
    }
    stop(){
        //TODO: Implement
    }
}