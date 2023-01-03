class CalcController {

    constructor(){

        this._operation = [];
        
        // Date and Time
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this.initialize();

        this.initButtonsEvents();

    };

    initialize(){

        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

    };

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });
    
    };

    clearAll(){

        this._operation = [];

    };

    clearEntry(){

        this._operation.pop();

    };

    getLastOperation(){
        // Verify the last digit used

        return this._operation[this._operation.length-1];

    };

    setLastOperation(value){
        // Swap last number insertion with his concatenation

        this._operation[this._operation.length-1] = value
    }

    isOperator(value){
        // Search the operator value

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    }

    addOperation(value){

        if (isNaN(this.getLastOperation())){
            // True means string

            if (this.isOperator(value)){
                // Change operator

                this.setLastOperation(value);

            } else if (isNaN(value)){                
                // Something else ponto or igual

                console.log(value);

            }else{
                
                this._operation.push(value);
            
            }

        } else{
            // False means number

            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseInt(newValue));
        };

        console.log(this._operation);

    };

    setError(){
        // Shows a error message on screen

        this.displayCalc = "Error";
        
    };
    setMizeravi(){
        // References

        this.displayCalc = "Acerto";
        
    };

    execBtn(value){

        switch (value) {

            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                this.addOperation('+')
                break;

            case 'subtracao':
                this.addOperation('-')
                break;

            case 'divisao':
                this.addOperation('/')
                break;
            
            case 'multiplicacao':
                this.addOperation('*')
                break;

            case 'porcento':
                this.addOperation('%')
                break;

            case 'igual':
                
                break;

            case 'ponto':
                this.addOperation('.')
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                // Transforms number values from String to Int
                this.addOperation(parseInt(value));
                break;

            default:
                this.setError();
                break;

        };

    };

    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index)=>{

            this.addEventListenerAll(btn, "click drag", e => {

                let textBtn = btn.className.baseVal.replace("btn-","");

                this.execBtn(textBtn);

            });

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {

                btn.style.cursor = "pointer";

            });

        });

    };

    // *Date and Time*

    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

    };

    get displayTime(){

        return this._timeEl.innerHTML;

    };

    set displayTime(value){

        return this._timeEl.innerHTML = value;

    };

    get displayDate(){

        return this._dateEl.innerHTML;

    };

    set displayDate(value){

        return this._dateEl.innerHTML = value;

    };

    get displayCalc(){

        return this._displayCalcEl.innerHTML;

    };

    set displayCalc(value){

        this._displayCalcEl.innerHTML = value;

    };

    get currentDate(){

        return new Date();

    };

    set currentDate(value){

        this._currentDate = value;

    };

    // *End Date and Time*

}