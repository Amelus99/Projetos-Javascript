class CalcController {

    constructor(){

        //Audio
        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;

        //Calcs
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        
        // Date and Time
        this._locale = 'pt-BR';
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;

        this.initialize();

        this.initButtonsEvents();

        //Initialize Keyboard digits
        this.initKeyboard();

    };

    // *Functions*

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
           let text = e.clipboardData.getData('Text');
           this.displayCalc = parseFloat(text);
        });
    };

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    };

    initialize(){

        this.setDisplayDateTime();

        setInterval(()=>{

            this.setDisplayDateTime();

        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });
        });

    };
    
    toggleAudio(){
       this._audioOnOff = !this._audioOnOff;
    };

    playAudio(){

        if( this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        };

    };

    initKeyboard(){
        document.addEventListener('keyup', e=>{

            this.playAudio();

            switch (e.key) {

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case '+':
                case '-':
                case '/':
                case '*':
                case '%':
                    this.addOperation(e.key)
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':
                case ',':
                    this.addDot();
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
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
    
            };

        });
    };

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event => {

            element.addEventListener(event, fn, false);

        });
    
    };

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    };

    clearEntry(){

        this._operation.pop();

        this.setLastNumberToDisplay();

    };

    getLastOperation(){
        // Verify the last digit used

        return this._operation[this._operation.length-1];

    };

    setLastOperation(value){
        // Swap last number insertion with his concatenation

        this._operation[this._operation.length-1] = value;
    };

    isOperator(value){
        // Search the operator value

        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);

    };

    pushOperation(value){
        // Inserts the new operation on the Array

        this._operation.push(value);

        if(this._operation.length > 3){

            this.calc();

        };

    };

    getResult(){
        try{
        return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setMizeravi();
            }, 1);
            
        };
    };

    calc(){

        let last = '';

        this._lastOperator = this.getLastItem(); 

        if(this._operation.length < 3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3){
            last = this._operation.pop();
           
            this._lastNumber = this.getResult();
        } else if (this._operation.length == 3){
                                 
            this._lastNumber = this.getLastItem(false);
        };
        
        let result = this.getResult();

        if(last == '%'){

            result /= 100;

            this._operation = [result];

        }else{

            this._operation = [result];

            if (last) this._operation.push(last);
  
        };
        
        this.setLastNumberToDisplay();

    };

    getLastItem(isOperator = true){
        let lastItem;
    
        for (let i = this._operation.length-1; i >= 0; i--){
            // Searches for the last Item
            if(this.isOperator(this._operation[i]) == isOperator){
                // If it is a operator set the variable
                lastItem = this._operation[i]
                break;
            };
 
        };

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        };

        return lastItem;

    };

    setLastNumberToDisplay(){
         
        let lastNumber = this.getLastItem(false);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;

    };

    addOperation(value){

        if (isNaN(this.getLastOperation())){
            // True means string

            if (this.isOperator(value)){
                // Change operator

                this.setLastOperation(value);

            } else{
                
                this.pushOperation(value);

                this.setLastNumberToDisplay();
            
            };

        } else{
            // False means number

            if (this.isOperator(value)){
                // Verify if the value is an operator
                
                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                // Update display

                this.setLastNumberToDisplay();

            };

            
        };

    };

    setError(){
        // Shows a error message on screen

        this.displayCalc = "Error";
        
    };

    setMizeravi(){
        // References

        this.displayCalc = "Acertô";
        
    };

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    };

    execBtn(value){

        this.playAudio();

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
                this.calc();
                break;

            case 'ponto':
                this.addDot();
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

    // *End*

    // *Getters and Setters - Display, Date and Time*

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

        if(value.toString().length > 10){
            this.setError();
            return false;
        };

        this._displayCalcEl.innerHTML = value;

    };

    get currentDate(){

        return new Date();

    };

    set currentDate(value){

        this._currentDate = value;

    };

    // *End*
};