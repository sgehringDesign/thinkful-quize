
(function () {
    
    
    // CODING NOTES: Still working this out!
    
    
    //- QUIZE ( OBJECT ) ==============================================
    //-- DESCRIPTION: COLLECTION OF QUESTIONS

    //-- PRIVATE / PROTECTED PROPERTIES:
    //----- debug = boolean
    //----- loaded = boolean
    //----- current = int
    //----- src = string
    //----- questions = array
    //----- results = object { 
    //-----   correct = int
    //-----   incorrect = int
    //-----   attempts = int  
    //----- }
    //----- completed = boolean
    
    //-- PUBLIC METHODS:
    //----- isLoaded() : return protected "loaded" property
    //----- isCompleted() : return protected "completed" property
    //----- getCurrent() : return protected "current" property
    //----- setCorrect(value) : default is 1
    //----- setIncorrect(value) : default is 1
    
    var quizeMaker = function (options) {
        
        if (typeof(options)==='undefined') src = {};
        
        debug('LOG: surveyMaker() -----------------');
        debug(options);
                
        var Quize = {},
            src = src,
            debug = debug,
            current = 0,
            loaded = false,
            questions = [],
            completed = false,
            results = {
                correct: 0,
                incorrect: 0,
                attempts: 0
            }
            
            
        $.ajax({
            url:src, 
            dataType: "json",  
            beforeSend: function( xhr ) {
                debug('LOG: GETTING JSON DATA QUESTIONS');
                debug(xhr); 
            },
        })
        .done(function( jsonData ) {

            debug('LOG: RETURN JSON DATA QUESTIONS');
            debug(jsonData);
            
            if(jsonData.hasOwnProperty('questions') === false){
                debug('ERROR: ERROR DATA RETURN WITH NO "questions"');
                return false;
            }     
            
            debug('LOG: LOOPING QUESTIONS');
            $.each( jsonData.questions, function( key, attributes ) {
                
                debug('LOG: LOOPING [' + key + '] QUESTION');
                
                if(value.hasOwnProperty('question') === false) {
                    debug('ERROR: DATA ' + key + ' RETURN WITH NO "questions"');
                    return false;
                }
                
                if(value.hasOwnProperty('answer') === false) {
                    debug('ERROR: DATA ' + key + ' RETURN WITH NO "answer"');
                    return false;
                }
                
                if(value.hasOwnProperty('required') === false) {
                    debug('ERROR: DATA ' + key + ' RETURN WITH NO "required"');
                    return false;
                }
                
                if(value.hasOwnProperty('tag') === false) {
                    debug('ERROR: DATA ' + key + ' RETURN WITH NO "tag"');
                    return false;
                }
                
                debug('LOG: CREATE AND PUSH QUESTION OBJECT to "questions" ARRAY ');
                questions.push( questionMaker(attributes) );
                return true;                
            });  
            
            debug(questions);                            
            
            debug('LOG: ASSIGN DATA TO PRIVATE "data" PROPERTY');
            loaded = true; 
                
            window.onhashchange = function () {
                debug('LOG: onhashchange() Event');
                //setQuestionNumber();
                //$("#question").html(data.questions[current].question);
            }
                
            $(document).ready(function(){      
                debug('LOG: domready() Event');
                //setQuestionNumber();
                //$("#question").html(data.questions[current].question);
                //getQuestionInput();
            });
            
        });
                    
        // Quize.isLoaded() -------------------------------
        //-- RETURNS: protected "loaded"
        Quize.isLoaded = function() {
            debug('LOG: isLoaded() : return ' + loaded + ' ------------------------------');
            return loaded;
        };  
        
        // Quize.isCompleted() ----------------------------
        //-- RETURNS: protected "completed" property
        Quize.isCompleted = function() {
            debug('LOG: isCompleted() : return ' + completed+ ' ------------------------------');
            return completed;
        };
        
        // Quize.getCurrent() -----------------------------
        //-- RETURNS: protected "current" property... question
        Quize.getCurrent = function() {
            debug('LOG: getCurrent() : return ' + current+ ' ------------------------------');
            return current;
        };
        
        // Quize.setCurrent() -----------------------------
        //-- PARAMETERS: value is the current question number to be set... default: 0
        //-- RETURNS: true of false
        Quize.setCurrent = function(value) {
            debug('LOG: setCurrent() : passed ' + value+ ' ------------------------------');
            
            if(typeof value === 'undefined') {
                debug("ERROR: value not passed");
            }
            
            
            /*
                Note: 
                I Want to prtect set to ensure the UI get updated
                
                psuedo code
                1) if value is int proceed
                2) if value is in range of questions length proceed
                3) change up the UI to new set current value?
                4) once ui is succesfully changed set current?    
            */
            
        };
                
                
        //- Quize.setCorrect() -----------------------------
        //-- PARAMETERS: value = optional : default will be 1
        Quize.setCorrect = function(value) {
            debug('LOG: setCorrect( ' + value + ' )'+ ' ------------------------------');
            
            // SET DEFAULT TO 1 IF "undefined"
            if (typeof(value)==='undefined') value = 1;
            
            // IF RESULTS ADDS UP TO TOTAL QUESTIONS.. DECREMENT "incorrect"
            if(( results.correct + results.incorrect ) === questions.length ) {
                results.incorrect = results.incorrect - value;
                debug('LOG: DECREMENT INCORRECT: ' + results.correct );
            } 
            
            results.correct = results.correct + value;
            debug('LOG: SET CORRECT: ' + results.correct );
        };
        
        
        //- Quize.setIncorrect() -----------------------------
        //-- PARAMETERS: value = optional : default will be 1
        Quize.setIncorrect = function(value) {
            debug('LOG: setIncorrect( ' + value + ' )'+ ' ------------------------------');
            
            // SET DEFAULT TO 1 IF "undefined"
            if (typeof(value)==='undefined') value = 1;
            
            // IF RESULTS ADDS UP TO TOTAL QUESTIONS.. DECREMENT "correct"
            if(( results.incorrect + results.incorrect ) === questions.length ) {
                results.correct = results.correct - value;
                debug('LOG: DECREMENT CORRECT: ' + results.correct );
            } 
            
            results.incorrect = results.incorrect + value;
            debug('LOG: SET INCORRECT: ' + results.incorrect );
            
        };
    
        return Quize;
        
    };
    
    
        
    
    //- QUESTION --------------------------------------
    //-- NOTES: EACH QUESTION OBJECT
    
    //-- PRIVATE / PROTECTED PROPERTIES:
    //----- answer = string
    //----- label = string
    //----- correct = boolean
    //----- required = boolean
    //----- attempts = int
    //----- tag = object -- "inputTag"
    
    //-- PUBLIC PROPERTIES:
    //----- input = string : users attempted answer

    //-- PUBLIC METHODS:
    //----- validate() : validates user input... returns true or false
    //----- getQuestion() : return protected "loaded" property
    
    var questionMaker = function (attributes) {
        
        debug('LOG: questionMaker( )'+ ' ------------------------------');
        debug(attributes);
                
        if(typeof attributes === 'undefined') {
            debug('ERROR: attributes not passed' + attributes + 'returned false' );
            return false;
        }
        
        if(attributes.hasOwnProperty('question') === false) {
            debug("ERROR: attributes.question not passed returned false" );
            return false;
        }
        
        if(attributes.hasOwnProperty('answer') === false) {
            debug("ERROR: attributes.answer not passed returned false" );
            return false;
        }
        
        if(attributes.hasOwnProperty('required') === false) {
            debug("LOG: required not passed, set to false" ); 
            attributes.required = false;
        }
        
        if(typeof attributes.required !== boolean) {
            debug("LOG: required missing, set defualt to false" );
            attributes.required = false;
        }
        
        var Question = {},
            answer = answer,
            question = question,
            required = required,
            tag = tagObj,
            correct = false,
            attempts = 0;
            
        Question.input = "";
                                
        Question.validate = function(value) {
            Question.input = value;
            if(answer === value) {
                question.valid = true;
                return true;
            } else {
                question.valid = false;
                return false;
            }
        };
        
        Question.getQuestion = function() {            
            debug('LOG: getQuestion( )'+ ' ------------------------------');
            
            var questionWrapper = $("<div>", {"class" : "form-group"}),
                questionLabel = $("<label>", {
                    'id' : "question", 
                    "text" : question, 
                    "for": "[ tag.getTagId() ]"
                });
            
            if(required === true) {
                questionLabel.addClass('required');
            }
            
            $(questionWrapper).append(questionLabel);
            
            // NEED TO BUILD OUT QUESTION INPUTS HERE
            
        };

        
        return Question;
        
    };
    
    
    
    
    
    
    
    //- INPUTTAG  --------------------------------------
    //-- NOTES: INPUT TAG OBJECT.  
    //          EXTENDING TO MERGE OPTION WITH THE TAG & ADD VALIDATION
     
    //-- PROPERTIES:
    //---- "tagName": string
    //---- "name" : string
    //---- "type": string
    //---- "options": array
    
    //-- METHODS:
    
    var inputTagMaker = function (tagName, attributes, options) {
        
        
        if(typeof tagName === 'undefined') {
            debug('ERROR: tagName not passed' +tagName + 'returned false' );
            return false;
        }
        
        if (typeof(attributes)==='undefined') attributes = {};
        if (typeof(options)==='undefined') options = {};
        
        if(tagName.toLowerCase() === 'input') {
            
            if(attributes.hasOwnProperty('type') === false) {
                debug('ERROR: attributes.type not passed' + attributes + 'returned false' );
                return false;
            } 
            
            if(attributes.hasOwnProperty('name') === false) {
                debug('ERROR: attributes.name not passed' + attributes + 'returned false' );
                return false;
            }                 
                
            debug('ERROR: tagName not passed' +tagName + 'returned false' );
            return false;
        }

        
        var InputTag = {};
        
        inputTag.tagName = tagName;
        inputTag.attributes = attributes;
        inputTag.options = options;
                
        
        getTag = function(tagName, attributes) {
            
            debug('LOG: getTag( ) : Private ' + ' ------------------------------');
            
            if (typeof(attributes)==='undefined') attributes = {};

            var tag = $('<' + tagName.toLowerCase().replace(/[^a-zA-Z]+/g) + '/>');
            debug(tag);

            if(attributes.length > 0) {
                $.each( attributes.options, function(attributeName, attributeValue ) {
                    debug('LOG: ADDING: '+attributeName +' = ' + attributeValue);
                    tag.attr(attributeName.toLowerCase().replace(/[^a-zA-Z]+/g,""), attributeValue.toLowerCase().replace(/[^0-9a-z-]/g,""));
                });
            } 
            
            debug(tag);
            return tag;
        };
                
        // InputTag.set() -----------------------------
        //-- PARAMETERS: name, value...   
        //----- if name = "tagName" : set the html tagName
        //----- if name = "options" : push to the option in array
        //----- if name set attribute set the option in array
        
        //-- RETURNS: true of false        
        InputTag.set = function(name, value) {
            if(name.toLowerCase() = 'tagname') {
                inputTag.tagName = value;
                return true;
            }
            if(name.toLowerCase() = 'options') {
                inputTag.options.push(value);
                return true;
            }
            inputTag.attributes[name.replace(/[^a-zA-Z]+/g,"")] = value.replace(/[^0-9a-z-]/g,"");
            return true;
        };
        
        
        // InputTag.get() -----------------------------
        InputTag.get = function(name) {       
                 
            if (typeof(name)==='undefined') name = 'tag';
            
            debug('LOG: InputTag.get( ) : Public ' + name  + ' ------------------------------');
            
            if(name === 'tagName') {
                debug('LOG: getting tagName: '+ inputTag.tagName);
                return inputTag.tagName.toLowerCase().replace(/[^a-zA-Z]+/g,"");
            }
                        
            if(name === 'tag') {
                
                if(inputTag.tagName.toLowerCase().replace(/[^a-zA-Z]+/g,"") === 'input') {
                    $.each( inputTag.options, function(name, value ) {
                    
                    });
                }
                
                if(this.tagName.toLowerCase().replace(/[^a-zA-Z]+/g,"") === 'select') {
                    
                }
                                           
            }

            debug('LOG: getting attribute ' + name.toLowerCase() + ': '+ inputTag.attributes[name] );
            return inputTag.attributes[name];
        };
        
    };
    
    
}());

